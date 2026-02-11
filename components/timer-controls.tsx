import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TimerControlsProps {
  isRunning: boolean;
  onPlayPause: () => void;
  onAdjustTime: (delta: number) => void;
  onSkip: () => void;
  accentColor: string;
}

export function TimerControls({
  isRunning,
  onPlayPause,
  onAdjustTime,
  onSkip,
  accentColor,
}: TimerControlsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.adjustButtons}>
        <TouchableOpacity
          style={[styles.adjustButton, { borderColor: accentColor }]}
          onPress={() => onAdjustTime(-5 * 60)}
        >
          <Text style={[styles.adjustText, { color: accentColor }]}>-5m</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.adjustButton, { borderColor: accentColor }]}
          onPress={() => onAdjustTime(5 * 60)}
        >
          <Text style={[styles.adjustText, { color: accentColor }]}>+5m</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainControls}>
        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: accentColor }]}
          onPress={onPlayPause}
        >
          <Ionicons
            name={isRunning ? 'pause' : 'play'}
            size={40}
            color="white"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Ionicons name="play-skip-forward" size={24} color="#666" />
        <Text style={styles.skipText}>Skip Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  adjustButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  adjustButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  adjustText: {
    fontSize: 18,
    fontWeight: '600',
  },
  mainControls: {
    alignItems: 'center',
    marginBottom: 24,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    color: '#666',
  },
});
