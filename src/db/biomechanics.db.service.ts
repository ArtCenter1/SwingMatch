/**
 * ============================================================
 *  BIOMECHANICS DATABASE SERVICE  (expo-sqlite)
 *
 *  Dedicated service for swing analysis persistence.
 *  Uses the same `boilerplate.db` WAL-mode file — all tables
 *  share one file so rollback and backup are atomic.
 *
 *  Tables:
 *   swing_sessions          — one row per analysis
 *   biomechanics_corrections — zero-or-more faults per session
 *   player_stats            — denormalised aggregate (1 row / device)
 *
 *  ARCHITECTURE:
 *   Singleton instance. Call `init()` on app start (in _layout.tsx).
 *   Camera screen calls `persistAnalysis()` fire-and-forget after
 *   each successful Gemini analysis. The coach AI calls
 *   `getSessions()` / `getPlayerStats()` via registered tools.
 * ============================================================
 */

import * as SQLite from 'expo-sqlite';
import { FEATURES } from '../config/features';

// ── Schema Types ──────────────────────────────────────────────────

export interface SwingSession {
  id: number;
  shotType: string;
  overallScore?: number;
  assessmentScore?: number;
  rawText: string;
  videoUri?: string;
  emotion?: string;
  durationSeconds?: number;
  createdAt: number;
}

export interface BiomechanicsCorrection {
  id: number;
  sessionId: number;
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface PlayerStats {
  id: number;
  totalSessions: number;
  avgScore: number;
  bestScore: number;
  commonFault: string;
  streakDays: number;
  strengthsJson: string;
  updatedAt: number;
}

// ── Parsed Analysis ────────────────────────────────────────────────

export interface ParsedAnalysis {
  shotType: string;
  overallScore?: number;
  assessmentScore?: number;
  emotion?: string;
}

// ── Service ────────────────────────────────────────────────────────

class BiomechanicsDbService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    if (!FEATURES.localDatabase) return;
    if (this.db) return; // already initialised

    this.db = await SQLite.openDatabaseAsync('boilerplate.db');
    await this.createTables();
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;
    await this.db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS swing_sessions (
        id                INTEGER PRIMARY KEY AUTOINCREMENT,
        shot_type         TEXT    NOT NULL DEFAULT 'unknown',
        overall_score     INTEGER,
        assessment_score  INTEGER,
        raw_text          TEXT    NOT NULL DEFAULT '',
        video_uri         TEXT,
        emotion           TEXT    DEFAULT 'neutral',
        duration_seconds  INTEGER,
        created_at        INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS biomechanics_corrections (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id  INTEGER NOT NULL REFERENCES swing_sessions(id) ON DELETE CASCADE,
        category    TEXT    NOT NULL,
        description TEXT    NOT NULL,
        severity    TEXT    NOT NULL DEFAULT 'medium'
                          CHECK(severity IN ('low','medium','high'))
      );

      CREATE TABLE IF NOT EXISTS player_stats (
        id             INTEGER PRIMARY KEY CHECK(id = 1),
        total_sessions INTEGER NOT NULL DEFAULT 0,
        avg_score      REAL    NOT NULL DEFAULT 0,
        best_score     INTEGER NOT NULL DEFAULT 0,
        common_fault   TEXT    NOT NULL DEFAULT '',
        streak_days    INTEGER NOT NULL DEFAULT 0,
        strengths_json TEXT   NOT NULL DEFAULT '{}',
        updated_at     INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_sessions_created ON swing_sessions(created_at);
      CREATE INDEX IF NOT EXISTS idx_sessions_shot    ON swing_sessions(shot_type);
      CREATE INDEX IF NOT EXISTS idx_corr_session     ON biomechanics_corrections(session_id);
      CREATE INDEX IF NOT EXISTS idx_corr_category    ON biomechanics_corrections(category);
    `);
  }

  private getDb(): SQLite.SQLiteDatabase {
    if (!this.db)
      throw new Error('[BiomechanicsDbService] Not initialised. Call init() first.');
    return this.db;
  }

  // ── Heuristic Text Parser ───────────────────────────────────────

  /**
   * Extract structured fields from raw Gemini analysis text.
   *
   * Rules (applied in order):
   *  1. shotType  — first heading that matches a known shot keyword
   *  2. overallScore  — number in "X/10" or "X out of 10" format
   *  3. assessmentScore  — number near "assessment" or "grade" label
   *  4. emotion — one of neutral, positive, frustrated, excited, focused
   */
  parseAnalysisText(rawText: string): ParsedAnalysis {
    const text = rawText.trim();
    const lower = text.toLowerCase();

    // ① shot type
    const shotKeywords: [string, string][] = [
      ['serve', 'Serve'],
      ['forehand', 'Forehand'],
      ['backhand', 'Backhand'],
      ['volley', 'Volley'],
      ['slice', 'Slice'],
      ['overhead', 'Overhead Smash'],
      ['drop shot', 'Drop Shot'],
    ];
    let shotType = 'unknown';
    for (const [keyword, label] of shotKeywords) {
      if (lower.includes(keyword)) {
        shotType = label;
        break;
      }
    }

    // ② overall score — "7/10", "8 out of 10", "Score: 6/10"
    const overallMatch = text.match(/(?:overall|score|grade)\s*[:\s]?\s*(\d)\s*(?:\/\s*10|out of 10)?/i);
    const overallScore = overallMatch ? Math.min(10, Math.max(1, parseInt(overallMatch[1], 10))) : undefined;

    // ③ assessment score — labelled "Assessment: 7" / "Grade: 8" near strength tags
    const assessMatch = text.match(/(?:assessment|grade)\s*[:\s]+(\d)/i);
    const assessmentScore = assessMatch ? Math.min(10, Math.max(1, parseInt(assessMatch[1], 10))) : undefined;

    // ④ emotion — infer from sentiment cues
    let emotion: string | undefined;
    const positiveCues = ['good job', 'nice', 'improved', 'well done', 'excellent', 'great progress'];
    const frustratedCues = ['struggl', 'difficult', 'confused', 'mistake', 'poor', 'needs work'];
    const excitedCues = ['awesome', 'amazing', 'fantastic', 'incredible', 'outstanding', 'brilliant'];

    if (positiveCues.some((c) => lower.includes(c))) emotion = 'positive';
    else if (frustratedCues.some((c) => lower.includes(c))) emotion = 'frustrated';
    else if (excitedCues.some((c) => lower.includes(c))) emotion = 'excited';
    else if (lower.includes('focus')) emotion = 'focused';

    return { shotType, overallScore, assessmentScore, emotion };
  }

  // ── Public API ──────────────────────────────────────────────────

  /**
   * Persist a completed swing analysis + auto-extracted corrections.
   * Call fire-and-forget: do NOT await in the camera screen.
   */
  async persistAnalysis(params: {
    rawText: string;
    videoUri?: string;
    durationSeconds?: number;
  }): Promise<number> {
    const { rawText, videoUri, durationSeconds } = params;
    const parsed = this.parseAnalysisText(rawText);
    const db = this.getDb();

    const sessionId = await db.runAsync(
      `INSERT INTO swing_sessions
         (shot_type, overall_score, assessment_score, raw_text, video_uri, emotion, duration_seconds, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parsed.shotType,
        parsed.overallScore ?? null,
        parsed.assessmentScore ?? null,
        rawText,
        videoUri ?? null,
        parsed.emotion ?? null,
        durationSeconds ?? null,
        Date.now(),
      ]
    );

    const newId = sessionId.lastInsertRowId as number;

    // Auto-extract corrections from raw text
    const corrections = this.extractCorrections(rawText);
    if (corrections.length > 0) {
      for (const c of corrections) {
        await db.runAsync(
          `INSERT INTO biomechanics_corrections (session_id, category, description, severity)
           VALUES (?, ?, ?, ?)`,
          [newId, c.category, c.description, c.severity]
        );
      }
    }

    // Update player stats aggregate
    await this.rebuildPlayerStats();

    return newId;
  }

  /**
   * Return all swing sessions ordered newest first.
   */
  async getSessions(limit = 50): Promise<SwingSession[]> {
    const db = this.getDb();
    const rows = await db.getAllAsync<any>(
      `SELECT * FROM swing_sessions ORDER BY created_at DESC LIMIT ?`,
      [limit]
    );
    return rows.map((r) => ({
      id: r.id,
      shotType: r.shot_type,
      overallScore: r.overall_score ?? undefined,
      assessmentScore: r.assessment_score ?? undefined,
      rawText: r.raw_text,
      videoUri: r.video_uri ?? undefined,
      emotion: r.emotion ?? undefined,
      durationSeconds: r.duration_seconds ?? undefined,
      createdAt: r.created_at,
    }));
  }

  /**
   * Return all corrections for a given session.
   */
  async getCorrections(sessionId: number): Promise<BiomechanicsCorrection[]> {
    const db = this.getDb();
    const rows = await db.getAllAsync<any>(
      `SELECT * FROM biomechanics_corrections WHERE session_id = ? ORDER BY id ASC`,
      [sessionId]
    );
    return rows.map((r) => ({
      id: r.id,
      sessionId: r.session_id,
      category: r.category,
      description: r.description,
      severity: r.severity as BiomechanicsCorrection['severity'],
    }));
  }

  /**
   * Return current player aggregate stats.
   */
  async getPlayerStats(): Promise<PlayerStats | null> {
    const db = this.getDb();
    const row = await db.getFirstAsync<any>(`SELECT * FROM player_stats WHERE id = 1`);
    if (!row) return null;
    return {
      id: row.id,
      totalSessions: row.total_sessions,
      avgScore: row.avg_score,
      bestScore: row.best_score,
      commonFault: row.common_fault,
      streakDays: row.streak_days,
      strengthsJson: row.strengths_json,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Return all sessions grouped by shot type.
   * Used by the progress screen to show per-shot statistics.
   */
  async getSessionsByShotType(): Promise<
    { shotType: string; sessionsCount: number; avgScore: number }[]
  > {
    const db = this.getDb();
    const rows = await db.getAllAsync<any>(
      `SELECT
         shot_type,
         COUNT(*)   AS sessions_count,
         AVG(overall_score) AS avg_score
       FROM swing_sessions
       GROUP BY shot_type
       ORDER BY sessions_count DESC`
    );
    return rows.map((r) => ({
      shotType: r.shot_type,
      sessionsCount: Number(r.sessions_count),
      avgScore: r.avg_score != null ? parseFloat(r.avg_score) : 0,
    }));
  }

  /**
   * Return correction counts grouped by category.
   */
  async getCorrectionsByCategory(): Promise<
    { category: string; count: number }[]
  > {
    const db = this.getDb();
    const rows = await db.getAllAsync<any>(
      `SELECT category, COUNT(*) AS count
       FROM biomechanics_corrections
       GROUP BY category
       ORDER BY count DESC`
    );
    return rows.map((r) => ({ category: r.category, count: Number(r.count) }));
  }

  /**
   * Return a summary of recent sessions for a quick progress panel.
   */
  async getProgressSummary(): Promise<{
    totalSessions: number;
    avgScore: number;
    bestScore: number;
    sessions: SwingSession[];
  }> {
    const [sessions, stats] = await Promise.all([
      this.getSessions(10),
      this.getPlayerStats(),
    ]);
    return {
      totalSessions: stats?.totalSessions ?? sessions.length,
      avgScore: stats?.avgScore ?? 0,
      bestScore: stats?.bestScore ?? 0,
      sessions,
    };
  }

  // ── Private helpers ─────────────────────────────────────────────

  /**
   * Heuristically split a Gemini analysis body into correction blobs,
   * one per "area that needs work" paragraph, then categorise each.
   */
  private extractCorrections(rawText: string): { category: string; description: string; severity: 'low' | 'medium' | 'high' }[] {
    const lower = rawText.toLowerCase();

    const categoryKeywords: { key: string; label: string }[] = [
      { key: 'footwork', label: 'footwork' },
      { key: 'stance', label: 'footwork' },
      { key: 'positioning', label: 'footwork' },
      { key: 'grip', label: 'grip' },
      { key: 'swing path', label: 'swing_path' },
      { key: 'backswing', label: 'swing_path' },
      { key: 'back-swing', label: 'swing_path' },
      { key: 'follow-through', label: 'follow_through' },
      { key: 'follow through', label: 'follow_through' },
      { key: 'rotation', label: 'body_rotation' },
      { key: 'torso', label: 'body_rotation' },
      { key: 'hip', label: 'body_rotation' },
      { key: 'contact point', label: 'contact_point' },
      { key: 'timing', label: 'timing' },
      { key: 'racket', label: 'racket_position' },
      { key: 'preparation', label: 'preparation' },
    ];

    // Split text into logical blocks: every 2–3 sentences
    const sentences = rawText.split(/(?<=[.!?])\s+/);
    const corrections: { category: string; description: string; severity: 'low' | 'medium' | 'high' }[] =
      [];

    const oblivionedZone = ['improve', 'could be', 'work on', 'focus on', 'try to', 'consider', 'recommend'];
    const improvementZone = lower.includes('could be better')
      || lower.includes('needs improvement')
      || lower.includes('areas to improve');

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const s = sentence.toLowerCase();

      // Only keep sentences hinting at improvement / correction
      const isCorrection = oblivionedZone.some((w) => s.includes(w)) || improvementZone;
      if (!isCorrection) continue;

      // Detect the most specific category
      let category = 'other';
      for (const ck of categoryKeywords) {
        if (s.includes(ck.key)) {
          category = ck.label;
          break;
        }
      }

      // Severity: high if word order-stopper like "critical", "avoid", "never"
      const severity: 'low' | 'medium' | 'high' =
        s.includes('critical') || s.includes('avoid') || s.includes('must') ? 'high'
        : s.includes('minor') || s.includes('slight') ? 'low'
        : 'medium';

      corrections.push({ category, description: sentence.trim(), severity });
    }

    return corrections;
  }

  /**
   * Rebuild player_stats from all completed swing sessions.
   * Called once after every persistAnalysis() call.
   */
  private async rebuildPlayerStats(): Promise<void> {
    const db = this.getDb();

    const [sessionsAgg, faultRow] = await Promise.all([
      db.getFirstAsync<{ total: number; avg: number; best: number }>(
        `SELECT
           COUNT(*)           AS total,
           AVG(overall_score) AS avg,
           MAX(overall_score) AS best
         FROM swing_sessions`
      ),
      db.getFirstAsync<{ category: string; cnt: number }>(
        `SELECT category, COUNT(*) AS cnt
         FROM biomechanics_corrections
         GROUP BY category
         ORDER BY cnt DESC
         LIMIT 1`
      ),
    ]);

    // Build a tiny JSON strengths snapshot
    const strengths = Object.fromEntries(
      (faultRow
        ? (await db.getAllAsync<any>(
            `SELECT description FROM biomechanics_corrections
             WHERE severity = 'high' ORDER BY id DESC LIMIT 5`
          )).map((r: any) => [`fault:${r.id}`, r.description.slice(0, 80)])
        : [])
    );

    const now = Date.now();
    await db.runAsync(
      `INSERT OR REPLACE INTO player_stats
         (id, total_sessions, avg_score, best_score, common_fault, streak_days, strengths_json, updated_at)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sessionsAgg?.total ?? 0,
        sessionsAgg?.avg ?? 0,
        sessionsAgg?.best ?? 0,
        faultRow?.category ?? '',
        0,
        JSON.stringify(strengths),
        now,
      ]
    );
  }
}

export const biomechanicsDbService = new BiomechanicsDbService();
