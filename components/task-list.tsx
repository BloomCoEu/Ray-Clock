import { FlatList } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
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
      <YStack paddingVertical="$10" alignItems="center">
        <Text fontSize="$4" color="$gray10">No more tasks</Text>
      </YStack>
    );
  }

  return (
    <FlatList
      data={upcomingTasks}
      renderItem={({ item, index }) => (
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingVertical="$3"
          paddingHorizontal="$3"
          marginHorizontal="$3"
          marginBottom="$2"
          backgroundColor="$gray2"
          borderLeftWidth={4}
          borderLeftColor={accentColor}
          borderRadius="$3"
        >
          <XStack alignItems="center" flex={1} gap="$3">
            <Text fontSize={28}>{item.emoji || '📝'}</Text>
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="500" marginBottom="$1" numberOfLines={1}>
                {item.title}
              </Text>
              <Text fontSize="$2" color="$gray10">
                {formatDuration(item.plannedDuration)}
              </Text>
            </YStack>
          </XStack>
          
          {(onEditTask || onDeleteTask) && (
            <XStack gap="$2">
              {onEditTask && (
                <Button
                  size="$2"
                  padding="$2"
                  backgroundColor="transparent"
                  onPress={() => onEditTask(item)}
                  icon={<Ionicons name="create-outline" size={20} color="#666" />}
                />
              )}
              {onDeleteTask && (
                <Button
                  size="$2"
                  padding="$2"
                  backgroundColor="transparent"
                  onPress={() => onDeleteTask(item.$id)}
                  icon={<Ionicons name="trash-outline" size={20} color="#ef4444" />}
                />
              )}
            </XStack>
          )}
        </XStack>
      )}
      keyExtractor={(item) => item.$id}
      scrollEnabled={false}
    />
  );
}
