import React from 'react';
import { Pressable, Text, StyleSheet, PressableProps, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'primary': return colors.tint;
      case 'danger': return colors.error;
      case 'secondary': return colors.surfaceSecondary;
      case 'outline': return 'transparent';
      default: return colors.tint;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    switch (variant) {
      case 'primary': return '#ffffff';
      case 'danger': return '#ffffff';
      case 'secondary': return colors.text;
      case 'outline': return colors.tint;
      default: return '#ffffff';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small': return { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md };
      case 'large': return { paddingVertical: Spacing.md + 4, paddingHorizontal: Spacing.lg };
      default: return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small': return FontSizes.sm;
      case 'large': return FontSizes.lg;
      default: return FontSizes.md;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? colors.tint : 'transparent',
          ...getPadding(),
        },
        variant === 'outline' && styles.outline,
        pressed && !disabled && { opacity: 0.7 },
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor(), fontSize: getFontSize() }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  outline: {
    borderWidth: 1,
  },
  text: {
    fontWeight: '600',
  },
});
