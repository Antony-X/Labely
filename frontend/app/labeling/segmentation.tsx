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
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

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

  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);

  // Hardcoded mock image - drawing is always enabled
  const imageUrl = 'https://picsum.photos/seed/segmentation/600/400';
  const brushSize = 20;
  const drawColor = '#3b82f6'; // Blue color for drawing

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (evt) => {
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

  const handleClear = () => {
    setPaths([]);
    setCurrentPath([]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Paint Tool</Text>
        <Pressable onPress={handleClear}>
          <Ionicons name="trash-outline" size={24} color={colors.error} />
        </Pressable>
      </View>

      {/* Instructions */}
      <View style={[styles.instructions, { backgroundColor: colors.surfaceSecondary }]}>
        <Text style={[styles.instructionsText, { color: colors.text }]}>
          Draw on the image with your finger
        </Text>
      </View>

      {/* Canvas */}
      <View style={styles.canvasContainer}>
        <View style={styles.imageWrapper} {...panResponder.panHandlers}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
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

      {/* OK Button */}
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.okButton, { backgroundColor: colors.tint }]}
        >
          <Text style={styles.okButtonText}>OK</Text>
        </Pressable>
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
  buttonContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  okButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  okButtonText: {
    color: '#fff',
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
});
