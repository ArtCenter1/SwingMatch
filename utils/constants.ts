export const COLORS = {
  primary: '#FF6B35',
  primaryLight: '#FFF5F0',
  secondary: '#F7931E',
  success: '#34C759',
  successLight: '#E8F5E8',
  info: '#007AFF',
  infoLight: '#F0F8FF',
  warning: '#FFD60A',
  error: '#FF3B30',
  
  // Neutrals
  black: '#1C1C1E',
  gray: '#8E8E93',
  lightGray: '#F8F9FA',
  white: '#FFFFFF',
  border: '#E5E5EA',
};

export const FONTS = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semiBold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const SKILL_LEVELS = [
  'Beginner',
  'Intermediate', 
  'Advanced',
  'Professional'
] as const;

export const STROKE_TYPES = [
  'Forehand',
  'Backhand', 
  'Serve',
  'Volley',
  'Overhead',
  'Drop Shot'
] as const;