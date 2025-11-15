import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { mockTasks, mockUserProfile } from '@/data/mockData';
import { TaskType } from '@/types';
import { Ionicons } from '@expo/vector-icons';

export default function Labeler() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const getRandomTask = () => {
    // Get a random task from mockTasks
    const randomIndex = Math.floor(Math.random() * mockTasks.length);
    return mockTasks[randomIndex];
  };

  const handleStartLabeling = () => {
    const task = getRandomTask();
    navigateToLabelingScreen(task.taskType, task.jobId);
  };

  const navigateToLabelingScreen = (taskType: TaskType, jobId: string) => {
    switch (taskType) {
      case 'binary':
        router.push(`/labeling/binary?jobId=${jobId}`);
        break;
      case 'multi-class':
        router.push(`/labeling/multi-class?jobId=${jobId}`);
        break;
      case 'bounding-box':
        router.push(`/labeling/bounding-box?jobId=${jobId}`);
        break;
      case 'segmentation':
        router.push(`/labeling/segmentation?jobId=${jobId}`);
        break;
      case 'text-sentiment':
        router.push(`/labeling/text-sentiment?jobId=${jobId}`);
        break;
      default:
        console.warn('Unknown task type:', taskType);
    }
  };

  const taskTypeIcons: { [key in TaskType]: string } = {
    'binary': 'git-compare-outline',
    'multi-class': 'apps-outline',
    'bounding-box': 'square-outline',
    'segmentation': 'brush-outline',
    'text-sentiment': 'chatbox-ellipses-outline',
  };

  const taskTypeDescriptions: { [key in TaskType]: string } = {
    'binary': 'Choose between two options',
    'multi-class': 'Select from multiple categories',
    'bounding-box': 'Draw boxes around objects',
    'segmentation': 'Paint to segment objects',
    'text-sentiment': 'Classify text sentiment',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Label & Earn</Text>
          <View style={[styles.eloContainer, { backgroundColor: colors.surface }]}>
            <Ionicons name="trophy" size={16} color={colors.gold} />
            <Text style={[styles.eloText, { color: colors.text }]}>
              {mockUserProfile.elo}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card variant="secondary" style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={32} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {mockUserProfile.totalTasksCompleted}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
          </Card>
          <Card variant="secondary" style={styles.statCard}>
            <Ionicons name="flame" size={32} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {mockUserProfile.currentStreak}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Streak</Text>
          </Card>
          <Card variant="secondary" style={styles.statCard}>
            <Ionicons name="speedometer" size={32} color={colors.tint} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {mockUserProfile.accuracy}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Accuracy</Text>
          </Card>
        </View>

        {/* Quick Start */}
        <Card style={styles.quickStartCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Start</Text>
          <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
            Start labeling random tasks and earn rewards instantly
          </Text>
          <Pressable
            onPress={handleStartLabeling}
            style={[styles.quickStartButton, { backgroundColor: colors.tint }]}
          >
            <Ionicons name="flash" size={32} color="#fff" />
            <Text style={styles.quickStartText}>Start Random Task</Text>
          </Pressable>
        </Card>

        {/* Task Types */}
        <View style={styles.taskTypes}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Browse by Type</Text>
          <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
            Choose a specific task type to work on
          </Text>

          <View style={styles.taskTypeGrid}>
            {Object.entries(taskTypeIcons).map(([taskType, icon]) => {
              const task = mockTasks.find(t => t.taskType === taskType);
              if (!task) return null;

              return (
                <Card
                  key={taskType}
                  variant="secondary"
                  style={styles.taskTypeCard}
                  onPress={() => navigateToLabelingScreen(taskType as TaskType, task.jobId)}
                >
                  <Ionicons name={icon as any} size={40} color={colors.tint} />
                  <Text style={[styles.taskTypeName, { color: colors.text }]}>
                    {taskType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </Text>
                  <Text style={[styles.taskTypeDesc, { color: colors.textSecondary }]}>
                    {taskTypeDescriptions[taskType as TaskType]}
                  </Text>
                </Card>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
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
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: FontSizes.xs,
  },
  quickStartCard: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  sectionDesc: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
  quickStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  quickStartText: {
    color: '#fff',
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  taskTypes: {
    marginBottom: Spacing.lg,
  },
  taskTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  taskTypeCard: {
    width: '48%',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  taskTypeName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  taskTypeDesc: {
    fontSize: FontSizes.xs,
    textAlign: 'center',
  },
});
