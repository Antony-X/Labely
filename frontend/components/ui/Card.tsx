import React from 'react';
import { View, StyleSheet, Pressable, PressableProps } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface CardProps extends PressableProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary';
}

export function Card({ children, variant = 'default', style, ...props }: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const backgroundColor = variant === 'secondary' ? colors.surfaceSecondary : colors.surface;

  if (props.onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { backgroundColor, borderColor: colors.border },
          pressed && { opacity: 0.7 },
          style,
        ]}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
});
