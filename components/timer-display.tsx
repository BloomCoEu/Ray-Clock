import { View, Text, StyleSheet } from 'react-native';

interface TimerDisplayProps {
  time: number; // in seconds
  taskName: string;
  taskEmoji: string;
  isRunning: boolean;
  accentColor: string;
}

export function TimerDisplay({ time, taskName, taskEmoji, isRunning, accentColor }: TimerDisplayProps) {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{taskEmoji}</Text>
      <Text style={styles.taskName}>{taskName}</Text>
      <Text style={[styles.time, { color: accentColor }]}>{formatTime(time)}</Text>
      {isRunning && <Text style={[styles.status, { color: accentColor }]}>● Running</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  taskName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  time: {
    fontSize: 56,
    fontWeight: '700',
    marginBottom: 8,
    fontVariant: ['tabular-nums'],
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
});
