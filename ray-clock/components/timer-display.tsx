import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

interface TimerDisplayProps {
  time: number; // in seconds
  taskName: string;
  taskEmoji: string;
  isRunning: boolean;
  accentColor: string;
}

export const TimerDisplay = ({
  time,
  taskName,
  taskEmoji,
  isRunning,
  accentColor,
}: TimerDisplayProps) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const formatTime = (h: number, m: number, s: number) => {
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');

    if (h > 0) {
      return `${hh}:${mm}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <View style={[styles.container, { borderTopColor: accentColor }]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{taskEmoji || '📝'}</Text>
        <Text style={styles.taskName}>{taskName}</Text>
      </View>
      <View style={[styles.timerContent, { borderBottomColor: accentColor }]}>
        <Text style={styles.time}>{formatTime(hours, minutes, seconds)}</Text>
        {isRunning && <View style={[styles.indicator, { backgroundColor: accentColor }]} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 3,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  taskName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  timerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
    borderBottomWidth: 2,
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 16,
    opacity: 0.7,
  },
});
