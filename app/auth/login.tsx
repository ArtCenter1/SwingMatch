import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../../src/lib/auth.context';
import { ENV } from '../../src/config/env';

export default function LoginScreen() {
  const { signIn, signInAsGuest, isLoading } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>🎾</Text>
        <Text style={styles.appName}>{ENV.app.name}</Text>
        <Text style={styles.tagline}>Tennis AI Coach · Swing Biomechanics · Match Training</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Get Started</Text>
        <Text style={styles.cardSub}>Sign in or continue to the court</Text>

        <TouchableOpacity
          style={styles.guestBtn}
          onPress={signInAsGuest}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.guestBtnText}>Continue as Guest</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.googleBtn}
          onPress={signIn}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#F5F5F5" />
          ) : (
            <>
              <View style={styles.gIcon}>
                <Text style={styles.gIconText}>G</Text>
              </View>
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.terms}>
          By signing in you agree to Google's Terms of Service and access policies.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    marginBottom: 12,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F5F5F5',
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 13,
    color: '#A0A0A0',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F5F5F5',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 28,
  },
  guestBtn: {
    backgroundColor: '#84CC16',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  guestBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'center',
    gap: 10,
  },
  gIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gIconText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F5F5F5',
  },
  terms: {
    fontSize: 11,
    color: '#606060',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
  },
});
