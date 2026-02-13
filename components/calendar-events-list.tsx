import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CalendarEvent, Reminder } from '@/lib/types';

interface CalendarEventsListProps {
  events: CalendarEvent[];
  reminders: Reminder[];
  accentColor: string;
}

function formatEventTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export function CalendarEventsList({ events, reminders, accentColor }: CalendarEventsListProps) {
  const incompleteReminders = reminders.filter(r => !r.completed);

  return (
    <View style={styles.container}>
      {events.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={20} color={accentColor} />
            <Text style={styles.sectionTitle}>Calendar Events</Text>
          </View>
          <FlatList
            data={events.slice(0, 10)}
            renderItem={({ item }) => (
              <View style={[styles.eventCard, { borderLeftColor: accentColor }]}>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.eventTime}>
                    {formatEventDate(item.startDate)} · {formatEventTime(item.startDate)} – {formatEventTime(item.endDate)}
                  </Text>
                  {item.location ? (
                    <Text style={styles.eventLocation} numberOfLines={1}>
                      📍 {item.location}
                    </Text>
                  ) : null}
                </View>
              </View>
            )}
            keyExtractor={(item) => item.uid}
            scrollEnabled={false}
          />
        </View>
      )}

      {incompleteReminders.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkbox-outline" size={20} color={accentColor} />
            <Text style={styles.sectionTitle}>Reminders</Text>
          </View>
          <FlatList
            data={incompleteReminders.slice(0, 10)}
            renderItem={({ item }) => (
              <View style={[styles.reminderCard, { borderLeftColor: '#F97316' }]}>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle} numberOfLines={1}>{item.title}</Text>
                  {item.dueDate ? (
                    <Text style={styles.eventTime}>
                      Due: {formatEventDate(item.dueDate)}
                    </Text>
                  ) : null}
                  {item.notes ? (
                    <Text style={styles.reminderNotes} numberOfLines={2}>{item.notes}</Text>
                  ) : null}
                </View>
              </View>
            )}
            keyExtractor={(item) => item.uid}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  sectionContainer: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  eventCard: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    marginBottom: 6,
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderRadius: 8,
  },
  reminderCard: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    marginBottom: 6,
    backgroundColor: '#fff7ed',
    borderLeftWidth: 4,
    borderRadius: 8,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 12,
    color: '#666',
  },
  eventLocation: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  reminderNotes: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});
