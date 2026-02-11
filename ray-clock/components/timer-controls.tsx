import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface TimerControlsProps {
  isRunning: boolean;
  onPlayPause: () => void;
  onSkip?: () => void;
  onAdjustTime?: (delta: number) => void; // delta in seconds
  accentColor: string;
}

export const TimerControls = ({
  isRunning,
  onPlayPause,
  onSkip,
  onAdjustTime,
  accentColor,
}: TimerControlsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.adjustmentButtons}>
        <TouchableOpacity
          style={[styles.adjustButton, { borderColor: accentColor }]}
          onPress={() => onAdjustTime?.(-300)} // -5 minutes
        >
          <Text style={[styles.adjustText, { color: accentColor }]}>-5</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: accentColor }]}
          onPress={onPlayPause}
        >
          <Ionicons
            name={isRunning ? 'pause' : 'play'}
            size={32}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.adjustButton, { borderColor: accentColor }]}
          onPress={() => onAdjustTime?.(300)} // +5 minutes
        >
          <Text style={[styles.adjustText, { color: accentColor }]}>+5</Text>
        </TouchableOpacity>
      </View>

      {onSkip && (
        <TouchableOpacity
          style={[styles.skipButton, { borderColor: accentColor }]}
          onPress={onSkip}
        >
          <Ionicons name="play-skip-forward" size={20} color={accentColor} />
          <Text style={[styles.skipText, { color: accentColor }]}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  adjustmentButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  adjustButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustText: {
    fontSize: 18,
    fontWeight: '600',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderRadius: 24,
    gap: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
