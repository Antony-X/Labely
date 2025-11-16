import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { mockUserProfile } from '@/data/mockData';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const user = mockUserProfile;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Avatar */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
            <Text style={styles.avatarText}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user.email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: `${colors.tint}20` }]}>
            <Text style={[styles.roleText, { color: colors.tint }]}>
              {user.role === 'both' ? 'Requester & Labeler' : user.role}
            </Text>
          </View>
        </View>

        {/* Wallet Card */}
        <View style={styles.content}>
          <View style={[styles.walletCard, { backgroundColor: colors.tint }]}>
            <View style={styles.walletTop}>
              <Ionicons name="wallet" size={24} color="rgba(255,255,255,0.8)" />
              <Text style={styles.walletLabel}>Balance</Text>
            </View>
            <Text style={styles.walletAmount}>${user.walletBalance.toFixed(2)}</Text>
            <View style={styles.walletActions}>
              <Pressable style={[styles.walletButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name="arrow-down" size={18} color="#fff" />
                <Text style={styles.walletButtonText}>Withdraw</Text>
              </Pressable>
              <Pressable style={[styles.walletButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name="arrow-up" size={18} color="#fff" />
                <Text style={styles.walletButtonText}>Add Funds</Text>
              </Pressable>
            </View>
          </View>

          {/* Stats Grid */}
          {user.elo && (
            <View style={styles.statsContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance</Text>
              <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name="trophy" size={32} color={colors.gold} />
                  <Text style={[styles.statValue, { color: colors.text }]}>{user.elo}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>ELO</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name="flame" size={32} color={colors.warning} />
                  <Text style={[styles.statValue, { color: colors.text }]}>{user.currentStreak}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Streak</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name="checkmark-circle" size={32} color={colors.success} />
                  <Text style={[styles.statValue, { color: colors.text }]}>{user.accuracy}%</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Accuracy</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name="bar-chart" size={32} color={colors.tint} />
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {user.totalTasksCompleted?.toLocaleString()}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tasks</Text>
                </View>
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>

            <Pressable style={[styles.actionRow, { backgroundColor: colors.surface }]}>
              <View style={[styles.actionIcon, { backgroundColor: `${colors.tint}15` }]}>
                <Ionicons name="person-outline" size={22} color={colors.tint} />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.icon} />
            </Pressable>

            <Pressable style={[styles.actionRow, { backgroundColor: colors.surface }]}>
              <View style={[styles.actionIcon, { backgroundColor: `${colors.warning}15` }]}>
                <Ionicons name="trophy-outline" size={22} color={colors.warning} />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>Achievements</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.icon} />
            </Pressable>

            <Pressable style={[styles.actionRow, { backgroundColor: colors.surface }]}>
              <View style={[styles.actionIcon, { backgroundColor: `${colors.success}15` }]}>
                <Ionicons name="notifications-outline" size={22} color={colors.success} />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.icon} />
            </Pressable>

            <Pressable style={[styles.actionRow, { backgroundColor: colors.surface }]}>
              <View style={[styles.actionIcon, { backgroundColor: `${colors.icon}15` }]}>
                <Ionicons name="settings-outline" size={22} color={colors.icon} />
              </View>
              <Text style={[styles.actionText, { color: colors.text }]}>Settings</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.icon} />
            </Pressable>
          </View>

          {/* Sign Out */}
          <Button
            title="Sign Out"
            variant="outline"
            style={{ marginTop: Spacing.xl }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
  },
  name: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.md,
  },
  roleBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  roleText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  walletCard: {
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  walletTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  walletLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  walletAmount: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    marginBottom: Spacing.lg,
  },
  walletActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  walletButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  walletButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#fff',
  },
  statsContainer: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  actionsContainer: {
    marginBottom: Spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  actionText: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
