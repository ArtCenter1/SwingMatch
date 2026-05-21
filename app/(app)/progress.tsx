/**
 * ============================================================
 *  PROGRESS SCREEN
 *
 *  Shows the user's swing training analytics over time:
 *  - Summary stats (total sessions, avg score, best score, streak)
 *  - Shot-type breakdown with average scores per shot
 *  - Most frequent fault categories bar chart
 *  - Recent session history list
 *
 *  Theme: dark (#111111) per DESIGN.md
 * ============================================================
 */

import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useBiomechanicsHistory } from '../../src/hooks/useBiomechanicsHistory';
import { FEATURES } from '../../src/config/features';

// ── Score colour helper ──────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 85) return '#22C55E';
  if (score >= 65) return '#84CC16';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
}

function scoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 40) return 'Needs work';
  return 'Critical';
}

// ── Typography helpers ───────────────────────────────────────────

const h2 = { fontSize: 20, fontWeight: '700' as const, color: '#F5F5F5' };
const h3 = { fontSize: 17, fontWeight: '600' as const, color: '#F5F5F5' };
const caption = { fontSize: 13, color: '#A0A0A0' };
const monoSm = { fontSize: 13, fontFamily: 'monospace', color: '#F5F5F5' };

// ── Stat Card ────────────────────────────────────────────────────

function StatCard({ label, value, subtitle }: { label: string; value: string | number; subtitle?: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle ? <Text style={styles.statSub}>{subtitle}</Text> : null}
    </View>
  );
}

// ── Shot Bar Chart ───────────────────────────────────────────────

function ShotBar({
  shotType,
  sessionsCount,
  avgScore,
}: {
  shotType: string;
  sessionsCount: number;
  avgScore: number;
}) {
  const filled = Math.min(1, avgScore / 10);
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel} numberOfLines={1}>{shotType}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${filled * 100}%`, backgroundColor: scoreColor(avgScore) }]} />
      </View>
      <Text style={[styles.barValue, { color: scoreColor(avgScore) }]}>{avgScore.toFixed(1)}</Text>
      <Text style={styles.barCount}>{sessionsCount}x</Text>
    </View>
  );
}

// ── Fault Bar Chart ──────────────────────────────────────────────

function FaultBar({ category, count }: { category: string; count: number }) {
  // derive top-level category display name
  const labelMap: Record<string, string> = {
    footwork: 'Footwork',
    swing_path: 'Swing Path',
    follow_through: 'Follow-through',
    body_rotation: 'Body Rotation',
    grip: 'Grip',
    contact_point: 'Contact Point',
    timing: 'Timing',
    racket_position: 'Racket Position',
    preparation: 'Preparation',
    other: 'Other',
  };
  const label = labelMap[category] ?? category;
  const maxCount = 20; // scale cap
  const width = Math.min(1, count / maxCount);
  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFillFault, { width: `${width * 100}%` }]} />
      </View>
      <Text style={styles.barValue}>{count}</Text>
    </View>
  );
}

// ── Session Row ─────────────────────────────────────────────────

function SessionRow({ session }: { session: any }) {
  const date = new Date(session.createdAt);
  const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return (
    <View style={styles.sessionRow}>
      <View style={styles.sessionLeft}>
        <Text style={styles.sessionShot} numberOfLines={1}>
          {session.shotType}
        </Text>
        <Text style={styles.sessionDate}>{dateStr}</Text>
      </View>
      <View style={styles.sessionRight}>
        {session.overallScore != null ? (
          <View style={[styles.scoreBadge, { backgroundColor: `${scoreColor(session.overallScore)}20`, borderColor: scoreColor(session.overallScore) }]}>
            <Text style={[styles.scoreBadgeText, { color: scoreColor(session.overallScore) }]}>
              {session.overallScore}/10 · {scoreLabel(session.overallScore)}
            </Text>
          </View>
        ) : null}
        {session.emotion ? (
          <Text style={styles.sessionEmotion}>{session.emotion}</Text>
        ) : null}
      </View>
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────

export default function ProgressScreen() {
  const { sessions, playerStats, sessionsByShot, correctionsByCat, loading, error, refetch } =
    useBiomechanicsHistory({ limit: 50 });

  if (!FEATURES.biomechanicsHistory) {
    return (
      <View style={styles.center}>
        <Text style={styles.offText}>Progress tracking is disabled in settings.</Text>
      </View>
    );
  }

  if (loading && sessions.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#84CC16" />
        <Text style={styles.loadingText}>Loading analytics…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor="#84CC16" />}
    >
      {/* ── Summary Stats ───────────────────────────────────────── */}
      <Text style={h2}>Analytics</Text>
      <View style={styles.statsGrid}>
        <StatCard label="Sessions" value={playerStats?.totalSessions ?? sessions.length} />
        <StatCard
          label="Avg Score"
          value={playerStats ? `${playerStats.avgScore.toFixed(1)}/10` : '–'}
          subtitle={playerStats ? scoreLabel(playerStats.avgScore) : undefined}
        />
        <StatCard
          label="Best Score"
          value={playerStats ? `${playerStats.bestScore}/10` : '–'}
        />
        <StatCard label="Streak" value={`${playerStats?.streakDays ?? 0} days`} />
      </View>

      {/* ── Shot Type Breakdown ────────────────────────────────── */}
      {sessionsByShot.length > 0 && (
        <View style={styles.section}>
          <Text style={h3}>By Shot Type</Text>
          <View style={styles.sectionCard}>
            {sessionsByShot.map((s) => (
              <ShotBar key={s.shotType} shotType={s.shotType} sessionsCount={s.sessionsCount} avgScore={s.avgScore} />
            ))}
          </View>
        </View>
      )}

      {/* ── Common Faults ──────────────────────────────────────── */}
      {correctionsByCat.length > 0 && (
        <View style={styles.section}>
          <Text style={h3}>Most Common Faults</Text>
          <View style={styles.sectionCard}>
            {correctionsByCat.map((c) => (
              <FaultBar key={c.category} category={c.category} count={c.count} />
            ))}
          </View>
        </View>
      )}

      {/* ── Session History ─────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={[h3, styles.historyTitle]}>
          Session History ({sessions.length})
        </Text>
        <View style={styles.sectionCard}>
          {sessions.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
          {sessions.length === 0 && (
            <Text style={styles.emptyText}>No sessions yet. Record a swing in the Camera tab!</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// ── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  offText: { color: '#606060', fontSize: 14, textAlign: 'center' },
  errorText: { color: '#EF4444', fontSize: 14, textAlign: 'center' },
  loadingText: { color: '#A0A0A0', fontSize: 14 },
  content: { padding: 16, gap: 24, paddingBottom: 40 },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 8, marginTop: 12,
  },
  statCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: '#1A1A1A', borderRadius: 14,
    borderWidth: 1, borderColor: '#2A2A2A',
    padding: 16, gap: 4,
  },
  statLabel: { fontSize: 12, fontWeight: '500' as const, color: '#A0A0A0' },
  statValue: { fontSize: 22, fontWeight: '700' as const, color: '#84CC16', fontFamily: 'monospace' },
  statSub: { fontSize: 12, color: '#606060' },
  section: { gap: 8 },
  sectionCard: {
    backgroundColor: '#1A1A1A', borderRadius: 14,
    borderWidth: 1, borderColor: '#2A2A2A',
    padding: 12, gap: 8,
  },
  historyTitle: { marginTop: 8 },
  emptyText: { fontSize: 14, color: '#606060', textAlign: 'center', paddingVertical: 24 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { flex: 1.2, fontSize: 13, color: '#F5F5F5', textTransform: 'capitalize' as const },
  barTrack: { flex: 2, height: 6, backgroundColor: '#222222', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  barFillFault: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 3 },
  barValue: { fontSize: 13, fontWeight: '600' as const, color: '#F5F5F5', fontFamily: 'monospace', width: 32, textAlign: 'right' as const },
  barCount: { fontSize: 12, color: '#606060', width: 28, textAlign: 'right' as const },
  sessionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1F1F1F',
  },
  sessionLeft: { flex: 1, gap: 2 },
  sessionShot: { fontSize: 14, fontWeight: '600' as const, color: '#F5F5F5' },
  sessionDate: { fontSize: 12, color: '#A0A0A0' },
  sessionRight: { alignItems: 'flex-end', gap: 4 },
  scoreBadge: {
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1,
  },
  scoreBadgeText: { fontSize: 12, fontWeight: '600' as const, fontFamily: 'monospace' },
  sessionEmotion: { fontSize: 12, color: '#606060' },
});
