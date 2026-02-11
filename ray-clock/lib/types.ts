// User document type
export interface User {
  $id: string;
  email: string;
  name: string;
  preferences: {
    defaultTime: number; // minutes
    accentColor: string;
    theme: 'light' | 'dark' | 'auto';
    smartTimeDetection: boolean;
    pieTimerEnabled: boolean;
  };
  $createdAt: string;
  $updatedAt: string;
}

// Task document type
export interface Task {
  $id: string;
  userId: string;
  title: string;
  plannedDuration: number; // minutes
  actualDuration: number; // minutes
  emoji: string;
  completed: boolean;
  completedAt?: string;
  order: number;
  $createdAt: string;
  $updatedAt: string;
}

// Preset (Saver) document type
export interface Preset {
  $id: string;
  userId: string;
  name: string;
  emoji: string;
  tasks: Array<{
    title: string;
    plannedDuration: number;
    emoji: string;
  }>;
  totalTime: number; // minutes
  $createdAt: string;
  $updatedAt: string;
}

// Settings document type
export interface Settings {
  $id: string;
  userId: string;
  defaultTime: number;
  accentColor: string;
  theme: 'light' | 'dark' | 'auto';
  smartTimeDetection: boolean;
  pieTimerEnabled: boolean;
  $createdAt: string;
  $updatedAt: string;
}
