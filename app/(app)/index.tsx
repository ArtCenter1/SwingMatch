/**
 * ============================================================
 *  MAIN CHAT SCREEN
 *
 *  This is your app's home screen. The agent is ready to go.
 *
 *  TO CUSTOMISE FOR YOUR APP:
 *  1. Change systemPrompt to define your agent's personality/role
 *  2. Change placeholder to match your use case
 *  3. Change assistantName to your agent's name
 *  4. The agent will automatically use whatever tools are enabled
 *     in features.ts — no extra wiring needed
 *
 *  EXAMPLE — Tennis app:
 *    systemPrompt: `You are an expert tennis coach. When users ask
 *    about techniques, search YouTube for top instructional videos.
 *    When they share a video, analyse their form and suggest
 *    improvements with specific YouTube drills to practice.`
 * ============================================================
 */

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAgent } from '../../src/hooks/useAgent';
import { AgentChat } from '../../src/components/chat/AgentChat';
import { useAuth } from '../../src/lib/auth.context';
import { FEATURES } from '../../src/config/features';

// ── CUSTOMISE THIS PER PROJECT ─────────────────────────────────
const AGENT_CONFIG = {
  systemPrompt: `You are SwingCoach AI, an expert tennis coach and swing analysis assistant for SwingMatch.

Your goal is to help users improve their tennis game by analyzing their swing form, providing technical biomechanical feedback (such as unit turn, racket drop, contact point, and follow-through), recommending instructional drills, and helping them find matching training resources.

You have access to powerful tools:
- Search YouTube for instructional videos, technique deep dives, and specific drill videos.
- Save videos, drills, and swing analyses directly to the user's library.
- Retrieve saved drills or training plans from their library.

Always be encouraging, professional, and highly precise with your tennis coaching terminology. When analyzing a shot or answering technique questions, always look up relevant YouTube instruction drills to help the user practice.`,

  temperature: 0.7,
};

const ASSISTANT_NAME = 'SwingCoach AI';
const PLACEHOLDER = 'Ask about tennis tips, search drills, or analyze a swing...';
// ──────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const agent = useAgent({
    config: AGENT_CONFIG,
    onError: (err) => console.error('[ChatScreen]', err),
  });

  const handleCameraPress = useCallback(() => {
    if (FEATURES.camera) router.push('/(app)/camera');
  }, [router]);

  return (
    <View style={styles.container}>
      <AgentChat
        {...agent}
        assistantName={ASSISTANT_NAME}
        placeholder={PLACEHOLDER}
        onCameraPress={FEATURES.camera ? handleCameraPress : undefined}
        style={styles.chat}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 52 },
  chat: { flex: 1 },
});
