import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { taskService } from '@/lib/appwrite-service';
import * as types from '@/lib/types';

const PACE_THRESHOLD_MINUTES = 5;
const DEFAULT_PLANNING_START_HOUR = 9;
const DEFAULT_PLANNING_END_HOUR = 18;
const DEFAULT_TASK_EMOJI = '📝';

const calculateScheduleStart = (planningStartHour: number, planningEndHour: number) => {
  const now = new Date();
  now.setSeconds(0, 0);
  const hour = now.getHours();
  if (hour >= planningEndHour) {
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(planningStartHour, 0, 0, 0);
    return nextDay;
  }
  if (hour < planningStartHour) {
    const todayStart = new Date(now);
    todayStart.setHours(planningStartHour, 0, 0, 0);
    return todayStart;
  }
  now.setHours(hour, now.getMinutes(), 0, 0);
  return now;
};

export default function ReportScreen() {
  const user = useAppStore((state) => state.user);
  const tasks = useAppStore((state) => state.tasks);
  const settings = useAppStore((state) => state.settings);
  const completedTasks = useAppStore((state) => state.completedTasks);
  const setCompletedTasks = useAppStore((state) => state.setCompletedTasks);

  const [isLoading, setIsLoading] = useState(false);

  const accentColor = settings?.accentColor || '#10B981';

  useEffect(() => {
    if (user) {
      loadCompletedTasks();
    }
  }, [user]);

  const loadCompletedTasks = async () => {
    try {
      setIsLoading(true);
      if (!user) return;
      // Load all tasks and filter completed ones
      const allTasks = await taskService.getTasks(user.$id);
      const completed = (allTasks.documents || []).filter((t: types.Task) => t.completed);
      setCompletedTasks(completed);
    } catch (error) {
      console.error('Error loading completed tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatVariance = (minutes: number) => {
    if (minutes === 0) {
      return '0m';
    }
    const sign = minutes > 0 ? '+' : '-';
    return `${sign}${formatTime(Math.abs(minutes))}`;
  };

  const formatClockTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const remainingTasks = tasks.filter((t) => !t.completed);
  const remainingPlannedTasks = remainingTasks.filter((task) => task.plannedDuration > 0);
  const plannedCompleted = calculatePlannedTime(completedTasks);
  const spentCompleted = calculateSpentTime(completedTasks);
  const plannedRemaining = calculatePlannedTime(remainingTasks);
  const spentRemaining = calculateSpentTime(remainingTasks);
  const plannedTotal = plannedCompleted + plannedRemaining;
  const spentTotal = spentCompleted + spentRemaining;
  const completionRate =
    plannedTotal > 0
      ? Math.round((plannedCompleted / plannedTotal) * 100)
      : plannedCompleted > 0
        ? 100
        : 0;
  const paceDelta = spentCompleted - plannedCompleted;
  const paceLabel =
    paceDelta > PACE_THRESHOLD_MINUTES
      ? 'Over plan'
      : paceDelta < -PACE_THRESHOLD_MINUTES
        ? 'Ahead'
        : 'On track';
  const paceDetail = paceDelta === 0 ? 'Even with plan' : `${formatVariance(paceDelta)} vs plan`;
  const averageBlock =
    remainingPlannedTasks.length > 0
      ? Math.round(plannedRemaining / remainingPlannedTasks.length)
      : 0;
  const scheduleStart = calculateScheduleStart(
    DEFAULT_PLANNING_START_HOUR,
    DEFAULT_PLANNING_END_HOUR
  );
  let cumulativeMinutes = 0;
  const scheduleItems = remainingTasks.map((task, index) => {
    const start = new Date(scheduleStart.getTime() + cumulativeMinutes * 60000);
    cumulativeMinutes += task.plannedDuration;
    const end = new Date(scheduleStart.getTime() + cumulativeMinutes * 60000);
    const key = task.$id ?? `task-${index}`;
    return { task, start, end, key };
  });
  const projectedFinish =
    plannedRemaining > 0
      ? formatClockTime(new Date(scheduleStart.getTime() + plannedRemaining * 60000))
      : 'Complete';

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
            } catch (error) {
              Alert.alert('Error', 'Failed to clear tasks');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Report</Text>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Planned</Text>
          <Text style={[styles.summaryValue, { color: accentColor }]}>
            {formatTime(plannedTotal)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Spent</Text>
          <Text style={[styles.summaryValue, { color: accentColor }]}>
            {formatTime(spentTotal)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Day Plan</Text>
        <View style={styles.planGrid}>
          <View style={styles.planCard}>
            <Text style={styles.planLabel}>Completion</Text>
            <Text style={[styles.planValue, { color: accentColor }]}>{completionRate}%</Text>
            <Text style={styles.planSubvalue}>
              {formatTime(plannedCompleted)} of {formatTime(plannedTotal)}
            </Text>
          </View>
          <View style={styles.planCard}>
            <Text style={styles.planLabel}>Pace</Text>
            <Text style={[styles.planValue, { color: accentColor }]}>{paceLabel}</Text>
            <Text style={styles.planSubvalue}>{paceDetail}</Text>
          </View>
          <View style={styles.planCard}>
            <Text style={styles.planLabel}>Projected Finish</Text>
            <Text style={[styles.planValue, { color: accentColor }]}>{projectedFinish}</Text>
            <Text style={styles.planSubvalue}>Remaining {formatTime(plannedRemaining)}</Text>
          </View>
          <View style={styles.planCard}>
            <Text style={styles.planLabel}>Avg Block</Text>
            <Text style={[styles.planValue, { color: accentColor }]}>{formatTime(averageBlock)}</Text>
            <Text style={styles.planSubvalue}>{remainingTasks.length} remaining</Text>
          </View>
        </View>
        <View style={styles.timelineContainer}>
          <Text style={styles.timelineTitle}>Planned Timeline</Text>
          {scheduleItems.length > 0 ? (
            scheduleItems.map(({ task, start, end, key }) => (
              <View style={styles.timelineRow} key={key}>
                <Text style={styles.timelineTime}>
                  {formatClockTime(start)} - {formatClockTime(end)}
                </Text>
                <Text style={styles.timelineTask} numberOfLines={1}>
                  {`${task.emoji || DEFAULT_TASK_EMOJI} ${task.title}`}
                </Text>
                <Text style={styles.timelineDuration}>{formatTime(task.plannedDuration)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.timelineEmpty}>No planned tasks yet</Text>
          )}
        </View>
      </View>

      {/* Completed Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Completed ({completedTasks.length})</Text>
          {completedTasks.length > 0 && (
            <TouchableOpacity onPress={handleClearHistory}>
              <Text style={[styles.clearButton, { color: accentColor }]}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Task</Text>
          <Text style={[styles.tableHeaderCell, { width: 80 }]}>Planned</Text>
          <Text style={[styles.tableHeaderCell, { width: 80 }]}>Spent</Text>
        </View>

        <FlatList
          data={completedTasks}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.taskNameContainer}>
                  <Text style={styles.emoji}>{item.emoji || '📝'}</Text>
                  <Text style={styles.taskName} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
              </View>
              <Text style={[styles.tableCell, { width: 80 }]}>
                {item.plannedDuration}m
              </Text>
              <Text style={[styles.tableCell, { width: 80 }]}>
                {item.actualDuration || 0}m
              </Text>
            </View>
          )}
          scrollEnabled={false}
          keyExtractor={(item) => item.$id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No completed tasks</Text>
          }
        />

        {completedTasks.length > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryRowLabel}>Total</Text>
            <Text style={[styles.summaryRowValue, { width: 80 }]}>
              {plannedCompleted}m
            </Text>
            <Text style={[styles.summaryRowValue, { width: 80 }]}>
              {spentCompleted}m
            </Text>
          </View>
        )}
      </View>

      {/* Remaining Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Remaining ({remainingTasks.length})</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Task</Text>
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>Planned</Text>
          <Text style={[styles.tableHeaderCell, { width: 100 }]}>Spent</Text>
        </View>

        <FlatList
          data={remainingTasks}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.taskNameContainer}>
                  <Text style={styles.emoji}>{item.emoji || '📝'}</Text>
                  <Text style={styles.taskName} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
              </View>
              <Text style={[styles.tableCell, { width: 100 }]}>
                {item.plannedDuration}m
              </Text>
              <Text style={[styles.tableCell, { width: 100 }]}>
                {item.actualDuration || 0}m
              </Text>
            </View>
          )}
          scrollEnabled={false}
          keyExtractor={(item) => item.$id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No remaining tasks</Text>
          }
        />

        {remainingTasks.length > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryRowLabel}>Total</Text>
            <Text style={[styles.summaryRowValue, { width: 100 }]}>
              {plannedRemaining}m
            </Text>
            <Text style={[styles.summaryRowValue, { width: 100 }]}>
              {spentRemaining}m
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.disclaimer}>
        * Numbers may be slightly different due to rounding{'\n'}
        * The Report shows a summary of the tasks on your Main List (including completed items
        that are hidden)
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  planGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  planCard: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 160,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  planLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  planValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  planSubvalue: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  timelineContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timelineTime: {
    width: 92,
    fontSize: 12,
    color: '#666',
  },
  timelineTask: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    marginRight: 8,
  },
  timelineDuration: {
    fontSize: 12,
    color: '#666',
  },
  timelineEmpty: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  taskNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 18,
    marginRight: 8,
  },
  taskName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  tableCell: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  summaryRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
    fontWeight: '600',
  },
  summaryRowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryRowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
  emptyText: {
    paddingVertical: 16,
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    lineHeight: 18,
    marginVertical: 20,
    fontStyle: 'italic',
  },
});
