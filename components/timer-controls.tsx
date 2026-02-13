import { YStack, XStack, Button, Text } from 'tamagui';
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
  // Parent components pass down callbacks as props; we invoke them like normal JS functions.
  // If the parent recreates the callback on each render (e.g., without useCallback), a new function
  // reference will be passed in, but the usage here remains the same.
  return (
    <YStack paddingHorizontal="$4" paddingVertical="$6">
      <XStack justifyContent="center" gap="$4" marginBottom="$6">
        <Button
          size="$4"
          borderWidth={2}
          borderColor={accentColor}
          backgroundColor="transparent"
          minWidth={80}
          onPress={() => onAdjustTime(-5 * 60)}
        >
          <Text color={accentColor} fontWeight="600" fontSize="$5">-5m</Text>
        </Button>
        
        <Button
          size="$4"
          borderWidth={2}
          borderColor={accentColor}
          backgroundColor="transparent"
          minWidth={80}
          onPress={() => onAdjustTime(5 * 60)}
        >
          <Text color={accentColor} fontWeight="600" fontSize="$5">+5m</Text>
        </Button>
      </XStack>

      <YStack alignItems="center" marginBottom="$6">
        <Button
          circular
          size="$6"
          backgroundColor={accentColor}
          onPress={onPlayPause}
          pressStyle={{ scale: 0.95 }}
          icon={
            <Ionicons
              name={isRunning ? 'pause' : 'play'}
              size={40}
              color="white"
            />
          }
        />
      </YStack>

      <Button
        size="$3"
        backgroundColor="transparent"
        onPress={onSkip}
        icon={<Ionicons name="play-skip-forward" size={24} color="#666" />}
      >
        <Text color="#666">Skip Task</Text>
      </Button>
    </YStack>
  );
}
