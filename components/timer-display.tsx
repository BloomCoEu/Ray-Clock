import { YStack, Text } from 'tamagui';

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
    <YStack alignItems="center" paddingVertical="$6" paddingHorizontal="$4">
      <Text fontSize={64} marginBottom="$4">{taskEmoji}</Text>
      <Text fontSize="$8" fontWeight="600" marginBottom="$6" textAlign="center">
        {taskName}
      </Text>
      <Text 
        fontSize={56} 
        fontWeight="700" 
        marginBottom="$2" 
        color={accentColor}
        fontFamily="$mono"
      >
        {formatTime(time)}
      </Text>
      {isRunning && (
        <Text fontSize="$3" fontWeight="500" color={accentColor}>
          ● Running
        </Text>
      )}
    </YStack>
  );
}
