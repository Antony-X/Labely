import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { mockJobs, mockProgressData, mockConfidenceData } from '@/data/mockData';
import { Ionicons } from '@expo/vector-icons';

export default function JobDetails() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const job = mockJobs.find(j => j.id === id);

  if (!job) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Job not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Job Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Job Info */}
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]}>{job.title}</Text>
          <Badge
            label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            variant={job.status === 'active' ? 'success' : 'default'}
          />
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card variant="secondary" style={styles.statCard}>
            <Ionicons name="images-outline" size={24} color={colors.icon} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {job.completedItems}/{job.totalItems}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Items</Text>
          </Card>

          <Card variant="secondary" style={styles.statCard}>
            <Ionicons name="cash-outline" size={24} color={colors.icon} />
            <Text style={[styles.statValue, { color: colors.text }]}>${job.budget}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Budget</Text>
          </Card>

          <Card variant="secondary" style={styles.statCard}>
            <Ionicons name="speedometer-outline" size={24} color={colors.icon} />
            <Text style={[styles.statValue, { color: colors.text }]}>{job.confidence}%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Confidence</Text>
          </Card>

          <Card variant="secondary" style={styles.statCard}>
            <Ionicons name="wallet-outline" size={24} color={colors.icon} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              ${job.rewardPerItem.toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Per Item</Text>
          </Card>
        </View>

        {/* Progress */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Progress</Text>
          <ProgressBar progress={job.progress} />

          {/* Mock Progress Chart */}
          <View style={styles.chartContainer}>
            <View style={styles.chartBars}>
              {mockProgressData.map((point, index) => (
                <View key={index} style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${point.value}%`,
                        backgroundColor: colors.tint,
                      }
                    ]}
                  />
                  <Text style={[styles.barLabel, { color: colors.textSecondary }]}>
                    {point.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Card>

        {/* Confidence Timeline */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Confidence Timeline</Text>

          {/* Mock Line Chart */}
          <View style={styles.lineChartContainer}>
            <View style={styles.lineChart}>
              {mockConfidenceData.map((point, index) => (
                <View key={index} style={styles.pointContainer}>
                  <View
                    style={[
                      styles.point,
                      {
                        bottom: `${point.value - 20}%`,
                        backgroundColor: colors.success,
                      }
                    ]}
                  />
                  <Text style={[styles.pointLabel, { color: colors.textSecondary }]}>
                    {point.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.confidenceStats}>
            <Text style={[styles.confidenceCurrent, { color: colors.success }]}>
              {job.confidence}%
            </Text>
            <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>
              Current Confidence Score
            </Text>
          </View>
        </Card>

        {/* Classes */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Classes</Text>
          <View style={styles.classesContainer}>
            {job.classes.map((cls, index) => (
              <Badge key={index} label={cls} variant="default" />
            ))}
          </View>
        </Card>

        {/* Quality Settings */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Quality Settings</Text>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>
              Consensus Required
            </Text>
            <Text style={[styles.settingValue, { color: colors.text }]}>
              {job.qualitySettings.consensusRequired} labelers
            </Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>
              ELO Threshold
            </Text>
            <Text style={[styles.settingValue, { color: colors.text }]}>
              {job.qualitySettings.eloThreshold}
            </Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>
              Gold Check Frequency
            </Text>
            <Text style={[styles.settingValue, { color: colors.text }]}>
              {job.qualitySettings.goldCheckFrequency}%
            </Text>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title={job.status === 'active' ? 'Pause Job' : 'Resume Job'}
            variant="outline"
          />
          <Button title="Edit Job" variant="secondary" />
        </View>
      </ScrollView>
    </View>
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
  scrollContent: {
    padding: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: FontSizes.sm,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  chartContainer: {
    marginTop: Spacing.md,
    height: 150,
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  barContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: BorderRadius.sm,
    minHeight: 20,
  },
  barLabel: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
  },
  lineChartContainer: {
    height: 120,
    marginTop: Spacing.md,
  },
  lineChart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  pointContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  point: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
  },
  pointLabel: {
    fontSize: FontSizes.xs,
  },
  confidenceStats: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  confidenceCurrent: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
  },
  confidenceLabel: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
  classesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  settingLabel: {
    fontSize: FontSizes.md,
  },
  settingValue: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
});
