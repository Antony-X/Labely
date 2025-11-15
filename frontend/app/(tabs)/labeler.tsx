import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { mockTasks, mockUserProfile } from '@/data/mockData';
import { LabelingSession } from '@/types';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = height * 0.65;

export default function Labeler() {
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
  const [cardAnimation] = useState(new Animated.Value(0));

  const currentTask = mockTasks[currentTaskIndex];
  const totalTasks = 10;

  const handleAnswer = (answer: string) => {
    const task = currentTask;
    const isCorrect = task.isGoldStandard ? task.correctAnswer === answer : true;
    const eloChange = Math.floor(Math.random() * 20) - 10;
    const reward = 0.08;

    // Animate card out
    Animated.timing(cardAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      cardAnimation.setValue(0);

      setSession({
        tasksCompleted: session.tasksCompleted + 1,
        correctAnswers: session.correctAnswers + (isCorrect ? 1 : 0),
        streak: isCorrect ? session.streak + 1 : 0,
        eloChange: session.eloChange + eloChange,
        totalEarned: session.totalEarned + reward,
      });

      if (session.tasksCompleted + 1 >= totalTasks) {
        setShowSummary(true);
      } else {
        setCurrentTaskIndex((currentTaskIndex + 1) % mockTasks.length);
      }
    });
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

  const cardTranslateX = cardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  const cardOpacity = cardAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0],
  });

  if (!currentTask) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <View style={[styles.eloContainer, { backgroundColor: colors.surface }]}>
            <Ionicons name="trophy" size={16} color={colors.gold} />
            <Text style={[styles.eloText, { color: colors.text }]}>
              {mockUserProfile.elo}
            </Text>
          </View>
          <View style={[styles.streakContainer, { backgroundColor: colors.surface }]}>
            <Ionicons name="flame" size={16} color={colors.warning} />
            <Text style={[styles.streakText, { color: colors.text }]}>
              {session.streak}
            </Text>
          </View>
        </View>

        <Text style={[styles.earnings, { color: colors.success }]}>
          +${session.totalEarned.toFixed(2)}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={styles.progressFilled}>
          {Array.from({ length: totalTasks }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  backgroundColor: i < session.tasksCompleted ? colors.tint : colors.surfaceSecondary,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Card Stack */}
      <View style={styles.cardStack}>
        {/* Next card (background) */}
        {mockTasks[(currentTaskIndex + 1) % mockTasks.length] && (
          <View
            style={[
              styles.card,
              styles.nextCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          />
        )}

        {/* Current card */}
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              transform: [{ translateX: cardTranslateX }],
              opacity: cardOpacity,
            },
          ]}
        >
          {/* Task Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: currentTask.imageUrl }} style={styles.image} />
            {currentTask.isGoldStandard && (
              <View style={[styles.goldBadge, { backgroundColor: colors.gold }]}>
                <Ionicons name="star" size={20} color="#000" />
                <Text style={styles.goldText}>Gold</Text>
              </View>
            )}
          </View>

          {/* Task Info */}
          <View style={styles.taskInfo}>
            <Text style={[styles.taskLabel, { color: colors.textSecondary }]}>
              {currentTask.taskType === 'binary' ? 'Choose one' :
               currentTask.taskType === 'multi' ? 'Select category' :
               'Draw objects'}
            </Text>
            <Text style={[styles.rewardLabel, { color: colors.success }]}>
              +$0.08 per label
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {currentTask.taskType === 'binary' ? (
          <>
            <Pressable
              onPress={() => handleAnswer(currentTask.classes[0])}
              style={[styles.actionButton, styles.rejectButton, { backgroundColor: colors.error }]}
            >
              <Ionicons name="close" size={32} color="#fff" />
              <Text style={styles.actionButtonText}>{currentTask.classes[0]}</Text>
            </Pressable>

            <Pressable
              onPress={() => handleAnswer(currentTask.classes[1])}
              style={[styles.actionButton, styles.acceptButton, { backgroundColor: colors.success }]}
            >
              <Ionicons name="checkmark" size={32} color="#fff" />
              <Text style={styles.actionButtonText}>{currentTask.classes[1]}</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.multiButtons}>
            {currentTask.classes.map((cls) => (
              <Pressable
                key={cls}
                onPress={() => handleAnswer(cls)}
                style={[styles.classButton, { backgroundColor: colors.tint }]}
              >
                <Text style={styles.classButtonText}>{cls}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Session Summary Modal */}
      <Modal
        visible={showSummary}
        onClose={() => {}}
        title="Session Complete!"
      >
        <View style={styles.summaryContent}>
          <View style={styles.summaryIcon}>
            <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Tasks Completed
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {session.tasksCompleted}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Accuracy
              </Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                {((session.correctAnswers / session.tasksCompleted) * 100).toFixed(0)}%
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Earned
              </Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                +${session.totalEarned.toFixed(2)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                ELO Change
              </Text>
              <Text
                style={[
                  styles.summaryValue,
                  { color: session.eloChange >= 0 ? colors.success : colors.error },
                ]}
              >
                {session.eloChange >= 0 ? '+' : ''}{session.eloChange}
              </Text>
            </View>
          </View>

          {session.streak > 5 && (
            <View style={styles.streakAchievement}>
              <Ionicons name="flame" size={40} color={colors.warning} />
              <Text style={[styles.streakAchievementText, { color: colors.text }]}>
                {session.streak} Task Streak! 🔥
              </Text>
            </View>
          )}

          <Button title="Done" onPress={handleEndSession} size="large" />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  topLeft: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  eloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  eloText: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  streakText: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  earnings: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
  },
  progressBar: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  progressFilled: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  cardStack: {
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
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  goldBadge: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  goldText: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: '#000',
  },
  taskInfo: {
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  rewardLabel: {
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  actions: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
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
  rejectButton: {
    marginRight: Spacing.sm,
  },
  acceptButton: {
    marginLeft: Spacing.sm,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  multiButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  classButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 4,
    borderRadius: BorderRadius.full,
    minWidth: '48%',
    alignItems: 'center',
  },
  classButtonText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  summaryContent: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  summaryIcon: {
    marginBottom: Spacing.md,
  },
  summaryStats: {
    width: '100%',
    gap: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FontSizes.md,
  },
  summaryValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },
  streakAchievement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  streakAchievementText: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
});
