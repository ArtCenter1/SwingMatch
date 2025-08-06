// Typography system from index.css
export const fonts = {
  sans: 'Plus Jakarta Sans', // Default fallback to system font in React Native
  serif: 'Lora',
  mono: 'Roboto Mono',
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.6,
};

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
};
