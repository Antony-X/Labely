import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          {mockJobs.map((job) => (
            <Card
              key={job.id}
              onPress={() => router.push(`/job-details?id=${job.id}`)}
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
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
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
