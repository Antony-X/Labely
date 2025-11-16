/**
 * Mock Data for Labely App
 */

import { Job, Task, UserProfile, ChartDataPoint } from '@/types';

export const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  role: 'both',
  walletBalance: 245.50,
  elo: 1850,
  totalTasksCompleted: 3420,
  accuracy: 94.5,
  currentStreak: 12,
};

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Cat vs Dog Classification',
    taskType: 'binary',
    status: 'active',
    progress: 67,
    confidence: 92,
    totalItems: 1000,
    completedItems: 670,
    budget: 500,
    rewardPerItem: 0.05,
    classes: ['Cat', 'Dog'],
    qualitySettings: {
      consensusRequired: 3,
      eloThreshold: 1500,
      goldCheckFrequency: 10,
    },
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2025-11-15T08:30:00Z',
  },
  {
    id: '2',
    title: 'Product Category Tagging',
    taskType: 'multi',
    status: 'active',
    progress: 42,
    confidence: 88,
    totalItems: 2500,
    completedItems: 1050,
    budget: 1250,
    rewardPerItem: 0.08,
    classes: ['Electronics', 'Clothing', 'Food', 'Books', 'Toys', 'Other'],
    qualitySettings: {
      consensusRequired: 2,
      eloThreshold: 1600,
      goldCheckFrequency: 15,
    },
    createdAt: '2025-11-08T14:20:00Z',
    updatedAt: '2025-11-15T09:15:00Z',
  },
  {
    id: '3',
    title: 'Vehicle Detection',
    taskType: 'object-detection',
    status: 'paused',
    progress: 23,
    confidence: 85,
    totalItems: 800,
    completedItems: 184,
    budget: 2400,
    rewardPerItem: 0.25,
    classes: ['Car', 'Truck', 'Motorcycle', 'Bus'],
    qualitySettings: {
      consensusRequired: 3,
      eloThreshold: 1700,
      goldCheckFrequency: 20,
    },
    createdAt: '2025-11-12T09:00:00Z',
    updatedAt: '2025-11-14T16:45:00Z',
  },
  {
    id: '4',
    title: 'Sentiment Analysis',
    taskType: 'binary',
    status: 'completed',
    progress: 100,
    confidence: 95,
    totalItems: 500,
    completedItems: 500,
    budget: 250,
    rewardPerItem: 0.04,
    classes: ['Positive', 'Negative'],
    qualitySettings: {
      consensusRequired: 3,
      eloThreshold: 1400,
      goldCheckFrequency: 12,
    },
    createdAt: '2025-11-01T08:00:00Z',
    updatedAt: '2025-11-09T17:30:00Z',
  },
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    jobId: '1',
    taskType: 'binary',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    classes: ['Cat', 'Dog'],
  },
  {
    id: 't2',
    jobId: '1',
    taskType: 'binary',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    classes: ['Cat', 'Dog'],
    isGoldStandard: true,
    correctAnswer: 'Dog',
  },
  {
    id: 't3',
    jobId: '2',
    taskType: 'multi',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    classes: ['Electronics', 'Clothing', 'Food', 'Books', 'Toys', 'Other'],
  },
  {
    id: 't4',
    jobId: '3',
    taskType: 'object-detection',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    classes: ['Car', 'Truck', 'Motorcycle', 'Bus'],
  },
  {
    id: 't5',
    jobId: '1',
    taskType: 'binary',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    classes: ['Cat', 'Dog'],
  },
];

export const mockProgressData: ChartDataPoint[] = [
  { label: 'Mon', value: 45 },
  { label: 'Tue', value: 52 },
  { label: 'Wed', value: 61 },
  { label: 'Thu', value: 58 },
  { label: 'Fri', value: 67 },
  { label: 'Sat', value: 65 },
  { label: 'Sun', value: 67 },
];

export const mockConfidenceData: ChartDataPoint[] = [
  { label: 'Day 1', value: 75 },
  { label: 'Day 2', value: 78 },
  { label: 'Day 3', value: 82 },
  { label: 'Day 4', value: 85 },
  { label: 'Day 5', value: 88 },
  { label: 'Day 6', value: 90 },
  { label: 'Day 7', value: 92 },
];
