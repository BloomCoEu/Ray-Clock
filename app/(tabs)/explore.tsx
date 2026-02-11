import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Collapsible } from '@/components/ui/collapsible';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⏰ Ray Clock</Text>
        <Text style={styles.subtitle}>Help & Information</Text>
      </View>

      <Collapsible title="Getting Started">
        <Text style={styles.text}>
          Welcome to Ray Clock! This app helps you manage your time effectively with task tracking and timer functionality.
        </Text>
        <Text style={styles.text}>
          To get started, create your first task on the Home tab and start the timer when you&apos;re ready to begin.
        </Text>
      </Collapsible>

      <Collapsible title="Timer Features">
        <Text style={styles.text}>
          • Start/pause/resume timer for each task{'\n'}
          • Adjust time with -5/+5 minute buttons{'\n'}
          • Automatic task completion when time runs out{'\n'}
          • Track actual time vs planned time
        </Text>
      </Collapsible>

      <Collapsible title="Task Management">
        <Text style={styles.text}>
          • Create tasks with custom emojis and durations{'\n'}
          • Edit and delete tasks as needed{'\n'}
          • Tasks automatically progress to the next one{'\n'}
          • View completed tasks in Reports
        </Text>
      </Collapsible>

      <Collapsible title="Preset Lists">
        <Text style={styles.text}>
          Save common task lists as presets and load them anytime. Perfect for morning routines, work sessions, or any recurring set of tasks.
        </Text>
      </Collapsible>

      <Collapsible title="Customization">
        <Text style={styles.text}>
          Visit the Settings tab to customize:{'\n'}
          • Accent color (13 options){'\n'}
          • Theme (Auto, Light, Dark){'\n'}
          • Default task duration{'\n'}
          • Smart time detection
        </Text>
      </Collapsible>

      <Collapsible title="Setup Required">
        <Text style={styles.text}>
          This app requires Appwrite configuration. Please see APPWRITE_SETUP.md in the repository for detailed setup instructions.
        </Text>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => openLink('https://github.com/BloomCoEu/Ray-Clock')}
        >
          <Ionicons name="logo-github" size={20} color="#10B981" />
          <Text style={styles.linkText}>View on GitHub</Text>
        </TouchableOpacity>
      </Collapsible>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Built with ❤️ using Expo and Appwrite</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 12,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
