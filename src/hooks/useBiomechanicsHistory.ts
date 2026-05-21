/**
 * ============================================================
 *  useBiomechanicsHistory hook
 *
 *  Loads swing session history and aggregates analytics from
 *  the biomechanics database for use in the Progress screen.
 *
 *  Returns:
 *   sessions         — most-recent entries (default 50)
 *   playerStats      — denormalised aggregate or null
 *   sessionsByShot   — breakdown grouped by shot type
 *   correctionsByCat — fault category counts
 *   loading          — boolean
 *   error            — string | null
 *   refetch          — reload function
 * ============================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { biomechanicsDbService } from '../db/biomechanics.db.service';
import type { SwingSession, PlayerStats } from '../db/biomechanics.db.service';

export interface BiomechanicsHistoryData {
  sessions: SwingSession[];
  playerStats: PlayerStats | null;
  sessionsByShot: { shotType: string; sessionsCount: number; avgScore: number }[];
  correctionsByCat: { category: string; count: number }[];
}

interface UseBiomechanicsHistoryOptions {
  limit?: number;
  autoRefreshMs?: number; // set > 0 to poll periodically
}

export function useBiomechanicsHistory(
  options: UseBiomechanicsHistoryOptions = {}
): BiomechanicsHistoryData & { loading: boolean; error: string | null; refetch: () => void } {
  const { limit = 50, autoRefreshMs } = options;
  const [sessions, setSessions] = useState<SwingSession[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [sessionsByShot, setSessionsByShot] = useState<
    { shotType: string; sessionsCount: number; avgScore: number }[]
  >([]);
  const [correctionsByCat, setCorrectionsByCat] = useState<
    { category: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [sess, stats, byShot, byCat] = await Promise.all([
        biomechanicsDbService.getSessions(limit),
        biomechanicsDbService.getPlayerStats(),
        biomechanicsDbService.getSessionsByShotType(),
        biomechanicsDbService.getCorrectionsByCategory(),
      ]);
      setSessions(sess);
      setPlayerStats(stats);
      setSessionsByShot(byShot);
      setCorrectionsByCat(byCat);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    load();
    if (autoRefreshMs && autoRefreshMs > 0) {
      const id = setInterval(load, autoRefreshMs);
      return () => clearInterval(id);
    }
  }, [load, autoRefreshMs]);

  return { sessions, playerStats, sessionsByShot, correctionsByCat, loading, error, refetch: load };
}
