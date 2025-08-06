// Spacing and radius system from index.css
export const spacing = {
  '0': 0,
  '1': 4,  // 0.25rem * 16
  '2': 8,  // 0.5rem * 16
  '3': 12, // 0.75rem * 16
  '4': 16, // 1rem * 16
  '5': 20, // 1.25rem * 16
  '6': 24, // 1.5rem * 16
  '8': 32, // 2rem * 16
  '10': 40, // 2.5rem * 16
  '12': 48, // 3rem * 16
  '16': 64, // 4rem * 16
  '20': 80, // 5rem * 16
  '24': 96, // 6rem * 16
};

export const radius = {
  none: 0,
  sm: 16, // calc(var(--radius) - 4px) = 20 - 4 = 16
  md: 18, // calc(var(--radius) - 2px) = 20 - 2 = 18
  lg: 20, // var(--radius) = 1.25rem = 20
  xl: 24, // calc(var(--radius) + 4px) = 20 + 4 = 24
  full: 9999,
};

export const shadows = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
    shadowColor: '#718096',
  },
  md: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
    shadowColor: '#718096',
  },
  lg: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
    shadowColor: '#718096',
  },
  xl: {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    shadowColor: '#718096',
  },
};
