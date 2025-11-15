import React from 'react';
import { View, Text, StyleSheet, Dimensions, LinearGradient } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Home() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={[styles.glowCircle, { backgroundColor: `${colors.tint}15` }]} />
          <Text style={[styles.logo, { color: colors.tint }]}>Labely</Text>
          <Text style={[styles.tagline, { color: colors.text }]}>
            AI Training Data,{'\n'}Gamified
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Label data. Earn rewards. Build the future.
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.tint }]}>1M+</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Labels</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.tint }]}>10K+</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Labelers</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.tint }]}>98%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Accuracy</Text>
          </View>
        </View>

        {/* Action Cards */}
        <View style={styles.actions}>
          <View style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.tint}15` }]}>
              <Ionicons name="flash" size={28} color={colors.tint} />
            </View>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Start Labeling</Text>
            <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>
              Swipe, label, earn
            </Text>
            <Button
              title="Label Now"
              onPress={() => router.push('/labeler')}
              style={styles.actionButton}
            />
          </View>

          <View style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.warning}15` }]}>
              <Ionicons name="trophy" size={28} color={colors.warning} />
            </View>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Leaderboard</Text>
            <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>
              Compete globally
            </Text>
            <Button
              title="View Ranks"
              variant="outline"
              onPress={() => router.push('/leaderboard')}
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Bottom CTA */}
        <View style={[styles.ctaCard, { backgroundColor: colors.tint }]}>
          <Ionicons name="briefcase" size={24} color="#fff" />
          <View style={styles.ctaText}>
            <Text style={styles.ctaTitle}>Need Data Labeled?</Text>
            <Text style={styles.ctaDesc}>Create jobs, set quality standards</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  hero: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: 0,
    opacity: 0.5,
  },
  logo: {
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: Spacing.md,
  },
  tagline: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    textAlign: 'center',
    opacity: 0.8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: Spacing.xxl,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 40,
    opacity: 0.3,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  actionCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  actionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  actionDesc: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  actionButton: {
    width: '100%',
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: 16,
    gap: Spacing.md,
  },
  ctaText: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  ctaDesc: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
  },
});
