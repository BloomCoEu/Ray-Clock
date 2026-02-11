import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  currentTaskIndex: number;
  onTaskPress?: (index: number) => void;
  onTaskLongPress?: (taskId: string) => void;
  accentColor: string;
}

export const TaskList = ({
  tasks,
  currentTaskIndex,
  onTaskPress,
  onTaskLongPress,
  accentColor,
}: TaskListProps) => {
  const remainingTasks = tasks.slice(currentTaskIndex + 1);

  return (
    <View style={styles.container}>
      <FlatList
        data={remainingTasks}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.taskItem,
              {
                borderLeftColor: accentColor,
              },
            ]}
            onPress={() => onTaskPress?.(currentTaskIndex + 1 + index)}
            onLongPress={() => onTaskLongPress?.(item.$id)}
          >
            <Text style={styles.emoji}>{item.emoji || '📝'}</Text>
            <View style={styles.taskContent}>
              <Text
                style={[
                  styles.taskTitle,
                  item.completed && styles.completedTask,
                ]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={styles.duration}>
                {item.plannedDuration}m
              </Text>
            </View>
          </TouchableOpacity>
        )}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        keyExtractor={(item) => item.$id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No more tasks</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
    marginBottom: 8,
    marginHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
