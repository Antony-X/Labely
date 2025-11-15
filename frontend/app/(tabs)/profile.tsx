import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockUserProfile } from '@/data/mockData';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const user = mockUserProfile;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <Card>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
              <Text style={styles.avatarText}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
              <Text style={[styles.email, { color: colors.textSecondary }]}>{user.email}</Text>
              <Badge
                label={user.role === 'both' ? 'Requester & Labeler' : user.role}
                variant="default"
                size="small"
              />
            </View>
          </View>
        </Card>

        {/* Wallet */}
        <Card>
          <View style={styles.walletHeader}>
            <Ionicons name="wallet-outline" size={24} color={colors.icon} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Wallet Balance</Text>
          </View>
          <Text style={[styles.balance, { color: colors.success }]}>
            ${user.walletBalance.toFixed(2)}
          </Text>
          <View style={styles.walletActions}>
            <Button title="Withdraw" variant="outline" style={{ flex: 1 }} />
            <Button title="Add Funds" style={{ flex: 1 }} />
          </View>
        </Card>

        {/* Labeler Stats */}
        {user.elo && (
          <Card>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Labeler Stats</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: `${colors.gold}20` }]}>
                  <Ionicons name="trophy" size={24} color={colors.gold} />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>{user.elo}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>ELO Rating</Text>
              </View>

              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: `${colors.tint}20` }]}>
                  <Ionicons name="checkmark-done" size={24} color={colors.tint} />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {user.totalTasksCompleted?.toLocaleString()}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tasks Done</Text>
              </View>

              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: `${colors.success}20` }]}>
                  <Ionicons name="analytics" size={24} color={colors.success} />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {user.accuracy}%
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Accuracy</Text>
              </View>

              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: `${colors.warning}20` }]}>
                  <Ionicons name="flame" size={24} color={colors.warning} />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {user.currentStreak}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Streak</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Achievements */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Recent Achievements</Text>
          <View style={styles.achievements}>
            <View style={styles.achievement}>
              <View style={[styles.achievementIcon, { backgroundColor: `${colors.gold}20` }]}>
                <Ionicons name="star" size={20} color={colors.gold} />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementTitle, { color: colors.text }]}>
                  Century Club
                </Text>
                <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
                  Completed 100 tasks
                </Text>
              </View>
            </View>

            <View style={styles.achievement}>
              <View style={[styles.achievementIcon, { backgroundColor: `${colors.warning}20` }]}>
                <Ionicons name="flame" size={20} color={colors.warning} />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementTitle, { color: colors.text }]}>
                  On Fire
                </Text>
                <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
                  10-day streak
                </Text>
              </View>
            </View>

            <View style={styles.achievement}>
              <View style={[styles.achievementIcon, { backgroundColor: `${colors.success}20` }]}>
                <Ionicons name="shield-checkmark" size={20} color={colors.success} />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementTitle, { color: colors.text }]}>
                  Perfectionist
                </Text>
                <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
                  95%+ accuracy
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Settings</Text>
          <Pressable style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="person-outline" size={20} color={colors.icon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </Pressable>

          <Pressable style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.icon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </Pressable>

          <Pressable style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={20} color={colors.icon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Badge label={colorScheme === 'dark' ? 'On' : 'Off'} size="small" />
          </Pressable>

          <Pressable style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle-outline" size={20} color={colors.icon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </Pressable>
        </Card>

        <Button title="Sign Out" variant="outline" />
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
  profileHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  name: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  email: {
    fontSize: FontSizes.md,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  balance: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  walletActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: FontSizes.sm,
  },
  achievements: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  achievement: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
  },
  achievementDescription: {
    fontSize: FontSizes.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingLabel: {
    fontSize: FontSizes.md,
  },
});
