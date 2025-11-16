import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

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
  const [brushSize, setBrushSize] = useState(20);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const imageUrl = 'https://picsum.photos/400/300?random=6';
  const drawColor = colors.tint;

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
        setIsDrawingMode(false);
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

  const handleSubmit = () => {
    console.log('Submitting paths:', paths);
    router.back();
  };

  const handleDrawMode = () => {
    setIsDrawingMode(true);
  };

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
            ? 'Paint over objects to segment them'
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

      {/* Brush Size */}
      <View style={styles.brushControl}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          Brush Size: {brushSize}
        </Text>
        <View style={styles.brushSizes}>
          {[10, 20, 30, 40].map((size) => (
            <Pressable
              key={size}
              onPress={() => setBrushSize(size)}
              style={[
                styles.brushSizeButton,
                {
                  backgroundColor: brushSize === size ? colors.tint : colors.surface,
                },
              ]}
            >
              <Text style={[styles.brushSizeText, { color: brushSize === size ? '#fff' : colors.text }]}>
                {size}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {!isDrawingMode && (
          <Button
            title="Draw Segmentation"
            onPress={handleDrawMode}
            style={{ flex: 1 }}
            icon="brush-outline"
          />
        )}
        {isDrawingMode && (
          <View style={styles.drawingModeIndicator}>
            <Ionicons name="hand-left" size={24} color={colors.tint} />
            <Text style={[styles.drawingModeText, { color: colors.tint }]}>
              Drawing mode active - paint on image
            </Text>
          </View>
        )}
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
  brushControl: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  brushSizes: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  brushSizeButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  brushSizeText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  actions: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  drawingModeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  drawingModeText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
});
