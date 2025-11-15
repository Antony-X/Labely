import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TaskType } from '@/types';
import { Ionicons } from '@expo/vector-icons';

export default function CreateJob() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [taskType, setTaskType] = useState<TaskType>('binary');
  const [title, setTitle] = useState('');
  const [classes, setClasses] = useState<string[]>(['', '']);
  const [budget, setBudget] = useState('');
  const [consensusRequired, setConsensusRequired] = useState('3');
  const [eloThreshold, setEloThreshold] = useState('1500');
  const [goldCheckFrequency, setGoldCheckFrequency] = useState('10');

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Submit job
      router.back();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const updateClass = (index: number, value: string) => {
    const newClasses = [...classes];
    newClasses[index] = value;
    setClasses(newClasses);
  };

  const addClass = () => {
    setClasses([...classes, '']);
  };

  const removeClass = (index: number) => {
    if (classes.length > 2) {
      setClasses(classes.filter((_, i) => i !== index));
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Basic Information
            </Text>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Job Title</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Cat vs Dog Classification"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Task Type</Text>
              <View style={styles.taskTypeGrid}>
                {(['binary', 'multi', 'object-detection'] as TaskType[]).map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => setTaskType(type)}
                    style={[
                      styles.taskTypeCard,
                      { borderColor: taskType === type ? colors.tint : colors.border },
                      taskType === type && { backgroundColor: `${colors.tint}10` },
                    ]}
                  >
                    <Ionicons
                      name={
                        type === 'binary' ? 'git-branch-outline' :
                        type === 'multi' ? 'grid-outline' :
                        'scan-outline'
                      }
                      size={24}
                      color={taskType === type ? colors.tint : colors.icon}
                    />
                    <Text style={[
                      styles.taskTypeLabel,
                      { color: taskType === type ? colors.tint : colors.text }
                    ]}>
                      {type === 'binary' ? 'Binary' : type === 'multi' ? 'Multi-class' : 'Object Detection'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Classes
            </Text>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Define your classes
              </Text>
              {classes.map((cls, index) => (
                <View key={index} style={styles.classRow}>
                  <TextInput
                    style={[styles.input, styles.classInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                    value={cls}
                    onChangeText={(value) => updateClass(index, value)}
                    placeholder={`Class ${index + 1}`}
                    placeholderTextColor={colors.textSecondary}
                  />
                  {classes.length > 2 && (
                    <Pressable onPress={() => removeClass(index)}>
                      <Ionicons name="close-circle" size={24} color={colors.error} />
                    </Pressable>
                  )}
                </View>
              ))}
              <Button title="Add Class" variant="outline" onPress={addClass} />
            </View>
          </View>
        );

      case 3:
        return (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Data Upload
            </Text>
            <Card variant="secondary" style={styles.uploadCard}>
              <Ionicons name="cloud-upload-outline" size={48} color={colors.icon} />
              <Text style={[styles.uploadText, { color: colors.textSecondary }]}>
                Tap to upload images
              </Text>
              <Text style={[styles.uploadHint, { color: colors.textSecondary }]}>
                Supported formats: JPG, PNG
              </Text>
            </Card>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Budget ($)</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                value={budget}
                onChangeText={setBudget}
                placeholder="500"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 4:
        return (
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Quality Settings
            </Text>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Consensus Required
              </Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                value={consensusRequired}
                onChangeText={setConsensusRequired}
                placeholder="3"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={[styles.hint, { color: colors.textSecondary }]}>
                Number of labelers needed for each item
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                ELO Threshold
              </Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                value={eloThreshold}
                onChangeText={setEloThreshold}
                placeholder="1500"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={[styles.hint, { color: colors.textSecondary }]}>
                Minimum labeler ELO score
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Gold Check Frequency (%)
              </Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
                value={goldCheckFrequency}
                onChangeText={setGoldCheckFrequency}
                placeholder="10"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={[styles.hint, { color: colors.textSecondary }]}>
                Percentage of gold standard items
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create Job</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.stepsRow}>
          {[1, 2, 3, 4].map((s) => (
            <View key={s} style={styles.stepIndicator}>
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor: s <= step ? colors.tint : colors.surfaceSecondary,
                    borderColor: s <= step ? colors.tint : colors.border,
                  }
                ]}
              >
                {s < step ? (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                ) : (
                  <Text style={[styles.stepNumber, { color: s === step ? '#fff' : colors.textSecondary }]}>
                    {s}
                  </Text>
                )}
              </View>
              {s < 4 && (
                <View
                  style={[
                    styles.stepLine,
                    { backgroundColor: s < step ? colors.tint : colors.border }
                  ]}
                />
              )}
            </View>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderStep()}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Button
          title={step === 1 ? 'Cancel' : 'Back'}
          variant="outline"
          onPress={handleBack}
          style={{ flex: 1 }}
        />
        <Button
          title={step === totalSteps ? 'Create Job' : 'Next'}
          onPress={handleNext}
          style={{ flex: 1 }}
        />
      </View>
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
  progressContainer: {
    padding: Spacing.md,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: Spacing.xs,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
  },
  hint: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
  taskTypeGrid: {
    gap: Spacing.sm,
  },
  taskTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    gap: Spacing.md,
  },
  taskTypeLabel: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  classInput: {
    flex: 1,
  },
  uploadCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  uploadText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  uploadHint: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
    borderTopWidth: 1,
  },
});
