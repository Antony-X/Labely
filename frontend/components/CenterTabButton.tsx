import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function CenterTabButton({ onPress, accessibilityState }: any) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isActive = accessibilityState?.selected;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePress}
        style={[
          styles.button,
          {
            backgroundColor: isActive ? colors.tint : colors.tint,
            shadowColor: colors.tint,
          },
        ]}
      >
        <Ionicons name="flash" size={32} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
