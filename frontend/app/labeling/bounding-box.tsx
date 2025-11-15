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
import { BoundingBox } from '@/types';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - 32;
const IMAGE_HEIGHT = IMAGE_WIDTH * 0.75;

interface Box extends BoundingBox {
  id: string;
}

export default function BoundingBoxLabeling() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { jobId } = useLocalSearchParams();

  const [currentClass, setCurrentClass] = useState('Car');
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [drawingBox, setDrawingBox] = useState<{ startX: number; startY: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);

  const imageUrl = 'https://picsum.photos/400/300?random=4';
  const classes = ['Car', 'Truck', 'Motorcycle', 'Bus'];

  const classColors: { [key: string]: string } = {
    'Car': '#FF6B6B',
    'Truck': '#4ECDC4',
    'Motorcycle': '#45B7D1',
    'Bus': '#95E1D3',
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setDrawingBox({ startX: locationX, startY: locationY });
      },
      onPanResponderMove: (evt) => {
        if (!drawingBox) return;
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
          class: currentClass,
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
          Draw boxes around objects. Select a class and drag to create a box.
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
                  borderColor: classColors[box.class],
                },
              ]}
            >
              <View style={[styles.boxLabel, { backgroundColor: classColors[box.class] }]}>
                <Text style={styles.boxLabelText}>{box.class}</Text>
                <Pressable onPress={() => handleDeleteBox(box.id)}>
                  <Ionicons name="close-circle" size={16} color="#fff" />
                </Pressable>
              </View>
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
                  borderColor: classColors[currentBox.class],
                },
              ]}
            >
              <View style={[styles.boxLabel, { backgroundColor: classColors[currentBox.class] }]}>
                <Text style={styles.boxLabelText}>{currentBox.class}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Class Selector */}
      <View style={styles.classSelector}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          Select Class:
        </Text>
        <View style={styles.classButtons}>
          {classes.map((cls) => (
            <Pressable
              key={cls}
              onPress={() => setCurrentClass(cls)}
              style={[
                styles.classButton,
                {
                  backgroundColor: currentClass === cls ? classColors[cls] : colors.surface,
                  borderColor: classColors[cls],
                },
              ]}
            >
              <View style={[styles.colorDot, { backgroundColor: classColors[cls] }]} />
              <Text
                style={[
                  styles.classButtonText,
                  { color: currentClass === cls ? '#fff' : colors.text },
                ]}
              >
                {cls}
              </Text>
            </Pressable>
          ))}
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
  boxLabel: {
    position: 'absolute',
    top: -24,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  boxLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  classSelector: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  sectionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  classButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  classButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    gap: Spacing.xs,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  classButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
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
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
});
