import React from 'react';
import { Text, TextStyle } from 'react-native';

type Props = {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
};

export const IconSymbol: React.FC<Props> = ({ name, size = 20, color = '#000', style }) => {
  return (
    <Text
      accessible={false}
      accessibilityRole="image"
      style={[{ fontSize: size, color, includeFontPadding: false }, style] as any}>
      {name}
    </Text>
  );
};

export default IconSymbol;
