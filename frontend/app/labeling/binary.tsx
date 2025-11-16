import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  Animated,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { apiService, DATASET_NAMES } from '@/services/api';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = height * 0.65;
const SWIPE_THRESHOLD = width * 0.25;

export default function BinaryClassificationLabeling() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { jobId } = useLocalSearchParams();

  const position = useRef(new Animated.ValueXY()).current;
  const [currentItemId, setCurrentItemId] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dataset, setDataset] = useState<any>(null);
  const [leftLabel, setLeftLabel] = useState('');
  const [rightLabel, setRightLabel] = useState('');

  useEffect(() => {
    loadDataset();
  }, []);

  const loadDataset = async () => {
    try {
      setLoading(true);
      const datasetData = await apiService.getDataset(DATASET_NAMES.BINARY);
      console.log('📦 Dataset data:', datasetData);
      setDataset(datasetData);

      if (datasetData.categories && datasetData.categories.length >= 2) {
        setLeftLabel(datasetData.categories[0].label);
        setRightLabel(datasetData.categories[1].label);
        console.log('🏷️ Labels set:', datasetData.categories[0].label, datasetData.categories[1].label);
      }

      if (datasetData.data && datasetData.data.length > 0) {
        console.log('📥 Loading first item...');
        loadItem(datasetData, 0);
      } else {
        console.log('⚠️ No data in dataset');
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to load dataset:', error);
      // Fallback to mock data
      setImageUrl('https://picsum.photos/400/300?random=1');
      setLeftLabel('Cat');
      setRightLabel('Dog');
      setLoading(false);
    }
  };

  const loadItem = (datasetData: any, itemId: number) => {
    console.log('🔄 loadItem called with itemId:', itemId);
    if (!datasetData || !datasetData.data || !datasetData.data[itemId]) {
      console.log('❌ No data for item:', itemId);
      return;
    }

    const url = apiService.getImageUrl(DATASET_NAMES.BINARY, itemId);
    console.log('🖼️ Image URL:', url);
    setImageUrl(url);
    setCurrentItemId(itemId);
    setLoading(false);
    console.log('✅ Loading complete, showing UI');
  };

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const rotateAndTranslate = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          // Swiped right
          Animated.spring(position, {
            toValue: { x: width + 100, y: gestureState.dy },
            useNativeDriver: false,
          }).start(() => {
            handleChoice(rightLabel);
          });
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          // Swiped left
          Animated.spring(position, {
            toValue: { x: -width - 100, y: gestureState.dy },
            useNativeDriver: false,
          }).start(() => {
            handleChoice(leftLabel);
          });
        } else {
          // Return to original position
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleChoice = async (choice: string) => {
    console.log('Selected:', choice, 'Left:', leftLabel, 'Right:', rightLabel);

    // Submit to backend
    if (dataset) {
      try {
        await apiService.setCategory(DATASET_NAMES.BINARY, currentItemId, choice);
        console.log('✅ Label submitted successfully');
      } catch (error) {
        console.error('Failed to submit label:', error);
      }
    }

    // Move to next item if available
    if (dataset && currentItemId < dataset.data.length - 1) {
      console.log(`📥 Loading next item: ${currentItemId + 1}/${dataset.data.length}`);
      // Reset position for next card
      position.setValue({ x: 0, y: 0 });
      loadItem(dataset, currentItemId + 1);
    } else {
      // All items labeled
      console.log('🎉 All items labeled! Going back...');
      setTimeout(() => {
        router.back();
      }, 500);
    }
  };

  const handleButtonPress = (choice: string) => {
    const toValue = choice === leftLabel ? -width - 100 : width + 100;
    Animated.spring(position, {
      toValue: { x: toValue, y: 0 },
      useNativeDriver: false,
    }).start(() => {
      handleChoice(choice);
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading dataset...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Binary Classification</Text>
        {dataset && (
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {currentItemId + 1}/{dataset.data.length}
          </Text>
        )}
      </View>

      {/* Instructions */}
      <View style={[styles.instructions, { backgroundColor: colors.surfaceSecondary }]}>
        <View style={styles.instructionRow}>
          <View style={styles.instructionItem}>
            <Ionicons name="arrow-back" size={20} color={colors.error} />
            <Text style={[styles.instructionText, { color: colors.text }]}>
              Swipe left for {leftLabel}
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={[styles.instructionText, { color: colors.text }]}>
              Swipe right for {rightLabel}
            </Text>
            <Ionicons name="arrow-forward" size={20} color={colors.success} />
          </View>
        </View>
      </View>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {/* Next card (background) */}
        <View
          style={[
            styles.card,
            styles.nextCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Image
            source={{ uri: currentItemId < dataset.data.length - 1 ? apiService.getImageUrl(DATASET_NAMES.BINARY, currentItemId + 1) : 'https://picsum.photos/400/300?random=2' }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Current card */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            rotateAndTranslate,
          ]}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
            onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
          />

          {/* Left Label Overlay */}
          <Animated.View
            style={[
              styles.labelOverlay,
              styles.nopeOverlay,
              { opacity: nopeOpacity },
            ]}
          >
            <View style={[styles.labelBadge, { borderColor: colors.error }]}>
              <Text style={[styles.labelText, { color: colors.error }]}>{leftLabel}</Text>
            </View>
          </Animated.View>

          {/* Right Label Overlay */}
          <Animated.View
            style={[
              styles.labelOverlay,
              styles.likeOverlay,
              { opacity: likeOpacity },
            ]}
          >
            <View style={[styles.labelBadge, { borderColor: colors.success }]}>
              <Text style={[styles.labelText, { color: colors.success }]}>{rightLabel}</Text>
            </View>
          </Animated.View>

          <View style={styles.cardInfo}>
            <Text style={[styles.taskLabel, { color: colors.textSecondary }]}>
              Swipe or tap a button
            </Text>
            <Text style={[styles.rewardLabel, { color: colors.success }]}>
              +$0.05 per label
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable
          onPress={() => handleButtonPress(leftLabel)}
          style={[styles.actionButton, styles.rejectButton, { backgroundColor: colors.error }]}
        >
          <Ionicons name="close" size={32} color="#fff" />
          <Text style={styles.actionButtonText}>{leftLabel}</Text>
        </Pressable>

        <Pressable
          onPress={() => handleButtonPress(rightLabel)}
          style={[styles.actionButton, styles.acceptButton, { backgroundColor: colors.success }]}
        >
          <Ionicons name="checkmark" size={32} color="#fff" />
          <Text style={styles.actionButtonText}>{rightLabel}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSizes.md,
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
  progressText: {
    fontSize: FontSizes.sm,
  },
  instructions: {
    padding: Spacing.md,
  },
  instructionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  instructionText: {
    fontSize: FontSizes.sm,
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
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  nextCard: {
    transform: [{ scale: 0.95 }],
    opacity: 0.5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  labelOverlay: {
    position: 'absolute',
    top: 50,
    padding: Spacing.md,
  },
  nopeOverlay: {
    left: 30,
  },
  likeOverlay: {
    right: 30,
  },
  labelBadge: {
    borderWidth: 4,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    transform: [{ rotate: '-15deg' }],
  },
  labelText: {
    fontSize: 32,
    fontWeight: '800',
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
  actions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  actionButton: {
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  rejectButton: {},
  acceptButton: {},
  actionButtonText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
});
