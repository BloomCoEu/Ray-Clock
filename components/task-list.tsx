import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  currentTaskIndex: number;
  accentColor: string;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export function TaskList({ tasks, currentTaskIndex, accentColor, onEditTask, onDeleteTask }: TaskListProps) {
  const upcomingTasks = tasks.slice(currentTaskIndex + 1);

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (upcomingTasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No more tasks</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={upcomingTasks}
      renderItem={({ item, index }) => (
        <View style={[styles.taskCard, { borderLeftColor: accentColor }]}>
          <View style={styles.taskContent}>
            <Text style={styles.taskEmoji}>{item.emoji || '📝'}</Text>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.taskDuration}>
                {formatDuration(item.plannedDuration)}
              </Text>
            </View>
          </View>
          
          {(onEditTask || onDeleteTask) && (
            <View style={styles.taskActions}>
              {onEditTask && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onEditTask(item)}
                >
                  <Ionicons name="create-outline" size={20} color="#666" />
                </TouchableOpacity>
              )}
              {onDeleteTask && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onDeleteTask(item.$id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
      keyExtractor={(item) => item.$id}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
    borderLeftWidth: 4,
    borderRadius: 8,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  taskDuration: {
    fontSize: 12,
    color: '#666',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
});
