import { ScrollView, FlatList, Alert } from 'react-native';
import { useCallback, useEffect } from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useAppStore } from '@/lib/store';
import { taskService } from '@/lib/appwrite-service';
import * as types from '@/lib/types';

export default function ReportScreen() {
  const user = useAppStore((state) => state.user);
  const tasks = useAppStore((state) => state.tasks);
  const settings = useAppStore((state) => state.settings);
  const completedTasks = useAppStore((state) => state.completedTasks);
  const setCompletedTasks = useAppStore((state) => state.setCompletedTasks);

  const accentColor = settings?.accentColor || '#10B981';

  const loadCompletedTasks = useCallback(async () => {
    try {
      if (!user) return;
      // Load all tasks and filter completed ones
      const allTasks = await taskService.getTasks(user.$id);
      const completed = (allTasks.documents || []).filter((t: types.Task) => t.completed);
      setCompletedTasks(completed);
    } catch {
      console.error('Error loading completed tasks');
    }
  }, [user, setCompletedTasks]);

  useEffect(() => {
    if (user) {
      loadCompletedTasks();
    }
  }, [user, loadCompletedTasks]);

  const calculatePlannedTime = (taskList: types.Task[]) => {
    return taskList.reduce((sum, t) => sum + t.plannedDuration, 0);
  };

  const calculateSpentTime = (taskList: types.Task[]) => {
    return taskList.reduce((sum, t) => sum + (t.actualDuration || 0), 0);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes - hours * 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const remainingTasks = tasks.filter((t) => !t.completed);
  const plannedCompleted = calculatePlannedTime(completedTasks);
  const spentCompleted = calculateSpentTime(completedTasks);
  const plannedRemaining = calculatePlannedTime(remainingTasks);
  const spentRemaining = calculateSpentTime(remainingTasks);
  const plannedTotal = plannedCompleted + plannedRemaining;
  const spentTotal = spentCompleted + spentRemaining;

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear completed tasks?',
      [
        { text: 'Cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              for (const task of completedTasks) {
                await taskService.deleteTask(task.$id);
              }
              setCompletedTasks([]);
              Alert.alert('Success', 'Completed tasks cleared');
            } catch {
              Alert.alert('Error', 'Failed to clear tasks');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack paddingHorizontal="$4">
        <Text fontSize={28} fontWeight="700" marginBottom="$5" marginTop="$4">Report</Text>

        {/* Summary Cards */}
        <XStack gap="$3" marginBottom="$6">
          <YStack
            flex={1}
            paddingVertical="$4"
            paddingHorizontal="$3"
            backgroundColor="$gray2"
            borderRadius="$2"
            alignItems="center"
          >
            <Text fontSize="$2" color="$gray10" marginBottom="$1">Planned</Text>
            <Text fontSize="$6" fontWeight="700" color={accentColor}>
              {formatTime(plannedTotal)}
            </Text>
          </YStack>
          <YStack
            flex={1}
            paddingVertical="$4"
            paddingHorizontal="$3"
            backgroundColor="$gray2"
            borderRadius="$2"
            alignItems="center"
          >
            <Text fontSize="$2" color="$gray10" marginBottom="$1">Spent</Text>
            <Text fontSize="$6" fontWeight="700" color={accentColor}>
              {formatTime(spentTotal)}
            </Text>
          </YStack>
        </XStack>

        {/* Completed Section */}
        <YStack marginBottom="$6">
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
            <Text fontSize="$5" fontWeight="600">Completed ({completedTasks.length})</Text>
            {completedTasks.length > 0 && (
              <Button
                backgroundColor="transparent"
                paddingHorizontal={0}
                onPress={handleClearHistory}
              >
                <Text color={accentColor} fontSize="$3" fontWeight="600">Clear</Text>
              </Button>
            )}
          </XStack>

          <XStack
            paddingVertical="$2"
            paddingHorizontal="$2"
            backgroundColor="$gray2"
            borderRadius="$2"
            marginBottom="$1"
          >
            <Text fontSize="$2" fontWeight="600" color="$gray10" flex={1}>Task</Text>
            <Text fontSize="$2" fontWeight="600" color="$gray10" width={80}>Planned</Text>
            <Text fontSize="$2" fontWeight="600" color="$gray10" width={80}>Spent</Text>
          </XStack>

          <FlatList
            data={completedTasks}
            renderItem={({ item }) => (
              <XStack
                paddingVertical="$2.5"
                paddingHorizontal="$2"
                borderBottomWidth={1}
                borderBottomColor="$gray2"
                alignItems="center"
              >
                <XStack flex={1} alignItems="center">
                  <Text fontSize={18} marginRight="$2">{item.emoji || '📝'}</Text>
                  <Text fontSize="$3" fontWeight="500" flex={1} numberOfLines={1}>
                    {item.title}
                  </Text>
                </XStack>
                <Text fontSize="$3" color="$gray10" width={80} textAlign="right">
                  {item.plannedDuration}m
                </Text>
                <Text fontSize="$3" color="$gray10" width={80} textAlign="right">
                  {item.actualDuration || 0}m
                </Text>
              </XStack>
            )}
            scrollEnabled={false}
            keyExtractor={(item) => item.$id}
            ListEmptyComponent={
              <Text fontSize="$3" color="$gray10" paddingVertical="$4" textAlign="center">
                No completed tasks
              </Text>
            }
          />

          {completedTasks.length > 0 && (
            <XStack
              paddingVertical="$3"
              paddingHorizontal="$2"
              backgroundColor="$gray2"
              borderRadius="$2"
              marginTop="$2"
              alignItems="center"
            >
              <Text fontSize="$3" fontWeight="600" flex={1}>Total</Text>
              <Text fontSize="$3" fontWeight="600" color="$gray12" width={80} textAlign="right">
                {plannedCompleted}m
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$gray12" width={80} textAlign="right">
                {spentCompleted}m
              </Text>
            </XStack>
          )}
        </YStack>

        {/* Remaining Section */}
        <YStack marginBottom="$6">
          <Text fontSize="$5" fontWeight="600" marginBottom="$3">
            Remaining ({remainingTasks.length})
          </Text>

          <XStack
            paddingVertical="$2"
            paddingHorizontal="$2"
            backgroundColor="$gray2"
            borderRadius="$2"
            marginBottom="$1"
          >
            <Text fontSize="$2" fontWeight="600" color="$gray10" flex={1}>Task</Text>
            <Text fontSize="$2" fontWeight="600" color="$gray10" width={100}>Planned</Text>
            <Text fontSize="$2" fontWeight="600" color="$gray10" width={100}>Spent</Text>
          </XStack>

          <FlatList
            data={remainingTasks}
            renderItem={({ item }) => (
              <XStack
                paddingVertical="$2.5"
                paddingHorizontal="$2"
                borderBottomWidth={1}
                borderBottomColor="$gray2"
                alignItems="center"
              >
                <XStack flex={1} alignItems="center">
                  <Text fontSize={18} marginRight="$2">{item.emoji || '📝'}</Text>
                  <Text fontSize="$3" fontWeight="500" flex={1} numberOfLines={1}>
                    {item.title}
                  </Text>
                </XStack>
                <Text fontSize="$3" color="$gray10" width={100} textAlign="right">
                  {item.plannedDuration}m
                </Text>
                <Text fontSize="$3" color="$gray10" width={100} textAlign="right">
                  {item.actualDuration || 0}m
                </Text>
              </XStack>
            )}
            scrollEnabled={false}
            keyExtractor={(item) => item.$id}
            ListEmptyComponent={
              <Text fontSize="$3" color="$gray10" paddingVertical="$4" textAlign="center">
                No remaining tasks
              </Text>
            }
          />

          {remainingTasks.length > 0 && (
            <XStack
              paddingVertical="$3"
              paddingHorizontal="$2"
              backgroundColor="$gray2"
              borderRadius="$2"
              marginTop="$2"
              alignItems="center"
            >
              <Text fontSize="$3" fontWeight="600" flex={1}>Total</Text>
              <Text fontSize="$3" fontWeight="600" color="$gray12" width={100} textAlign="right">
                {plannedRemaining}m
              </Text>
              <Text fontSize="$3" fontWeight="600" color="$gray12" width={100} textAlign="right">
                {spentRemaining}m
              </Text>
            </XStack>
          )}
        </YStack>

        <Text fontSize="$2" color="$gray10" lineHeight={18} marginVertical="$5" fontStyle="italic">
          * Numbers may be slightly different due to rounding{'\n'}
          * The Report shows a summary of the tasks on your Main List (including completed items
          that are hidden)
        </Text>
      </YStack>
    </ScrollView>
  );
}
