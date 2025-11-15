/**
 * Labely App Theme - Dark-friendly, clean, minimalistic
 */

import { Platform } from 'react-native';

const brandColor = '#6366f1'; // Indigo
const brandColorDark = '#818cf8'; // Light indigo

export const Colors = {
  light: {
    text: '#1f2937',
    textSecondary: '#6b7280',
    background: '#f9fafb',
    surface: '#ffffff',
    surfaceSecondary: '#f3f4f6',
    tint: brandColor,
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    icon: '#6b7280',
    tabIconDefault: '#9ca3af',
    tabIconSelected: brandColor,
    gold: '#fbbf24',
  },
  dark: {
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    background: '#0f172a',
    surface: '#1e293b',
    surfaceSecondary: '#334155',
    tint: brandColorDark,
    border: '#334155',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    icon: '#94a3b8',
    tabIconDefault: '#64748b',
    tabIconSelected: brandColorDark,
    gold: '#fbbf24',
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
