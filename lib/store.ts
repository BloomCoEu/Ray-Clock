import { create } from 'zustand';
import type { AppState, Task, Preset, Settings, User } from './types';

export const useAppStore = create<AppState>((set) => ({
  user: null,
  tasks: [],
  completedTasks: [],
  currentTaskIndex: 0,
  timerIsRunning: false,
  elapsedTime: 0,
  presets: [],
  settings: null,
  isSyncing: false,
  lastSyncError: null,

  setUser: (user) => set({ user }),
  
  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.$id === taskId ? { ...task, ...updates } : task
    ),
  })),
  
  removeTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter((task) => task.$id !== taskId),
  })),
  
  setCompletedTasks: (tasks) => set({ completedTasks: tasks }),
  
  setCurrentTaskIndex: (index) => set({ currentTaskIndex: index }),
  
  setTimerIsRunning: (isRunning) => set({ timerIsRunning: isRunning }),
  
  setElapsedTime: (time) => set({ elapsedTime: time }),
  
  setPresets: (presets) => set({ presets }),
  
  setSettings: (settings) => set({ settings }),
  
  setIsSyncing: (isSyncing) => set({ isSyncing }),
  
  setLastSyncError: (error) => set({ lastSyncError: error }),
}));
