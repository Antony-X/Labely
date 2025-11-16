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

  const imageUrl = 'https://picsum.photos/400/300?random=4';

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
        const width = Math.abs(locationX - drawingBox.startX);
        const height = Math.abs(locationY - drawingBox.startY);

        setCurrentBox({
          id: 'temp',
          x,
          y,
          width,
          height,
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
        setIsDrawingMode(false);
      },
    })
  ).current;

  const handleDeleteBox = (id: string) => {
    setBoxes((prev) => prev.filter((box) => box.id !== id));
  };

  const handleSubmit = () => {
    console.log('Submitting boxes:', boxes);
    router.back();
  };

  const handleClear = () => {
    setBoxes([]);
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bounding Boxes</Text>
        <Pressable onPress={handleClear}>
          <Ionicons name="trash-outline" size={24} color={colors.error} />
        </Pressable>
      </View>

      {/* Instructions */}
      <View style={[styles.instructions, { backgroundColor: colors.surfaceSecondary }]}>
        <Text style={[styles.instructionsText, { color: colors.text }]}>
          {isDrawingMode
            ? 'Draw a box by dragging on the image'
            : `Tap "Draw Bounding Box" to start drawing`}
        </Text>
      </View>

      {/* Canvas */}
      <View style={styles.canvasContainer}>
        <View style={styles.imageWrapper} {...panResponder.panHandlers}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
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

      {/* Box Count */}
      <View style={styles.boxCount}>
        <Ionicons name="cube-outline" size={20} color={colors.text} />
        <Text style={[styles.boxCountText, { color: colors.text }]}>
          {boxes.length} box{boxes.length !== 1 ? 'es' : ''} drawn
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {!isDrawingMode && (
          <Button
            title="Draw Bounding Box"
            onPress={handleDrawMode}
            style={{ flex: 1 }}
            icon="add-circle-outline"
          />
        )}
        {isDrawingMode && (
          <View style={styles.drawingModeIndicator}>
            <Ionicons name="hand-left" size={24} color={colors.tint} />
            <Text style={[styles.drawingModeText, { color: colors.tint }]}>
              Drawing mode active - drag on image
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottomActions}>
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
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  boxCountText: {
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
