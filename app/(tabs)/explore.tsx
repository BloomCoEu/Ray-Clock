import { ScrollView, Linking } from 'react-native';
import { YStack, Text, Button } from 'tamagui';
import { Collapsible } from '@/components/ui/collapsible';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack paddingHorizontal="$5" paddingTop="$5" paddingBottom="$4">
        <Text fontSize={32} fontWeight="700" marginBottom="$1">⏰ Ray Clock</Text>
        <Text fontSize="$4" color="$gray10">Help & Information</Text>
      </YStack>

      <Collapsible title="Getting Started">
        <Text fontSize="$3" lineHeight={22} color="$gray12" marginBottom="$3">
          Welcome to Ray Clock! This app helps you manage your time effectively with task tracking and timer functionality.
        </Text>
        <Text fontSize="$3" lineHeight={22} color="$gray12" marginBottom="$3">
          To get started, create your first task on the Home tab and start the timer when you&apos;re ready to begin.
        </Text>
      </Collapsible>

      <Collapsible title="Timer Features">
        <Text fontSize="$3" lineHeight={22} color="$gray12" marginBottom="$3">
          • Start/pause/resume timer for each task{'\n'}
          • Adjust time with -5/+5 minute buttons{'\n'}
          • Automatic task completion when time runs out{'\n'}
          • Track actual time vs planned time
        </Text>
      </Collapsible>

      <Collapsible title="Task Management">
        <Text fontSize="$3" lineHeight={22} color="$gray12" marginBottom="$3">
          • Create tasks with custom emojis and durations{'\n'}
          • Edit and delete tasks as needed{'\n'}
          • Tasks automatically progress to the next one{'\n'}
          • View completed tasks in Reports
        </Text>
      </Collapsible>

      <Collapsible title="Preset Lists">
        <Text fontSize="$3" lineHeight={22} color="$gray12" marginBottom="$3">
          Save common task lists as presets and load them anytime. Perfect for morning routines, work sessions, or any recurring set of tasks.
        </Text>
      </Collapsible>

      <Collapsible title="Customization">
        <Text fontSize="$3" lineHeight={22} color="$gray12" marginBottom="$3">
          Visit the Settings tab to customize:{'\n'}
          • Accent color (13 options){'\n'}
          • Theme (Auto, Light, Dark){'\n'}
          • Default task duration{'\n'}
          • Smart time detection
        </Text>
      </Collapsible>

      <Collapsible title="Setup Required">
        <Text fontSize="$3" lineHeight={22} color="$gray12" marginBottom="$3">
          This app requires Appwrite configuration. Please see APPWRITE_SETUP.md in the repository for detailed setup instructions.
        </Text>
        <Button
          backgroundColor="#f0f9ff"
          borderRadius="$2"
          paddingVertical="$3"
          paddingHorizontal="$4"
          marginTop="$2"
          onPress={() => openLink('https://github.com/BloomCoEu/Ray-Clock')}
          icon={<Ionicons name="logo-github" size={20} color="#10B981" />}
        >
          <Text color="#10B981" fontSize="$3" fontWeight="600">View on GitHub</Text>
        </Button>
      </Collapsible>

      <YStack paddingVertical="$8" paddingHorizontal="$5" alignItems="center">
        <Text fontSize="$2" color="$gray10" textAlign="center">
          Built with ❤️ using Expo and Appwrite
        </Text>
      </YStack>
    </ScrollView>
  );
}
