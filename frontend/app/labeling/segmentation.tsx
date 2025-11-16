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
import Svg, { Path } from 'react-native-svg';
import { apiService, DATASET_NAMES } from '@/services/api';

const { width } = Dimensions.get('window');

interface Point {
  x: number;
  y: number;
}

interface PathData {
  points: Point[];
  color: string;
}

export default function SegmentationLabeling() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { jobId } = useLocalSearchParams();

  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dataset, setDataset] = useState<any>(null);

  const brushSize = 20; // Fixed brush size
  const drawColor = colors.tint;

  useEffect(() => {
    loadDataset();
  }, []);

  const loadDataset = async () => {
    try {
      setLoading(true);
      const datasetData = await apiService.getDataset(DATASET_NAMES.SEGMENTATION);
      setDataset(datasetData);

      if (datasetData.data && datasetData.data.length > 0) {
        loadItem(0);
      }
    } catch (error) {
      console.error('Failed to load dataset:', error);
      // Fallback to mock data
      setImageUrl('https://picsum.photos/400/300?random=6');
      setLoading(false);
    }
  };

  const loadItem = (itemId: number) => {
    if (!dataset || !dataset.data[itemId]) return;

    const url = apiService.getImageUrl(DATASET_NAMES.SEGMENTATION, itemId);
    setImageUrl(url);
    setCurrentItemId(itemId);
    setPaths([]);
    setLoading(false);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isDrawingMode,
      onMoveShouldSetPanResponder: () => isDrawingMode,
      onPanResponderGrant: (evt) => {
        if (!isDrawingMode) return;
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (evt) => {
        if (!isDrawingMode) return;
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath((prev) => [...prev, { x: locationX, y: locationY }]);
      },
      onPanResponderRelease: () => {
        if (currentPath.length > 0) {
          setPaths((prev) => [
            ...prev,
            {
              points: currentPath,
              color: drawColor,
            },
          ]);
          setCurrentPath([]);
        }
        // Keep drawing mode active
      },
    })
  ).current;

  const pathToString = (points: Point[]) => {
    if (points.length === 0) return '';
    return points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${path} L ${point.x} ${point.y}`;
    }, '');
  };

  const handleUndo = () => {
    setPaths((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPaths([]);
    setCurrentPath([]);
  };

  const handleSubmit = async () => {
    console.log('Submitting paths:', paths);

    // Move to next item if available
    if (dataset && currentItemId < dataset.data.length - 1) {
      loadItem(currentItemId + 1);
      setIsDrawingMode(false);
    } else {
      router.back();
    }
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Segmentation</Text>
        <Pressable onPress={handleClear}>
          <Ionicons name="trash-outline" size={24} color={colors.error} />
        </Pressable>
      </View>

      {/* Instructions */}
      <View style={[styles.instructions, { backgroundColor: colors.surfaceSecondary }]}>
        <Text style={[styles.instructionsText, { color: colors.text }]}>
          {isDrawingMode
            ? 'Drawing mode active - paint over objects to segment them'
            : `Tap "Draw Segmentation" to start drawing`}
        </Text>
      </View>

      {/* Canvas */}
      <View style={styles.canvasContainer}>
        <View style={styles.imageWrapper} {...panResponder.panHandlers}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <Svg style={StyleSheet.absoluteFill}>
            {paths.map((pathData, index) => (
              <Path
                key={`path-${index}`}
                d={pathToString(pathData.points)}
                stroke={pathData.color}
                strokeWidth={brushSize}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={0.6}
              />
            ))}
            {currentPath.length > 0 && (
              <Path
                d={pathToString(currentPath)}
                stroke={drawColor}
                strokeWidth={brushSize}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={0.6}
              />
            )}
          </Svg>
        </View>
      </View>

      {/* Progress */}
      {dataset && (
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            Image {currentItemId + 1} of {dataset.data.length}
          </Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title={isDrawingMode ? "Stop Drawing" : "Draw Segmentation"}
          onPress={handleToggleDrawMode}
          style={{ flex: 1 }}
          variant={isDrawingMode ? "outline" : "primary"}
          icon={isDrawingMode ? "stop-circle-outline" : "brush-outline"}
        />
      </View>

      <View style={styles.bottomActions}>
        <Button
          title="Undo"
          onPress={handleUndo}
          variant="outline"
          style={{ flex: 1 }}
          disabled={paths.length === 0}
        />
        <Button
          title="Submit"
          onPress={handleSubmit}
          style={{ flex: 2 }}
          disabled={paths.length === 0}
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
    width: width - 32,
    height: (width - 32) * 0.75,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
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
