import React, { useEffect } from 'react';
import { Tabs, Stack } from 'expo-router';
import { Text } from 'react-native';
import { FEATURES } from '../../src/config/features';
import { dbService } from '../../src/db/db.service';
import { biomechanicsDbService } from '../../src/db/biomechanics.db.service';

export default function AppLayout() {
  useEffect(() => {
    dbService.init();
    if (FEATURES.biomechanicsHistory) biomechanicsDbService.init();
  }, []);

  if (!FEATURES.bottomTabs) {
    // No tabs — use a plain Stack instead
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#84CC16',
        tabBarInactiveTintColor: '#606060',
        tabBarStyle: {
          backgroundColor: '#111111',
          borderTopColor: '#1F1F1F',
          height: 83,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: '500' as const,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Chat', tabBarIcon: ({ color }) => <TabIcon emoji="💬" color={color} /> }}
      />
      {FEATURES.camera && (
        <Tabs.Screen
          name="camera"
          options={{ title: 'Camera', tabBarIcon: ({ color }) => <TabIcon emoji="📷" color={color} /> }}
        />
      )}
      {FEATURES.localDatabase && (
        <Tabs.Screen
          name="library"
          options={{ title: 'Library', tabBarIcon: ({ color }) => <TabIcon emoji="📚" color={color} /> }}
        />
      )}
      {FEATURES.biomechanicsHistory && (
        <Tabs.Screen
          name="progress"
          options={{ title: 'Progress', tabBarIcon: ({ color }) => <TabIcon emoji="📈" color={color} /> }}
        />
      )}
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarIcon: ({ color }) => <TabIcon emoji="⚙️" color={color} /> }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  return <Text style={{ fontSize: 20, opacity: color === '#84CC16' ? 1 : 0.5 }}>{emoji}</Text>;
}
