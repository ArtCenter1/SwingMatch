/**
 * ============================================================
 *  API KEY SERVICE
 *
 *  Manages the user's personal Gemini API Key securely on-device.
 *  Uses expo-secure-store for encrypted storage.
 * ============================================================
 */

import * as SecureStore from 'expo-secure-store';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../config/env';

const SECURE_KEY_STORAGE = 'user_gemini_api_key_v1';

class ApiKeyService {
  private cachedKey: string | null = null;

  /**
   * Load the API key.
   * Checks SecureStore first, then falls back to EXPO_PUBLIC_GEMINI_API_KEY from .env.
   */
  async getApiKey(): Promise<string> {
    if (this.cachedKey) return this.cachedKey;

    try {
      const userKey = await SecureStore.getItemAsync(SECURE_KEY_STORAGE);
      if (userKey) {
        this.cachedKey = userKey;
        return userKey;
      }
    } catch (err) {
      console.warn('[ApiKeyService] Failed to load key from SecureStore:', err);
    }

    // Enforce pure Bring Your Own Key (BYOK) architecture - no fallback to developer key
    return '';
  }

  /**
   * Save the API key securely.
   */
  async saveApiKey(key: string): Promise<void> {
    const trimmed = key.trim();
    if (!trimmed) throw new Error('API key cannot be empty');
    await SecureStore.setItemAsync(SECURE_KEY_STORAGE, trimmed);
    this.cachedKey = trimmed;
  }

  /**
   * Delete the stored API key.
   */
  async deleteApiKey(): Promise<void> {
    await SecureStore.deleteItemAsync(SECURE_KEY_STORAGE);
    this.cachedKey = null;
  }

  /**
   * Check if a valid API key is available (either stored or in .env).
   */
  async hasApiKey(): Promise<boolean> {
    const key = await this.getApiKey();
    return !!key && key.length > 10; // basic length validation
  }

  /**
   * Validate a Gemini API Key by performing a quick, cheap call.
   */
  async validateApiKey(key: string): Promise<boolean> {
    const trimmed = key.trim();
    if (!trimmed) return false;

    try {
      const tempClient = new GoogleGenerativeAI(trimmed);
      // Use standard model for validation
      const model = tempClient.getGenerativeModel({ model: ENV.gemini.model || 'gemini-2.5-flash' });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
        generationConfig: { maxOutputTokens: 5 },
      });
      return !!result.response.text();
    } catch (err) {
      console.warn('[ApiKeyService] Key validation failed:', err);
      return false;
    }
  }
}

export const apiKeyService = new ApiKeyService();
