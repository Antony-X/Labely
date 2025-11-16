/**
 * Labely App Theme - White with Pink/Purple Gradients
 */

import { Platform } from 'react-native';

const primaryPurple = '#a855f7'; // Purple
const primaryPink = '#ec4899'; // Pink
const lightPurple = '#e9d5ff'; // Light purple
const lightPink = '#fce7f3'; // Light pink

export const Colors = {
  light: {
    text: '#1f2937',
    textSecondary: '#6b7280',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceSecondary: '#faf5ff',
    tint: primaryPurple,
    accent: primaryPink,
    border: '#e9d5ff',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    icon: '#a855f7',
    tabIconDefault: '#9ca3af',
    tabIconSelected: primaryPurple,
    gold: '#fbbf24',
    gradientStart: lightPink,
    gradientEnd: lightPurple,
    purple: primaryPurple,
    pink: primaryPink,
  },
  dark: {
    text: '#1f2937',
    textSecondary: '#6b7280',
    background: '#ffffff',
    surface: '#ffffff',
    surfaceSecondary: '#faf5ff',
    tint: primaryPurple,
    accent: primaryPink,
    border: '#e9d5ff',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    icon: '#a855f7',
    tabIconDefault: '#9ca3af',
    tabIconSelected: primaryPurple,
    gold: '#fbbf24',
    gradientStart: lightPink,
    gradientEnd: lightPurple,
    purple: primaryPurple,
    pink: primaryPink,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};
