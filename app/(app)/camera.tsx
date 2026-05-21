/**
 * ============================================================
 *  CAMERA SCREEN
 *
 *  Record a video or take a photo, then send to Gemini for
 *  analysis. Results appear in the chat and can be saved.
 *
 *  TO CUSTOMISE:
 *  - Change ANALYSIS_PROMPT for your use case
 *  - e.g. for tennis: "Analyse my tennis serve technique..."
 *  - The analysed result is also sent back to the chat agent
 *    so it can suggest YouTube videos for improvement
 * ============================================================
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { cameraService } from '../../src/services/camera.service';
import { agentService } from '../../src/services/agent.service';
import { biomechanicsDbService } from '../../src/db/biomechanics.db.service';
import { FEATURES } from '../../src/config/features';

// ── CUSTOMISE THIS PER PROJECT ─────────────────────────────────
const ANALYSIS_PROMPT =
  `You are an expert tennis coach AI. Analyze this tennis technique video or image in detail.
  Identify:
  1. The shot being played (e.g., Serve, Forehand, Backhand, Volley, Slice, Overhead)
  2. Biomechanical breakdown of what is done well (e.g., footwork, posture, swing path, unit turn)
  3. What could be improved (e.g., contact point, racket drop, body rotation, follow-through)
  4. Highly actionable corrections and suggested drills to practice
  Be encouraging but technically precise. Format clearly with bold headers and structured sections.`;
// ──────────────────────────────────────────────────────────────

type Status = 'idle' | 'recording' | 'analysing' | 'done' | 'error';

export default function CameraScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('idle');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    cameraService.requestPermissions().then(setHasPermission);
  }, []);

  const handleRecordVideo = useCallback(async () => {
    setStatus('recording');
    setAnalysis(null);

    try {
      const media = await cameraService.recordVideo(60);
      if (!media) { setStatus('idle'); return; }

      setStatus('analysing');

      if (FEATURES.geminiVision && FEATURES.videoFrameExtraction) {
        // Extract frames and send to Gemini Vision
        const frames = await cameraService.extractFrames(media.uri, 8, media.duration);

        let result: string;
        if (frames.length > 0) {
          result = await agentService.analyzeVideoFrames(frames, ANALYSIS_PROMPT);
        } else {
          // Fallback: just analyse the first frame as image
          const base64 = await cameraService.imageUriToBase64(media.uri);
          result = await agentService.analyzeImage(base64, ANALYSIS_PROMPT);
        }
        setAnalysis(result);

        // Fire-and-forget: persist biomechanics analysis to local DB
        if (FEATURES.biomechanicsHistory) {
          biomechanicsDbService.persistAnalysis({
            rawText: result,
            videoUri: media.uri,
            durationSeconds: media.duration,
          }).catch(console.warn);
        }
      }

      setStatus('done');
    } catch (err) {
      console.error('[CameraScreen]', err);
      setStatus('error');
    }
  }, []);

  const handleTakePhoto = useCallback(async () => {
    try {
      const media = await cameraService.takePhoto();
      if (!media) return;

      setStatus('analysing');
      const base64 = await cameraService.imageUriToBase64(media.uri);
      const result = await agentService.analyzeImage(base64, ANALYSIS_PROMPT);
      setAnalysis(result);

      // Fire-and-forget: persist biomechanics analysis to local DB
      if (FEATURES.biomechanicsHistory) {
        biomechanicsDbService.persistAnalysis({ rawText: result }).catch(console.warn);
      }

      setStatus('done');
    } catch (err) {
      console.error('[CameraScreen]', err);
      setStatus('error');
    }
  }, []);

  const handlePickFromGallery = useCallback(async () => {
    try {
      const media = await cameraService.pickFromGallery('both');
      if (!media) return;

      setStatus('analysing');

      if (media.type === 'video' && FEATURES.videoFrameExtraction) {
        const frames = await cameraService.extractFrames(media.uri, 8, media.duration);
        let result: string;
        if (frames.length > 0) {
          result = await agentService.analyzeVideoFrames(frames, ANALYSIS_PROMPT);
        } else {
          const base64 = await cameraService.imageUriToBase64(media.uri);
          result = await agentService.analyzeImage(base64, ANALYSIS_PROMPT);
        }
        setAnalysis(result);

        // Fire-and-forget: persist biomechanics analysis to local DB
        if (FEATURES.biomechanicsHistory) {
          biomechanicsDbService.persistAnalysis({ rawText: result, videoUri: media.uri }).catch(console.warn);
        }
      } else {
        const base64 = await cameraService.imageUriToBase64(media.uri);
        const result = await agentService.analyzeImage(base64, ANALYSIS_PROMPT);
        setAnalysis(result);

        // Fire-and-forget: persist biomechanics analysis to local DB
        if (FEATURES.biomechanicsHistory) {
          biomechanicsDbService.persistAnalysis({ rawText: result }).catch(console.warn);
        }
      }

      setStatus('done');
    } catch (err) {
      setStatus('error');
    }
  }, []);

  const handleSendToChat = useCallback(() => {
    if (analysis) {
      // Navigate back to chat — the analysis is already in agent service history
      router.push('/(app)');
    }
  }, [analysis, router]);

  if (!FEATURES.camera) {
    return (
      <View style={styles.center}>
        <Text style={styles.offText}>Camera feature is disabled in features.ts</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.offText}>Camera permission required</Text>
        <TouchableOpacity onPress={() => cameraService.requestPermissions().then(setHasPermission)}>
          <Text style={styles.link}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Camera</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Action buttons */}
        {(status === 'idle' || status === 'done' || status === 'error') && (
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleRecordVideo}>
              <Text style={styles.btnEmoji}>🎥</Text>
              <Text style={styles.btnText}>Record Video</Text>
              <Text style={styles.btnSub}>Up to 60 seconds</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={handleTakePhoto}>
              <Text style={styles.btnEmoji}>📸</Text>
              <Text style={styles.btnTextDark}>Take Photo</Text>
              <Text style={styles.btnSubDark}>Single frame analysis</Text>
            </TouchableOpacity>

            {FEATURES.mediaLibrary && (
              <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={handlePickFromGallery}>
                <Text style={styles.btnEmoji}>🖼️</Text>
                <Text style={styles.btnTextDark}>From Gallery</Text>
                <Text style={styles.btnSubDark}>Pick existing video or photo</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Analysing state */}
        {status === 'analysing' && (
          <View style={styles.centre}>
            <ActivityIndicator size="large" color="#84CC16" />
            <Text style={styles.analysingText}>Analysing with Gemini…</Text>
            <Text style={styles.analysingSubText}>This usually takes 5–15 seconds</Text>
          </View>
        )}

        {/* Analysis result */}
        {status === 'done' && analysis && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>✨ Analysis Complete</Text>
            <Text style={styles.resultText}>{analysis}</Text>
            <TouchableOpacity style={styles.chatBtn} onPress={handleSendToChat}>
              <Text style={styles.chatBtnText}>Continue in Chat →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Error state */}
        {status === 'error' && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>Something went wrong. Try again.</Text>
            <TouchableOpacity onPress={() => setStatus('idle')}>
              <Text style={styles.link}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111111' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: 12, paddingHorizontal: 16,
    backgroundColor: '#1A1A1A', borderBottomWidth: 1, borderBottomColor: '#1F1F1F',
  },
  backBtn: { width: 60 },
  backText: { color: '#84CC16', fontSize: 15, fontWeight: '600' as const },
  headerTitle: { fontSize: 16, fontWeight: '600' as const, color: '#F5F5F5' },
  content: { padding: 20, gap: 16 },
  actions: { gap: 12 },
  btn: {
    borderRadius: 16, padding: 20, alignItems: 'center', gap: 4,
    borderWidth: 1,
  },
  btnPrimary: { backgroundColor: '#84CC16', borderColor: '#84CC16' },
  btnSecondary: { backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' },
  btnEmoji: { fontSize: 32, marginBottom: 4 },
  btnText: { fontSize: 16, fontWeight: '700' as const, color: '#111111' },
  btnSub: { fontSize: 12, color: '#4D7A0A' },
  btnTextDark: { fontSize: 16, fontWeight: '700' as const, color: '#F5F5F5' },
  btnSubDark: { fontSize: 12, color: '#A0A0A0' },
  centre: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  analysingText: { fontSize: 16, fontWeight: '600' as const, color: '#F5F5F5' },
  analysingSubText: { fontSize: 13, color: '#A0A0A0' },
  resultCard: {
    backgroundColor: '#1A1A1A', borderRadius: 14, padding: 20,
    borderWidth: 1, borderColor: '#2A2A2A', gap: 12,
  },
  resultTitle: { fontSize: 16, fontWeight: '700' as const, color: '#F5F5F5' },
  resultText: { fontSize: 14, color: '#A0A0A0', lineHeight: 22 },
  chatBtn: {
    backgroundColor: '#84CC16', borderRadius: 10,
    padding: 14, alignItems: 'center', marginTop: 4,
  },
  chatBtnText: { color: '#111111', fontWeight: '600' as const, fontSize: 15 },
  errorCard: { alignItems: 'center', gap: 8, paddingVertical: 40 },
  errorText: { color: '#EF4444', fontSize: 14 },
  link: { color: '#84CC16', fontSize: 14, fontWeight: '600' as const },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  offText: { color: '#606060', fontSize: 14 },
});
