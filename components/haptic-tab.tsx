import { Pressable, PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: PressableProps) {
  const handlePress = (e: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    props.onPress?.(e);
  };

  return <Pressable {...props} onPress={handlePress} />;
}
