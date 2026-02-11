import { create } from 'zustand';
import * as types from './types';

interface AppStore {
  // User state
  user: types.User | null;
  setUser: (user: types.User | null) => void;

  // Tasks state
  tasks: types.Task[];
  setTasks: (tasks: types.Task[]) => void;
  addTask: (task: types.Task) => void;
  removeTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<types.Task>) => void;

  // Current task (active timer)
  currentTaskIndex: number;
  setCurrentTaskIndex: (index: number) => void;
  getCurrentTask: () => types.Task | undefined;

  // Presets state
  presets: types.Preset[];
  setPresets: (presets: types.Preset[]) => void;
  addPreset: (preset: types.Preset) => void;
  removePreset: (presetId: string) => void;

  // Settings state
  settings: types.Settings | null;
  setSettings: (settings: types.Settings) => void;
  updateSettings: (updates: Partial<types.Settings>) => void;

  // Timer state
  timerIsRunning: boolean;
  setTimerIsRunning: (running: boolean) => void;
  elapsedTime: number; // seconds
  setElapsedTime: (time: number) => void;

  // Completed tasks
  completedTasks: types.Task[];
  setCompletedTasks: (tasks: types.Task[]) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),

  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.$id !== taskId),
    })),
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.$id === taskId ? { ...t, ...updates } : t
      ),
    })),

  // Current task
  currentTaskIndex: 0,
  setCurrentTaskIndex: (index) => set({ currentTaskIndex: index }),
  getCurrentTask: () => {
    const { tasks, currentTaskIndex } = get();
    return tasks[currentTaskIndex];
  },

  // Presets
  presets: [],
  setPresets: (presets) => set({ presets }),
  addPreset: (preset) =>
    set((state) => ({
      presets: [...state.presets, preset],
    })),
  removePreset: (presetId) =>
    set((state) => ({
      presets: state.presets.filter((p) => p.$id !== presetId),
    })),

  // Settings
  settings: null,
  setSettings: (settings) => set({ settings }),
  updateSettings: (updates) =>
    set((state) => ({
      settings: state.settings ? { ...state.settings, ...updates } : null,
    })),

  // Timer
  timerIsRunning: false,
  setTimerIsRunning: (running) => set({ timerIsRunning: running }),
  elapsedTime: 0,
  setElapsedTime: (time) => set({ elapsedTime: time }),

  // Completed tasks
  completedTasks: [],
  setCompletedTasks: (tasks) => set({ completedTasks: tasks }),
}));
