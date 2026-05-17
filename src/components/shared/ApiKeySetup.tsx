/**
 * ============================================================
 *  API KEY SETUP UI
 *
 *  A beautiful, premium bring-your-own-key configuration card.
 *  Prompts the user for their Gemini API Key, validates it live,
 *  and saves it securely to SecureStore.
 * ============================================================
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { apiKeyService } from '../../services/api-key.service';
import { agentService } from '../../services/agent.service';

interface ApiKeySetupProps {
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
}

export function ApiKeySetup({
  onSuccess,
  title = 'Connect SwingCoach AI',
  subtitle = 'To unlock real-time biomechanics feedback and video matching, connect your Gemini API Key.',
}: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetFreeKey = () => {
    Linking.openURL('https://aistudio.google.com/app/apikey').catch(() => {
      Alert.alert('Error', 'Could not open AI Studio link.');
    });
  };

  const handleSave = async () => {
    const cleanKey = apiKey.trim();
    if (!cleanKey) {
      setError('Please paste your Gemini API Key');
      return;
    }

    setError(null);
    setIsValidating(true);

    try {
      const isValid = await apiKeyService.validateApiKey(cleanKey);
      if (isValid) {
        await apiKeyService.saveApiKey(cleanKey);
        // Reset dynamic agent service client to pick up the new key
        agentService.resetClient();
        onSuccess();
      } else {
        setError('Invalid API Key. Please check the key and try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.logoEmoji}>⚡</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={handleGetFreeKey}
          activeOpacity={0.8}
        >
          <Text style={styles.linkText}>Get your FREE Key from Google AI Studio ↗</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Gemini API Key</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="AIzaSy..."
              placeholderTextColor="#9ca3af"
              value={apiKey}
              onChangeText={(text) => {
                setApiKey(text);
                setError(null);
              }}
              secureTextEntry={!showKey}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isValidating}
            />
            {apiKey.length > 0 && (
              <TouchableOpacity
                style={styles.toggleBtn}
                onPress={() => setShowKey(!showKey)}
              >
                <Text style={styles.toggleBtnText}>{showKey ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {error && <Text style={styles.errorText}>⚠️ {error}</Text>}

        <TouchableOpacity
          style={[styles.saveButton, isValidating && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isValidating}
          activeOpacity={0.9}
        >
          {isValidating ? (
            <View style={styles.btnRow}>
              <ActivityIndicator color="#ffffff" size="small" />
              <Text style={styles.saveButtonText}>Validating key...</Text>
            </View>
          ) : (
            <Text style={styles.saveButtonText}>Connect AI Coach</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.securityNote}>
          🔒 Your API key is encrypted on your device and never uploaded to our servers.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a', // deep sleek dark navy
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#1e293b', // slate card
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0284c7', // sky blue accents
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  logoEmoji: {
    fontSize: 32,
    color: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  linkButton: {
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(2, 132, 199, 0.2)',
    marginBottom: 24,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38bdf8',
  },
  inputContainer: {
    width: '100%',
    gap: 8,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#f8fafc',
    fontSize: 14,
  },
  toggleBtn: {
    padding: 8,
  },
  toggleBtnText: {
    fontSize: 12,
    color: '#38bdf8',
    fontWeight: '700',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingLeft: 4,
  },
  saveButton: {
    backgroundColor: '#0284c7',
    borderRadius: 14,
    height: 52,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    shadowOpacity: 0,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  securityNote: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
});
