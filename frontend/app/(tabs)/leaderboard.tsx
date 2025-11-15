import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';
import { mockUserProfile } from '@/data/mockData';

const topLabelers = [
  { id: '1', name: 'Sarah Chen', elo: 2450, tasksCompleted: 15420, accuracy: 98.5, rank: 1 },
  { id: '2', name: 'Mike Johnson', elo: 2380, tasksCompleted: 14200, accuracy: 97.8, rank: 2 },
  { id: '3', name: 'Emma Davis', elo: 2320, tasksCompleted: 13890, accuracy: 97.2, rank: 3 },
  { id: '4', name: 'Alex Kim', elo: 2180, tasksCompleted: 11200, accuracy: 96.5, rank: 4 },
  { id: '5', name: 'Chris Wilson', elo: 2050, tasksCompleted: 10500, accuracy: 96.1, rank: 5 },
  { id: '6', name: 'Maria Garcia', elo: 1920, tasksCompleted: 9800, accuracy: 95.8, rank: 6 },
  { id: '7', name: mockUserProfile.name, elo: mockUserProfile.elo || 1850, tasksCompleted: mockUserProfile.totalTasksCompleted || 3420, accuracy: mockUserProfile.accuracy || 94.5, rank: 7 },
  { id: '8', name: 'David Lee', elo: 1780, tasksCompleted: 8200, accuracy: 94.2, rank: 8 },
];

export default function Leaderboard() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return { icon: 'trophy', color: '#FFD700' };
    if (rank === 2) return { icon: 'medal', color: '#C0C0C0' };
    if (rank === 3) return { icon: 'medal', color: '#CD7F32' };
    return { icon: 'ribbon', color: colors.icon };
  };

  const isCurrentUser = (id: string) => id === '7';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="trophy" size={28} color={colors.tint} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Leaderboard</Text>
      </View>

      {/* Top 3 Podium */}
      <View style={styles.podiumContainer}>
        {/* 2nd Place */}
        <View style={styles.podiumItem}>
          <View style={[styles.avatar, styles.avatarSmall, { backgroundColor: '#C0C0C0' }]}>
            <Text style={styles.avatarText}>
              {topLabelers[1].name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Ionicons name="medal" size={24} color="#C0C0C0" style={styles.medalIcon} />
          <Text style={[styles.podiumName, { color: colors.text }]}>{topLabelers[1].name}</Text>
          <Text style={[styles.podiumElo, { color: colors.tint }]}>{topLabelers[1].elo}</Text>
          <View style={[styles.podiumBase, styles.podiumSecond, { backgroundColor: colors.surfaceSecondary }]}>
            <Text style={[styles.podiumRank, { color: colors.textSecondary }]}>2</Text>
          </View>
        </View>

        {/* 1st Place */}
        <View style={[styles.podiumItem, styles.podiumFirst]}>
          <View style={[styles.avatar, styles.avatarLarge, { backgroundColor: '#FFD700' }]}>
            <Text style={[styles.avatarText, styles.avatarTextLarge]}>
              {topLabelers[0].name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Ionicons name="trophy" size={32} color="#FFD700" style={styles.medalIcon} />
          <Text style={[styles.podiumName, styles.podiumNameLarge, { color: colors.text }]}>
            {topLabelers[0].name}
          </Text>
          <Text style={[styles.podiumElo, styles.podiumEloLarge, { color: colors.tint }]}>
            {topLabelers[0].elo}
          </Text>
          <View style={[styles.podiumBase, styles.podiumFirstBase, { backgroundColor: colors.surfaceSecondary }]}>
            <Text style={[styles.podiumRank, { color: colors.textSecondary }]}>1</Text>
          </View>
        </View>

        {/* 3rd Place */}
        <View style={styles.podiumItem}>
          <View style={[styles.avatar, styles.avatarSmall, { backgroundColor: '#CD7F32' }]}>
            <Text style={styles.avatarText}>
              {topLabelers[2].name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Ionicons name="medal" size={24} color="#CD7F32" style={styles.medalIcon} />
          <Text style={[styles.podiumName, { color: colors.text }]}>{topLabelers[2].name}</Text>
          <Text style={[styles.podiumElo, { color: colors.tint }]}>{topLabelers[2].elo}</Text>
          <View style={[styles.podiumBase, styles.podiumThird, { backgroundColor: colors.surfaceSecondary }]}>
            <Text style={[styles.podiumRank, { color: colors.textSecondary }]}>3</Text>
          </View>
        </View>
      </View>

      {/* Rankings List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {topLabelers.slice(3).map((labeler) => {
          const rankInfo = getRankIcon(labeler.rank);
          const isCurrent = isCurrentUser(labeler.id);

          return (
            <Card
              key={labeler.id}
              style={[
                styles.rankCard,
                isCurrent && { borderColor: colors.tint, borderWidth: 2 },
              ]}
            >
              <View style={styles.rankLeft}>
                <Ionicons name={rankInfo.icon as any} size={20} color={rankInfo.color} />
                <Text style={[styles.rankNumber, { color: colors.textSecondary }]}>
                  #{labeler.rank}
                </Text>
              </View>

              <View style={[styles.avatarSmallList, { backgroundColor: colors.tint }]}>
                <Text style={styles.avatarTextSmall}>
                  {labeler.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>

              <View style={styles.rankInfo}>
                <Text style={[styles.rankName, { color: colors.text }]}>
                  {labeler.name}
                  {isCurrent && ' (You)'}
                </Text>
                <View style={styles.rankStats}>
                  <Text style={[styles.rankStat, { color: colors.textSecondary }]}>
                    {labeler.tasksCompleted.toLocaleString()} tasks
                  </Text>
                  <Text style={[styles.rankStat, { color: colors.textSecondary }]}>•</Text>
                  <Text style={[styles.rankStat, { color: colors.success }]}>
                    {labeler.accuracy}% acc
                  </Text>
                </View>
              </View>

              <Badge label={`${labeler.elo}`} variant="gold" size="small" />
            </Card>
          );
        })}
      </ScrollView>
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
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
  },
  podiumFirst: {
    marginTop: -20,
  },
  avatar: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  avatarSmall: {
    width: 56,
    height: 56,
  },
  avatarLarge: {
    width: 72,
    height: 72,
  },
  avatarText: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: '#fff',
  },
  avatarTextLarge: {
    fontSize: FontSizes.xl,
  },
  medalIcon: {
    marginBottom: Spacing.xs,
  },
  podiumName: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.xs / 2,
  },
  podiumNameLarge: {
    fontSize: FontSizes.md,
  },
  podiumElo: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  podiumEloLarge: {
    fontSize: FontSizes.lg,
  },
  podiumBase: {
    width: '100%',
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
    alignItems: 'center',
    paddingTop: Spacing.sm,
  },
  podiumFirstBase: {
    height: 80,
  },
  podiumSecond: {
    height: 60,
  },
  podiumThird: {
    height: 50,
  },
  podiumRank: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
  },
  list: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    width: 60,
  },
  rankNumber: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  avatarSmallList: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTextSmall: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: '#fff',
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
  },
  rankStats: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  rankStat: {
    fontSize: FontSizes.xs,
  },
});
