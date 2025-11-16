import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { apiService, DATASET_NAMES } from '@/services/api';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - 32;
const IMAGE_HEIGHT = IMAGE_WIDTH * 0.75;

interface Box {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function BoundingBoxLabeling() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { jobId } = useLocalSearchParams();

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [drawingBox, setDrawingBox] = useState<{ startX: number; startY: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dataset, setDataset] = useState<any>(null);

  useEffect(() => {
    loadDataset();
  }, []);

  const loadDataset = async () => {
    try {
      setLoading(true);
      const datasetData = await apiService.getDataset(DATASET_NAMES.BOUNDING_BOX);
      console.log('📦 Bounding box dataset loaded:', datasetData);
      setDataset(datasetData);

      if (datasetData.data && datasetData.data.length > 0) {
        console.log('📥 Loading first bounding box item...');
        loadItem(datasetData, 0);
      } else {
        console.log('⚠️ No data in bounding box dataset');
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to load dataset:', error);
      // Fallback to mock data
      setImageUrl('https://picsum.photos/400/300?random=4');
      setLoading(false);
    }
  };

  const loadItem = (datasetData: any, itemId: number) => {
    console.log('🔄 loadItem called with itemId:', itemId);
    if (!datasetData || !datasetData.data || !datasetData.data[itemId]) {
      console.log('❌ No data for item:', itemId);
      return;
    }

    const url = apiService.getImageUrl(DATASET_NAMES.BOUNDING_BOX, itemId);
    console.log('🖼️ Bounding box image URL:', url);
    setImageUrl(url);
    setCurrentItemId(itemId);
    setBoxes([]);
    setCurrentBox(null);
    setDrawingBox(null);
    setIsDrawingMode(false);
    setLoading(false);
    console.log('✅ Bounding box item loaded');
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isDrawingMode,
      onMoveShouldSetPanResponder: () => isDrawingMode,
      onPanResponderGrant: (evt) => {
        if (!isDrawingMode) return;
        const { locationX, locationY } = evt.nativeEvent;
        setDrawingBox({ startX: locationX, startY: locationY });
      },
      onPanResponderMove: (evt) => {
        if (!drawingBox || !isDrawingMode) return;
        const { locationX, locationY } = evt.nativeEvent;
        const x = Math.min(drawingBox.startX, locationX);
        const y = Math.min(drawingBox.startY, locationY);
        const boxWidth = Math.abs(locationX - drawingBox.startX);
        const boxHeight = Math.abs(locationY - drawingBox.startY);

        setCurrentBox({
          id: 'temp',
          x,
          y,
          width: boxWidth,
          height: boxHeight,
        });
      },
      onPanResponderRelease: () => {
        if (currentBox && currentBox.width > 20 && currentBox.height > 20) {
          setBoxes((prev) => [
            ...prev,
            { ...currentBox, id: `box-${Date.now()}` },
          ]);
        }
        setDrawingBox(null);
        setCurrentBox(null);
        // Keep drawing mode active so user can draw multiple boxes
      },
    })
  ).current;

  const handleDeleteBox = (id: string) => {
    setBoxes((prev) => prev.filter((box) => box.id !== id));
  };

  const handleSubmit = async () => {
    console.log('Submitting bounding boxes:', boxes);

    // TODO: Submit boxes to backend when API is ready

    // Move to next item if available
    if (dataset && currentItemId < dataset.data.length - 1) {
      console.log(`📥 Loading next bounding box item: ${currentItemId + 1}/${dataset.data.length}`);
      loadItem(dataset, currentItemId + 1);
      setIsDrawingMode(false);
    } else {
      console.log('🎉 All bounding box items completed!');
      router.back();
    }
  };

  const handleClear = () => {
    setBoxes([]);
  };

  const handleToggleDrawMode = () => {
    setIsDrawingMode(!isDrawingMode);
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bounding Boxes</Text>
        <Pressable onPress={handleClear}>
          <Ionicons name="trash-outline" size={24} color={colors.error} />
        </Pressable>
      </View>

      {/* Instructions */}
      <View style={[styles.instructions, { backgroundColor: colors.surfaceSecondary }]}>
        <Text style={[styles.instructionsText, { color: colors.text }]}>
          {isDrawingMode
            ? 'Drawing mode active - drag on the image to create boxes'
            : `Tap "Draw Bounding Box" to start drawing`}
        </Text>
      </View>

      {/* Canvas */}
      <View style={styles.canvasContainer}>
        <View style={styles.imageWrapper} {...panResponder.panHandlers}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
            onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
          />
          {/* Render existing boxes */}
          {boxes.map((box) => (
            <View
              key={box.id}
              style={[
                styles.box,
                {
                  left: box.x,
                  top: box.y,
                  width: box.width,
                  height: box.height,
                  borderColor: colors.tint,
                },
              ]}
            >
              <Pressable
                onPress={() => handleDeleteBox(box.id)}
                style={[styles.deleteButton, { backgroundColor: colors.error }]}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </Pressable>
            </View>
          ))}
          {/* Render current drawing box */}
          {currentBox && (
            <View
              style={[
                styles.box,
                {
                  left: currentBox.x,
                  top: currentBox.y,
                  width: currentBox.width,
                  height: currentBox.height,
                  borderColor: colors.tint,
                },
              ]}
            />
          )}
        </View>
      </View>

      {/* Box Count & Progress */}
      <View style={styles.boxCount}>
        <Ionicons name="cube-outline" size={20} color={colors.text} />
        <Text style={[styles.boxCountText, { color: colors.text }]}>
          {boxes.length} box{boxes.length !== 1 ? 'es' : ''} drawn
        </Text>
        {dataset && (
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {' • '}{currentItemId + 1}/{dataset.data.length}
          </Text>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title={isDrawingMode ? "Stop Drawing" : "Draw Bounding Box"}
          onPress={handleToggleDrawMode}
          style={{ flex: 1 }}
          variant={isDrawingMode ? "outline" : "primary"}
          icon={isDrawingMode ? "stop-circle-outline" : "add-circle-outline"}
        />
      </View>

      <View style={styles.bottomActions}>
        <Button
          title="Skip"
          onPress={handleSubmit}
          variant="outline"
          style={{ flex: 1 }}
        />
        <Button
          title="Submit"
          onPress={handleSubmit}
          style={{ flex: 2 }}
          disabled={boxes.length === 0}
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
  instructions: {
    padding: Spacing.md,
  },
  instructionsText: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  canvasContainer: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  box: {
    position: 'absolute',
    borderWidth: 3,
    borderStyle: 'solid',
  },
  deleteButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxCount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  boxCountText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  progressText: {
    fontSize: FontSizes.sm,
  },
  actions: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
});
