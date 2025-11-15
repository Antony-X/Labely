import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

export default function Landing() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={[styles.logo, { color: colors.tint }]}>Labely</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Gamified Data Labeling Platform
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Get high-quality labeled data or earn money by labeling tasks
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Card variant="secondary">
            <View style={styles.featureIcon}>
              <Ionicons name="briefcase-outline" size={32} color={colors.tint} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              For Requesters
            </Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Create labeling jobs, set quality standards, and get accurate results with confidence scores
            </Text>
            <Button
              title="Create a Job"
              variant="outline"
              onPress={() => router.push('/requester')}
              style={{ marginTop: Spacing.md }}
            />
          </Card>

          <Card variant="secondary">
            <View style={styles.featureIcon}>
              <Ionicons name="game-controller-outline" size={32} color={colors.tint} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              For Labelers
            </Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Earn money while having fun. Build your ELO rating, maintain streaks, and get rewarded for accuracy
            </Text>
            <Button
              title="Start Labeling"
              variant="outline"
              onPress={() => router.push('/labeler')}
              style={{ marginTop: Spacing.md }}
            />
          </Card>
        </View>

        {/* Benefits */}
        <View style={styles.benefits}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Why Labely?
          </Text>

          <View style={styles.benefitRow}>
            <View style={[styles.benefitIcon, { backgroundColor: `${colors.success}20` }]}>
              <Ionicons name="shield-checkmark" size={24} color={colors.success} />
            </View>
            <View style={styles.benefitText}>
              <Text style={[styles.benefitTitle, { color: colors.text }]}>
                Quality Assured
              </Text>
              <Text style={[styles.benefitDescription, { color: colors.textSecondary }]}>
                Consensus voting and gold standard checks ensure high-quality labels
              </Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <View style={[styles.benefitIcon, { backgroundColor: `${colors.warning}20` }]}>
              <Ionicons name="trophy" size={24} color={colors.warning} />
            </View>
            <View style={styles.benefitText}>
              <Text style={[styles.benefitTitle, { color: colors.text }]}>
                Gamified Experience
              </Text>
              <Text style={[styles.benefitDescription, { color: colors.textSecondary }]}>
                ELO ratings, streaks, and achievements make labeling engaging
              </Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <View style={[styles.benefitIcon, { backgroundColor: `${colors.tint}20` }]}>
              <Ionicons name="speedometer" size={24} color={colors.tint} />
            </View>
            <View style={styles.benefitText}>
              <Text style={[styles.benefitTitle, { color: colors.text }]}>
                Fast & Efficient
              </Text>
              <Text style={[styles.benefitDescription, { color: colors.textSecondary }]}>
                Mobile-first design for quick labeling on any device
              </Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.cta}>
          <Button
            title="Get Started"
            size="large"
            onPress={() => router.push('/profile')}
          />
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
    padding: Spacing.lg,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    maxWidth: 300,
  },
  features: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  featureTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  featureDescription: {
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  benefits: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
  },
  benefitRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  benefitDescription: {
    fontSize: FontSizes.md,
    lineHeight: 20,
  },
  cta: {
    alignItems: 'center',
  },
});
