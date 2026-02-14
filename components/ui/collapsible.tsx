import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  // Enable LayoutAnimation on Android
  // @ts-ignore
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  title: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
};

export const Collapsible: React.FC<Props> = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.8} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.chev}>{open ? '▾' : '▸'}</Text>
      </TouchableOpacity>
      {open ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 16,
  },
  chev: {
    fontSize: 16,
    opacity: 0.8,
  },
  content: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
});

export default Collapsible;
