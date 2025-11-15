import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = height * 0.55;

export default function MultiClassLabeling() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { jobId } = useLocalSearchParams();

  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [cardAnimation] = useState(new Animated.Value(0));

  const imageUrl = 'https://picsum.photos/400/300?random=3';
  const classes = ['Electronics', 'Clothing', 'Food', 'Books', 'Toys', 'Other'];

  const handleSelect = (className: string) => {
    setSelectedClass(className);
  };

  const handleSubmit = () => {
    if (!selectedClass) return;

    // Animate card out
    Animated.timing(cardAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      console.log('Selected class:', selectedClass);
      // In real app, load next task or go back
      router.back();
    });
  };

  const cardTranslateY = cardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height],
  });

  const cardOpacity = cardAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Multi-Class Label</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Instructions */}
      <View style={[styles.instructions, { backgroundColor: colors.surfaceSecondary }]}>
        <Text style={[styles.instructionsText, { color: colors.text }]}>
          Select the category that best describes this image
        </Text>
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              transform: [{ translateY: cardTranslateY }],
              opacity: cardOpacity,
            },
          ]}
        >
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <View style={styles.cardInfo}>
            <Text style={[styles.taskLabel, { color: colors.textSecondary }]}>
              What category is this?
            </Text>
            <Text style={[styles.rewardLabel, { color: colors.success }]}>
              +$0.08 per label
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Class Buttons */}
      <View style={styles.classButtons}>
        {classes.map((cls) => (
          <Pressable
            key={cls}
            onPress={() => handleSelect(cls)}
            style={[
              styles.classButton,
              {
                backgroundColor: selectedClass === cls ? colors.tint : colors.surface,
                borderColor: selectedClass === cls ? colors.tint : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.classButtonText,
                { color: selectedClass === cls ? '#fff' : colors.text },
              ]}
            >
              {cls}
            </Text>
            {selectedClass === cls && (
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            )}
          </Pressable>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Skip"
          onPress={() => router.back()}
          variant="outline"
          style={{ flex: 1 }}
        />
        <Button
          title="Submit"
          onPress={handleSubmit}
          style={{ flex: 2 }}
          disabled={!selectedClass}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  instructions: {
    padding: Spacing.md,
  },
  instructionsText: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  taskLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#fff',
  },
  rewardLabel: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: '#4ade80',
  },
  classButtons: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  classButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    gap: Spacing.xs,
    minWidth: '48%',
  },
  classButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
});
