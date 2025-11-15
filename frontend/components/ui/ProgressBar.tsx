import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';

interface ProgressBarProps {
  progress: number; // 0-100
  showLabel?: boolean;
  height?: number;
  color?: string;
}

export function ProgressBar({ progress, showLabel = true, height = 8, color }: ProgressBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const clampedProgress = Math.max(0, Math.min(100, progress));
  const barColor = color || colors.tint;

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height, backgroundColor: colors.surfaceSecondary }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: barColor,
              borderRadius: BorderRadius.full,
            }
          ]}
        />
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {clampedProgress.toFixed(0)}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  track: {
    flex: 1,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    minWidth: 42,
    textAlign: 'right',
  },
});
