import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, fontSizes, spacing, radius, shadows } from '../theme';

export default function ThemeDemo() {
  const { colors, toggleTheme, isDark, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>
        Theme Demo - {theme.toUpperCase()} MODE
      </Text>
      
      <View style={[styles.card, { backgroundColor: colors.card }, shadows.md]}>
        <Text style={[styles.cardText, { color: colors.cardForeground }]}>
          This is a card component
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.primaryButton, { backgroundColor: colors.primary }]}
        onPress={toggleTheme}
      >
        <Ionicons 
          name={isDark ? "sunny" : "moon"} 
          size={20} 
          color={colors.primaryForeground} 
        />
        <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>
          Switch to {isDark ? 'Light' : 'Dark'} Mode
        </Text>
      </TouchableOpacity>

      <View style={[styles.colorPalette, { borderColor: colors.border }]}>
        <Text style={[styles.paletteTitle, { color: colors.foreground }]}>
          Color Palette
        </Text>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: colors.primary }]} />
          <Text style={[styles.colorLabel, { color: colors.foreground }]}>Primary</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: colors.secondary }]} />
          <Text style={[styles.colorLabel, { color: colors.foreground }]}>Secondary</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: colors.accent }]} />
          <Text style={[styles.colorLabel, { color: colors.foreground }]}>Accent</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing[4],
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  card: {
    padding: spacing[4],
    borderRadius: radius.lg,
    marginBottom: spacing[6],
  },
  cardText: {
    fontSize: fontSizes.lg,
    textAlign: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
    borderRadius: radius.lg,
    marginBottom: spacing[6],
  },
  buttonText: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    marginLeft: spacing[2],
  },
  colorPalette: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  paletteTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    marginBottom: spacing[3],
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: spacing[3],
  },
  colorLabel: {
    fontSize: fontSizes.base,
  },
});
