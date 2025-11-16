import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
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
const CARD_HEIGHT = height * 0.50;

export default function TextSentimentLabeling() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { jobId } = useLocalSearchParams();

  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);
  const [cardAnimation] = useState(new Animated.Value(0));
  const [currentItemId, setCurrentItemId] = useState(0);
  const [textContent, setTextContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dataset, setDataset] = useState<any>(null);

  const sentiments = [
    { label: 'positive', icon: 'happy-outline', color: '#4ade80' },
    { label: 'negative', icon: 'sad-outline', color: '#f87171' },
  ];

  useEffect(() => {
    loadDataset();
  }, []);

  const loadDataset = async () => {
    try {
      setLoading(true);
      const datasetData = await apiService.getTextDataset(DATASET_NAMES.TEXT_SENTIMENT);
      setDataset(datasetData);

      if (datasetData.data && datasetData.data.length > 0) {
        loadItem(0);
      }
    } catch (error) {
      console.error('Failed to load dataset:', error);
      // Fallback to mock data
      setTextContent('This product is absolutely amazing! Best purchase I\'ve ever made.');
      setLoading(false);
    }
  };

  const loadItem = (itemId: number) => {
    if (!dataset || !dataset.data[itemId]) return;

    const item = dataset.data[itemId];
    setTextContent(item.review || item.text || '');
    setCurrentItemId(itemId);
    setSelectedSentiment(null);
    setLoading(false);
  };

  const handleSelect = (sentiment: string) => {
    setSelectedSentiment(sentiment);
  };

  const handleSubmit = async () => {
    if (!selectedSentiment) return;

    // Submit to backend
    if (dataset) {
      try {
        await apiService.setTextLabel(DATASET_NAMES.TEXT_SENTIMENT, currentItemId, selectedSentiment);
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
        loadItem(currentItemId + 1);
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Text Sentiment</Text>
        {dataset && (
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {currentItemId + 1}/{dataset.data.length}
          </Text>
        )}
      </View>

      {/* Instructions */}
      <View style={[styles.instructions, { backgroundColor: colors.surfaceSecondary }]}>
        <Text style={[styles.instructionsText, { color: colors.text }]}>
          Read the text and classify its sentiment
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
          <ScrollView
            contentContainerStyle={styles.textContent}
            showsVerticalScrollIndicator={false}
          >
            <Ionicons name="chatbox-ellipses-outline" size={48} color={colors.tint} />
            <Text style={[styles.textLabel, { color: colors.text }]}>
              {textContent}
            </Text>
          </ScrollView>
          <View style={styles.cardFooter}>
            <Text style={[styles.rewardLabel, { color: colors.success }]}>
              +$0.04 per label
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Sentiment Buttons */}
      <View style={styles.sentimentButtons}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          Select Sentiment:
        </Text>
        <View style={styles.buttonRow}>
          {sentiments.map((sentiment) => (
            <Pressable
              key={sentiment.label}
              onPress={() => handleSelect(sentiment.label)}
              style={[
                styles.sentimentButton,
                {
                  backgroundColor: selectedSentiment === sentiment.label
                    ? sentiment.color
                    : colors.surface,
                  borderColor: sentiment.color,
                },
              ]}
            >
              <Ionicons
                name={sentiment.icon as any}
                size={32}
                color={selectedSentiment === sentiment.label ? '#fff' : sentiment.color}
              />
              <Text
                style={[
                  styles.sentimentButtonText,
                  { color: selectedSentiment === sentiment.label ? '#fff' : colors.text },
                ]}
              >
                {sentiment.label}
              </Text>
              {selectedSentiment === sentiment.label && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                </View>
              )}
            </Pressable>
          ))}
        </View>
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
          disabled={!selectedSentiment}
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
  cardContainer: {
    flex: 1,
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
  textContent: {
    flex: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  textLabel: {
    fontSize: FontSizes.lg,
    lineHeight: 28,
    textAlign: 'center',
  },
  cardFooter: {
    padding: Spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  rewardLabel: {
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  sentimentButtons: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  sentimentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    gap: Spacing.xs,
    position: 'relative',
  },
  sentimentButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  actions: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
});
