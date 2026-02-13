import { KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/hooks/use-auth';
import { useTimer } from '@/hooks/use-timer';
import { useTaskCompletion } from '@/hooks/use-task-completion';
import { taskService } from '@/lib/appwrite-service';
import { TimerDisplay } from '@/components/timer-display';
import { TimerControls } from '@/components/timer-controls';
import { TaskList } from '@/components/task-list';
import { TaskModal } from '@/components/task-modal';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const user = useAppStore((state) => state.user);
  const tasks = useAppStore((state) => state.tasks);
  const currentTaskIndex = useAppStore((state) => state.currentTaskIndex);
  const timerIsRunning = useAppStore((state) => state.timerIsRunning);
  const elapsedTime = useAppStore((state) => state.elapsedTime);
  const settings = useAppStore((state) => state.settings);
  
  const setTasks = useAppStore((state) => state.setTasks);
  const setTimerIsRunning = useAppStore((state) => state.setTimerIsRunning);
  const setElapsedTime = useAppStore((state) => state.setElapsedTime);
  const setCurrentTaskIndex = useAppStore((state) => state.setCurrentTaskIndex);
  const addTask = useAppStore((state) => state.addTask);
  const updateTask = useAppStore((state) => state.updateTask);
  const removeTask = useAppStore((state) => state.removeTask);
  
  const { isLoading: authLoading } = useAuth();
  const [taskLoading, setTaskLoading] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  // Use timer hook for countdown functionality
  useTimer();
  
  // Use task completion hook to handle task completion
  useTaskCompletion();

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      setTaskLoading(true);
      if (!user) return;
      const loadedTasks = await taskService.getTasks(user.$id);
      setTasks(loadedTasks.documents || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setTaskLoading(false);
    }
  };

  const handleAddTask = async (taskData: any) => {
    try {
      if (!user) return;
      
      const newTask = await taskService.createTask(user.$id, {
        ...taskData,
        order: tasks.length,
        userId: user.$id,
      });

      addTask(newTask as any);
      setShowTaskModal(false);
      Alert.alert('Success', 'Task created');
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const handleEditTask = async (taskData: any) => {
    try {
      if (!user || !editingTask) return;

      await taskService.updateTask(editingTask.$id, taskData);
      updateTask(editingTask.$id, taskData);
      setShowTaskModal(false);
      setEditingTask(null);
      Alert.alert('Success', 'Task updated');
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await taskService.deleteTask(taskId);
              removeTask(taskId);
              Alert.alert('Success', 'Task deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (authLoading || taskLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text fontSize="$4" color="$gray10">Loading...</Text>
      </YStack>
    );
  }

  if (!user) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text fontSize="$4" color="$gray11">Please log in to continue</Text>
      </YStack>
    );
  }

  const currentTask = tasks[currentTaskIndex];
  const accentColor = settings?.accentColor || '#10B981';

  const handlePlayPause = () => {
    setTimerIsRunning(!timerIsRunning);
  };

  const handleAdjustTime = (delta: number) => {
    // delta in seconds
    const newTime = Math.max(0, elapsedTime + delta);
    setElapsedTime(newTime);
  };

  const handleSkipTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setElapsedTime(0);
      setTimerIsRunning(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ flex: 1 }}>
        {currentTask ? (
          <>
            <TimerDisplay
              time={elapsedTime}
              taskName={currentTask.title}
              taskEmoji={currentTask.emoji || '📝'}
              isRunning={timerIsRunning}
              accentColor={accentColor}
            />

            <TimerControls
              isRunning={timerIsRunning}
              onPlayPause={handlePlayPause}
              onAdjustTime={handleAdjustTime}
              onSkip={handleSkipTask}
              accentColor={accentColor}
            />

            <YStack paddingBottom="$8">
              <XStack
                justifyContent="space-between"
                alignItems="center"
                marginHorizontal="$3"
                marginTop="$5"
                marginBottom="$2"
              >
                <Text fontSize="$5" fontWeight="600">Remaining Tasks</Text>
                <Button
                  circular
                  size="$3"
                  backgroundColor={accentColor}
                  onPress={() => {
                    setEditingTask(null);
                    setShowTaskModal(true);
                  }}
                  icon={<Ionicons name="add" size={20} color="white" />}
                />
              </XStack>
              <TaskList
                tasks={tasks}
                currentTaskIndex={currentTaskIndex}
                accentColor={accentColor}
              />
            </YStack>
          </>
        ) : (
          <YStack flex={1} justifyContent="center" alignItems="center" paddingVertical="$15">
            <Text fontSize={32} marginBottom="$2">🎉 No tasks yet!</Text>
            <Text fontSize="$4" color="$gray10" marginBottom="$6">Create a task to get started</Text>
            <Button
              size="$4"
              backgroundColor={accentColor}
              onPress={() => {
                setEditingTask(null);
                setShowTaskModal(true);
              }}
              icon={<Ionicons name="add" size={24} color="white" />}
            >
              <Text color="white" fontWeight="600">Create First Task</Text>
            </Button>
          </YStack>
        )}
      </ScrollView>

      <TaskModal
        visible={showTaskModal}
        task={editingTask}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        onSave={editingTask ? handleEditTask : handleAddTask}
        accentColor={accentColor}
      />
    </KeyboardAvoidingView>
  );
}
