import { lightTheme, darkTheme } from './colors';
import { fonts, fontSizes, fontWeights, lineHeights, letterSpacing } from './typography';
import { spacing, radius, shadows } from './spacing';

export const theme = {
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  spacing,
  radius,
  shadows,
  lightTheme,
  darkTheme,
};

export type Theme = typeof theme;

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './ThemeContext';
