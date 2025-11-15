import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  PanResponder,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockTasks, mockUserProfile } from '@/data/mockData';
import { Task, LabelingSession, BoundingBox } from '@/types';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LabelerScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [session, setSession] = useState<LabelingSession>({
    tasksCompleted: 0,
    correctAnswers: 0,
    streak: mockUserProfile.currentStreak || 0,
    eloChange: 0,
    totalEarned: 0,
  });
  const [showSummary, setShowSummary] = useState(false);
  const [showGoldWarning, setShowGoldWarning] = useState(false);
  const [lastEloChange, setLastEloChange] = useState(0);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const currentTask = mockTasks[currentTaskIndex];
  const totalTasks = 10; // Session limit
  const progressPercent = (session.tasksCompleted / totalTasks) * 100;

  const handleAnswer = (answer: string) => {
    const task = currentTask;
    const isCorrect = task.isGoldStandard ? task.correctAnswer === answer : true;
    const eloChange = Math.floor(Math.random() * 20) - 10; // Mock ELO change (-10 to +10)
    const reward = 0.05; // Mock reward

    if (task.isGoldStandard && !isCorrect) {
      setShowGoldWarning(true);
      setTimeout(() => setShowGoldWarning(false), 2000);
    }

    setLastEloChange(eloChange);
    setSession({
      tasksCompleted: session.tasksCompleted + 1,
      correctAnswers: session.correctAnswers + (isCorrect ? 1 : 0),
      streak: isCorrect ? session.streak + 1 : 0,
      eloChange: session.eloChange + eloChange,
      totalEarned: session.totalEarned + reward,
    });

    // Move to next task
    if (session.tasksCompleted + 1 >= totalTasks) {
      setShowSummary(true);
    } else {
      const nextIndex = (currentTaskIndex + 1) % mockTasks.length;
      setCurrentTaskIndex(nextIndex);
      setBoundingBoxes([]);
      setSelectedClass(null);
    }
  };

  const handleEndSession = () => {
    setShowSummary(false);
    setSession({
      tasksCompleted: 0,
      correctAnswers: 0,
      streak: session.streak,
      eloChange: 0,
      totalEarned: 0,
    });
    setCurrentTaskIndex(0);
  };

  const renderTaskUI = () => {
    if (!currentTask) return null;

    switch (currentTask.taskType) {
      case 'binary':
        return (
          <View style={styles.binaryContainer}>
            <Button
              title={currentTask.classes[0]}
              onPress={() => handleAnswer(currentTask.classes[0])}
              size="large"
              style={styles.binaryButton}
            />
            <Button
              title={currentTask.classes[1]}
              onPress={() => handleAnswer(currentTask.classes[1])}
              variant="secondary"
              size="large"
              style={styles.binaryButton}
            />
          </View>
        );

      case 'multi':
        return (
          <View style={styles.multiContainer}>
            {currentTask.classes.map((cls) => (
              <Button
                key={cls}
                title={cls}
                onPress={() => handleAnswer(cls)}
                variant="outline"
                style={styles.multiButton}
              />
            ))}
          </View>
        );

      case 'object-detection':
        return (
          <View style={styles.objectDetectionContainer}>
            <View style={styles.classSelector}>
              {currentTask.classes.map((cls) => (
                <Pressable
                  key={cls}
                  onPress={() => setSelectedClass(cls)}
                  style={[
                    styles.classButton,
                    {
                      backgroundColor: selectedClass === cls ? colors.tint : colors.surfaceSecondary,
                      borderColor: selectedClass === cls ? colors.tint : colors.border,
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.classButtonText,
                      { color: selectedClass === cls ? '#fff' : colors.text }
                    ]}
                  >
                    {cls}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              Tap to draw bounding boxes (mock)
            </Text>

            <Button
              title="Submit Annotations"
              onPress={() => handleAnswer('annotated')}
              style={{ marginTop: Spacing.md }}
            />
          </View>
        );

      default:
        return null;
    }
  };

  if (!currentTask) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No tasks available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Stats */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerLeft}>
          <Badge label={`ELO ${mockUserProfile.elo}`} variant="gold" />
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color={colors.warning} />
            <Text style={[styles.streakText, { color: colors.text }]}>
              {session.streak}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Text style={[styles.earnings, { color: colors.success }]}>
            +${session.totalEarned.toFixed(2)}
          </Text>
          <Pressable onPress={() => setShowSummary(true)}>
            <Ionicons name="close-circle-outline" size={24} color={colors.icon} />
          </Pressable>
        </View>
      </View>

      {/* Session Progress */}
      <View style={styles.progressSection}>
        <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
          Task {session.tasksCompleted + 1} of {totalTasks}
        </Text>
        <ProgressBar progress={progressPercent} showLabel={false} />
      </View>

      {/* Gold Item Warning */}
      {showGoldWarning && (
        <View style={[styles.goldWarning, { backgroundColor: colors.gold }]}>
          <Ionicons name="warning" size={20} color="#000" />
          <Text style={styles.goldWarningText}>
            Incorrect! This was a gold standard item.
          </Text>
        </View>
      )}

      {/* ELO Change Indicator */}
      {lastEloChange !== 0 && (
        <View style={[
          styles.eloChange,
          { backgroundColor: lastEloChange > 0 ? colors.success : colors.error }
        ]}>
          <Text style={styles.eloChangeText}>
            {lastEloChange > 0 ? '+' : ''}{lastEloChange} ELO
          </Text>
        </View>
      )}

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: currentTask.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {currentTask.isGoldStandard && (
          <View style={[styles.goldBadge, { backgroundColor: colors.gold }]}>
            <Ionicons name="star" size={16} color="#000" />
          </View>
        )}
      </View>

      {/* Task UI */}
      <View style={styles.taskUIContainer}>
        <Text style={[styles.taskType, { color: colors.textSecondary }]}>
          {currentTask.taskType === 'binary' ? 'Binary Classification' :
           currentTask.taskType === 'multi' ? 'Multi-class Classification' :
           'Object Detection'}
        </Text>
        {renderTaskUI()}
      </View>

      {/* Session Summary Modal */}
      <Modal
        visible={showSummary}
        onClose={() => {}}
        title="Session Summary"
        actions={
          <Button title="Done" onPress={handleEndSession} />
        }
      >
        <View style={styles.summaryContent}>
          <View style={styles.summaryRow}>
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            <Text style={[styles.summaryTitle, { color: colors.text }]}>
              Great Work!
            </Text>
          </View>

          <Card variant="secondary">
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {session.tasksCompleted}
                </Text>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Tasks Completed
                </Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {((session.correctAnswers / session.tasksCompleted) * 100).toFixed(0)}%
                </Text>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Accuracy
                </Text>
              </View>
            </View>
          </Card>

          <Card variant="secondary">
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryValue, { color: colors.success }]}>
                  +${session.totalEarned.toFixed(2)}
                </Text>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Earned
                </Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={[
                  styles.summaryValue,
                  { color: session.eloChange >= 0 ? colors.success : colors.error }
                ]}>
                  {session.eloChange >= 0 ? '+' : ''}{session.eloChange}
                </Text>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  ELO Change
                </Text>
              </View>
            </View>
          </Card>

          {session.streak > 5 && (
            <View style={styles.streakAchievement}>
              <Ionicons name="flame" size={32} color={colors.warning} />
              <Text style={[styles.streakAchievementText, { color: colors.text }]}>
                {session.streak} task streak!
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  streakText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  earnings: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  progressSection: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  progressLabel: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  goldWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  goldWarningText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#000',
  },
  eloChange: {
    position: 'absolute',
    top: 120,
    right: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    zIndex: 10,
  },
  eloChangeText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: width - Spacing.md * 2,
    height: width - Spacing.md * 2,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  goldBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskUIContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  taskType: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  binaryContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  binaryButton: {
    flex: 1,
  },
  multiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  multiButton: {
    minWidth: '48%',
  },
  objectDetectionContainer: {
    gap: Spacing.md,
  },
  classSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  classButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  classButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  hint: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
  },
  summaryContent: {
    gap: Spacing.md,
  },
  summaryRow: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  summaryTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
  },
  streakAchievement: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  streakAchievementText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
});
