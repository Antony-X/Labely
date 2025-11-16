/**
 * Labely App Type Definitions
 */

export type TaskType = 'binary' | 'multi-class' | 'bounding-box' | 'segmentation' | 'object-detection';

export type JobStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface Job {
  id: string;
  title: string;
  taskType: TaskType;
  status: JobStatus;
  progress: number; // 0-100
  confidence: number; // 0-100
  totalItems: number;
  completedItems: number;
  budget: number;
  rewardPerItem: number;
  classes: string[];
  qualitySettings: QualitySettings;
  createdAt: string;
  updatedAt: string;
}

export interface QualitySettings {
  consensusRequired: number; // Number of labelers needed
  eloThreshold: number;
  goldCheckFrequency: number; // Percentage (0-100)
}

export interface Task {
  id: string;
  jobId: string;
  taskType: TaskType;
  imageUrl: string;
  classes: string[];
  isGoldStandard?: boolean;
  correctAnswer?: string | string[]; // For gold standard items
}

export interface LabelingSession {
  tasksCompleted: number;
  correctAnswers: number;
  streak: number;
  eloChange: number;
  totalEarned: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'requester' | 'labeler' | 'both';
  walletBalance: number;
  elo?: number;
  totalTasksCompleted?: number;
  accuracy?: number;
  currentStreak?: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  class: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}
