import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { useAuth } from '../../src/lib/auth.context';
import { dbService } from '../../src/db/db.service';
import { FEATURES } from '../../src/config/features';
import { ENV } from '../../src/config/env';
import { apiKeyService } from '../../src/services/api-key.service';
import { agentService } from '../../src/services/agent.service';
import { ApiKeySetup } from '../../src/components/shared/ApiKeySetup';

function SettingRow({ label, value, onPress, danger }: {
  label: string; value?: string; onPress?: () => void; danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress}>
      <Text style={[styles.rowLabel, danger && styles.danger]}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      {onPress && <Text style={styles.chevron}>›</Text>}
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [hasKey, setHasKey] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    apiKeyService.hasApiKey().then(setHasKey);
  }, []);

  const handleClearLibrary = () => {
    Alert.alert('Clear Library', 'Delete all saved items?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear', style: 'destructive',
        onPress: async () => {
          const items = await dbService.getItems({ limit: 1000 });
          await Promise.all(items.map(i => dbService.deleteItem(i.id!)));
          Alert.alert('Done', 'Library cleared.');
        },
      },
    ]);
  };

  const handleClearApiKey = () => {
    Alert.alert('Disconnect Gemini API Key', 'This will remove your custom key from the device. You will need to enter a key again to chat with SwingCoach AI.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disconnect', style: 'destructive',
        onPress: async () => {
          await apiKeyService.deleteApiKey();
          agentService.resetClient();
          setHasKey(false);
          Alert.alert('Disconnected', 'Your Gemini API Key has been removed.');
        },
      },
    ]);
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Account */}
        {FEATURES.googleAuth && user && (
          <Section title="Account">
            <SettingRow label={user.name} value={user.email} />
            <SettingRow label="Sign out" onPress={handleSignOut} danger />
          </Section>
        )}

        {/* Connection */}
        <Section title="AI Connection">
          <SettingRow
            label={hasKey ? 'Disconnect Gemini Key' : 'Connect Gemini API Key'}
            value={hasKey ? '✓ Connected' : 'Not Connected'}
            onPress={hasKey ? handleClearApiKey : () => setShowSetup(true)}
            danger={hasKey}
          />
        </Section>

        {/* Active Features */}
        <Section title="Active Features">
          {(Object.entries(FEATURES) as [string, unknown][])
            .filter(([, v]) => typeof v === 'boolean')
            .map(([key, value]) => (
              <SettingRow
                key={key}
                label={key}
                value={value ? '✓ On' : '○ Off'}
              />
            ))}
        </Section>

        {/* Active Tools */}
        <Section title="Active Tools">
          {Object.entries(FEATURES.tools).map(([key, value]) => (
            <SettingRow key={key} label={key} value={value ? '✓ On' : '○ Off'} />
          ))}
        </Section>

        {/* Model */}
        <Section title="AI Model">
          <SettingRow label="Gemini Model" value={ENV.gemini.model} />
          <SettingRow label="Vision Model" value={ENV.gemini.visionModel} />
        </Section>

        {/* Data */}
        {FEATURES.localDatabase && (
          <Section title="Data">
            <SettingRow label="Clear library" onPress={handleClearLibrary} danger />
          </Section>
        )}

        <Text style={styles.footer}>
          {ENV.app.name} · {ENV.app.env}
        </Text>
      </ScrollView>

      <Modal visible={showSetup} animationType="slide" presentationStyle="fullScreen">
        <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
          <TouchableOpacity
            style={styles.closeModalBtn}
            onPress={() => setShowSetup(false)}
          >
            <Text style={styles.closeModalBtnText}>✕ Close</Text>
          </TouchableOpacity>
          <ApiKeySetup
            onSuccess={() => {
              setHasKey(true);
              setShowSetup(false);
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    paddingTop: 56, paddingBottom: 12, paddingHorizontal: 16,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  content: { padding: 16, gap: 24, paddingBottom: 40 },
  section: { gap: 6 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', paddingLeft: 4 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  rowLabel: { flex: 1, fontSize: 14, color: '#111827' },
  rowValue: { fontSize: 13, color: '#9ca3af', marginRight: 6 },
  chevron: { fontSize: 18, color: '#d1d5db' },
  danger: { color: '#dc2626' },
  footer: { textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 8 },
  closeModalBtn: {
    position: 'absolute',
    top: 56,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  closeModalBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
