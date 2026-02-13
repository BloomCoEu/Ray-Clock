// Type definitions for Ray Clock app

export interface User {
  $id: string;
  email: string;
  name: string;
}

export interface Task {
  $id: string;
  userId: string;
  title: string;
  emoji?: string;
  plannedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  completed: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PresetTask {
  title: string;
  plannedDuration: number;
  emoji?: string;
}

export interface Preset {
  $id: string;
  userId: string;
  name: string;
  emoji?: string;
  tasks: PresetTask[];
  totalTime: number; // in minutes
  createdAt?: string;
  updatedAt?: string;
}

export interface Settings {
  $id?: string;
  userId: string;
  defaultTime: number; // in minutes
  accentColor: string;
  theme: 'auto' | 'light' | 'dark';
  smartTimeDetection: boolean;
  pieTimerEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CalendarEvent {
  uid: string;
  title: string;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  description?: string;
  location?: string;
  calendarName?: string;
}

export interface Reminder {
  uid: string;
  title: string;
  dueDate?: string; // ISO 8601
  completed: boolean;
  priority?: number;
  notes?: string;
  calendarName?: string;
}

export interface AppleCalendarConfig {
  appleId: string;
  isConnected: boolean;
}

export interface AppState {
  user: User | null;
  tasks: Task[];
  completedTasks: Task[];
  currentTaskIndex: number;
  timerIsRunning: boolean;
  elapsedTime: number; // in seconds
  presets: Preset[];
  settings: Settings | null;
  calendarEvents: CalendarEvent[];
  reminders: Reminder[];
  appleCalendarConfig: AppleCalendarConfig | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  setCompletedTasks: (tasks: Task[]) => void;
  setCurrentTaskIndex: (index: number) => void;
  setTimerIsRunning: (isRunning: boolean) => void;
  setElapsedTime: (time: number) => void;
  setPresets: (presets: Preset[]) => void;
  setSettings: (settings: Settings) => void;
  setCalendarEvents: (events: CalendarEvent[]) => void;
  setReminders: (reminders: Reminder[]) => void;
  setAppleCalendarConfig: (config: AppleCalendarConfig | null) => void;
}
