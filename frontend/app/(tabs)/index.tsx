import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={[]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section with Gradient */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={[styles.logo, { color: colors.purple }]}>Labely</Text>
          <Text style={[styles.tagline, { color: colors.text }]}>
            AI Training Data,{'\n'}Gamified
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Label data. Earn rewards. Build the future.
          </Text>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statNumber, { color: colors.purple }]}>1M+</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Labels</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statNumber, { color: colors.pink }]}>10K+</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Labelers</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statNumber, { color: colors.purple }]}>98%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Accuracy</Text>
          </View>
        </View>

        {/* Action Cards */}
        <View style={styles.content}>
          <LinearGradient
            colors={[colors.purple, colors.pink]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainCard}
          >
            <Ionicons name="flash" size={48} color="#fff" />
            <Text style={styles.mainCardTitle}>Start Labeling</Text>
            <Text style={styles.mainCardDesc}>Swipe, label, earn rewards instantly</Text>
            <Button
              title="Label Now"
              onPress={() => router.push('/labeler')}
              variant="outline"
              style={styles.mainCardButton}
            />
          </LinearGradient>

          <View style={styles.row}>
            <View style={[styles.smallCard, { backgroundColor: colors.surfaceSecondary }]}>
              <Ionicons name="trophy" size={32} color={colors.purple} />
              <Text style={[styles.smallCardTitle, { color: colors.text }]}>Leaderboard</Text>
              <Button
                title="View Ranks"
                variant="outline"
                size="small"
                onPress={() => router.push('/leaderboard')}
                style={{ marginTop: Spacing.sm }}
              />
            </View>

            <View style={[styles.smallCard, { backgroundColor: colors.surfaceSecondary }]}>
              <Ionicons name="briefcase" size={32} color={colors.pink} />
              <Text style={[styles.smallCardTitle, { color: colors.text }]}>My Jobs</Text>
              <Button
                title="View Jobs"
                variant="outline"
                size="small"
                onPress={() => router.push('/requester')}
                style={{ marginTop: Spacing.sm }}
              />
            </View>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>How It Works</Text>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.gradientStart }]}>
                <Ionicons name="images" size={24} color={colors.purple} />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>Label Images</Text>
                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                  Binary, multi-class, bounding boxes, and segmentation
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.gradientEnd }]}>
                <Ionicons name="trending-up" size={24} color={colors.pink} />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>Build Your ELO</Text>
                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                  Increase accuracy, maintain streaks, climb the ranks
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.gradientStart }]}>
                <Ionicons name="wallet" size={24} color={colors.purple} />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>Earn Money</Text>
                <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                  Get paid instantly for each accurate label
                </Text>
              </View>
            </View>
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
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
    paddingHorizontal: Spacing.lg,
  },
  logo: {
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -3,
    marginBottom: Spacing.md,
  },
  tagline: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  mainCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl * 1.5,
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  mainCardTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: '#fff',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  mainCardDesc: {
    fontSize: FontSizes.md,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  mainCardButton: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    paddingHorizontal: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  smallCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  smallCardTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  features: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    marginBottom: Spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  featureDesc: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
});
