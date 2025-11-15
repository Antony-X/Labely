import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { mockJobs } from '@/data/mockData';
import { Job, JobStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';

export default function RequesterDashboard() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const getStatusVariant = (status: JobStatus) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: JobStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleTakeJob = (job: Job) => {
    // Navigate to appropriate labeling screen based on task type
    switch (job.taskType) {
      case 'binary':
        router.push(`/labeling/binary?jobId=${job.id}`);
        break;
      case 'multi-class':
        router.push(`/labeling/multi-class?jobId=${job.id}`);
        break;
      case 'bounding-box':
        router.push(`/labeling/bounding-box?jobId=${job.id}`);
        break;
      case 'segmentation':
        router.push(`/labeling/segmentation?jobId=${job.id}`);
        break;
      case 'text-sentiment':
        router.push(`/labeling/text-sentiment?jobId=${job.id}`);
        break;
      default:
        console.warn('Unknown task type:', job.taskType);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>My Jobs</Text>
          <Button
            title="Create Job"
            onPress={() => router.push('/create-job')}
            size="small"
          />
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card variant="secondary" style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {mockJobs.filter(j => j.status === 'active').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active</Text>
          </Card>
          <Card variant="secondary" style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {mockJobs.reduce((sum, j) => sum + j.completedItems, 0)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Labeled</Text>
          </Card>
          <Card variant="secondary" style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {Math.round(mockJobs.reduce((sum, j) => sum + j.confidence, 0) / mockJobs.length)}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Confidence</Text>
          </Card>
        </View>

        {/* Jobs List */}
        <View style={styles.jobsList}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Jobs</Text>
          {mockJobs.filter(j => j.status === 'active').map((job) => (
            <Card
              key={job.id}
            >
              <View style={styles.jobHeader}>
                <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
                <Badge label={getStatusLabel(job.status)} variant={getStatusVariant(job.status)} size="small" />
              </View>

              <View style={styles.jobMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="layers-outline" size={16} color={colors.icon} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {job.taskType}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="images-outline" size={16} color={colors.icon} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {job.completedItems}/{job.totalItems}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="cash-outline" size={16} color={colors.icon} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    ${job.budget}
                  </Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressRow}>
                  <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                    Progress
                  </Text>
                  <ProgressBar progress={job.progress} showLabel />
                </View>
                <View style={styles.progressRow}>
                  <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                    Confidence
                  </Text>
                  <ProgressBar progress={job.confidence} showLabel color={colors.success} />
                </View>
              </View>

              <View style={styles.jobActions}>
                <Button
                  title="View Details"
                  onPress={() => router.push(`/job-details?id=${job.id}`)}
                  variant="outline"
                  size="small"
                  style={{ flex: 1 }}
                />
                <Button
                  title="Start Labeling"
                  onPress={() => handleTakeJob(job)}
                  size="small"
                  style={{ flex: 1 }}
                />
              </View>
            </Card>
          ))}
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
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
  },
  jobsList: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  jobActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  jobTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    flex: 1,
  },
  jobMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: FontSizes.sm,
  },
  progressSection: {
    gap: Spacing.sm,
  },
  progressRow: {
    gap: Spacing.xs,
  },
  progressLabel: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
});
