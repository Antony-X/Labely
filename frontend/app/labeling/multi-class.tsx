import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  Animated,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { apiService, DATASET_NAMES } from '@/services/api';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = height * 0.45;

export default function MultiClassLabeling() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { jobId } = useLocalSearchParams();

  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [customClass, setCustomClass] = useState('');
  const [cardAnimation] = useState(new Animated.Value(0));
  const [currentItemId, setCurrentItemId] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dataset, setDataset] = useState<any>(null);
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    loadDataset();
  }, []);

  const loadDataset = async () => {
    try {
      setLoading(true);
      const datasetData = await apiService.getDataset(DATASET_NAMES.MULTI_CLASS);
      console.log('📦 Dataset data:', datasetData);
      setDataset(datasetData);

      if (datasetData.categories) {
        // Extract class labels from categories
        const classLabels = datasetData.categories.map((cat: any) => cat.label);
        setClasses(classLabels);
        console.log('🏷️ Classes set:', classLabels);
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
      setImageUrl('https://picsum.photos/400/300?random=3');
      setClasses(['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral', 'Other']);
      setLoading(false);
    }
  };

  const loadItem = (datasetData: any, itemId: number) => {
    console.log('🔄 loadItem called with itemId:', itemId);
    if (!datasetData || !datasetData.data || !datasetData.data[itemId]) {
      console.log('❌ No data for item:', itemId);
      return;
    }

    const url = apiService.getImageUrl(DATASET_NAMES.MULTI_CLASS, itemId);
    console.log('🖼️ Image URL:', url);
    setImageUrl(url);
    setCurrentItemId(itemId);
    setSelectedClass(null);
    setCustomClass('');
    setLoading(false);
    console.log('✅ Loading complete, showing UI');
  };

  const handleSelect = (className: string) => {
    setSelectedClass(className);
    setCustomClass(''); // Clear custom input when selecting predefined class
  };

  const handleCustomInput = (text: string) => {
    setCustomClass(text);
    if (text.trim()) {
      setSelectedClass(text.trim());
    } else {
      setSelectedClass(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClass) return;

    // Submit to backend
    if (dataset) {
      try {
        await apiService.setCategory(DATASET_NAMES.MULTI_CLASS, currentItemId, selectedClass);
      } catch (error) {
        console.error('Failed to submit label:', error);
      }
    }

    // Move to next item if available
    if (dataset && currentItemId < dataset.data.length - 1) {
      // Animate card out
      Animated.timing(cardAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        cardAnimation.setValue(0);
        loadItem(dataset, currentItemId + 1);
      });
    } else {
      // All items labeled
      Animated.timing(cardAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        router.back();
      });
    }
  };

  const cardTranslateY = cardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height],
  });

  const cardOpacity = cardAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0],
  });

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Multi-Class Label</Text>
        {dataset && (
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {currentItemId + 1}/{dataset.data.length}
          </Text>
        )}
      </View>

      {/* Instructions */}
      <View style={[styles.instructions, { backgroundColor: colors.surfaceSecondary }]}>
        <Text style={[styles.instructionsText, { color: colors.text }]}>
          Select a category or type your own
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
              <Text style={styles.taskLabel}>
                What category is this?
              </Text>
              <Text style={styles.rewardLabel}>
                +$0.08
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
            </Pressable>
          ))}
        </View>

        {/* Custom Input */}
        <View style={styles.customInputContainer}>
          <Text style={[styles.customLabel, { color: colors.textSecondary }]}>
            Or type your own class:
          </Text>
          <TextInput
            style={[
              styles.customInput,
              {
                backgroundColor: colors.surface,
                borderColor: customClass ? colors.tint : colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Type class name..."
            placeholderTextColor={colors.textSecondary}
            value={customClass}
            onChangeText={handleCustomInput}
          />
        </View>
      </ScrollView>

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
  instructionsText: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: Spacing.md,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: Spacing.md,
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
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  classButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    width: '31%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  classButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  customInputContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  customLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  customInput: {
    borderWidth: 2,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
  },
  actions: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
});
