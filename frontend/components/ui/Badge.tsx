import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'gold';
  size?: 'small' | 'medium';
}

export function Badge({ label, variant = 'default', size = 'medium' }: BadgeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getBackgroundColor = () => {
    switch (variant) {
      case 'success': return `${colors.success}20`;
      case 'warning': return `${colors.warning}20`;
      case 'error': return `${colors.error}20`;
      case 'gold': return `${colors.gold}20`;
      default: return colors.surfaceSecondary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
      case 'gold': return colors.gold;
      default: return colors.text;
    }
  };

  const fontSize = size === 'small' ? FontSizes.xs : FontSizes.sm;
  const paddingVertical = size === 'small' ? Spacing.xs : Spacing.xs + 2;
  const paddingHorizontal = size === 'small' ? Spacing.sm : Spacing.md;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          paddingVertical,
          paddingHorizontal,
        }
      ]}
    >
      <Text style={[styles.label, { color: getTextColor(), fontSize }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '600',
  },
});
