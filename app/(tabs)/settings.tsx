import { ScrollView, Switch, FlatList } from 'react-native';
import { useState } from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useAppStore } from '@/lib/store';
import { settingsService } from '@/lib/appwrite-service';
import { Ionicons } from '@expo/vector-icons';

const COLORS = [
  '#EF4444', // red
  '#F97316', // orange
  '#EAB308', // yellow
  '#FACC15', // amber
  '#22C55E', // green
  '#10B981', // emerald
  '#06B6D4', // cyan
  '#0EA5E9', // sky
  '#3B82F6', // blue
  '#1D4ED8', // dark blue
  '#8B5CF6', // purple
  '#D946EF', // fuchsia
  '#6366F1', // indigo
];

export default function SettingsScreen() {
  const user = useAppStore((state) => state.user);
  const settings = useAppStore((state) => state.settings);
  const setSettings = useAppStore((state) => state.setSettings);

  const [isLoading, setIsLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const currentSettings = settings || {
    userId: user?.$id || '',
    defaultTime: 15,
    accentColor: '#10B981',
    theme: 'auto' as const,
    smartTimeDetection: true,
    pieTimerEnabled: false,
  };

  const handleSettingChange = async (key: string, value: any) => {
    try {
      setIsLoading(true);
      if (!user) return;

      const updated = { ...currentSettings, [key]: value };
      setSettings(updated as any);

      await settingsService.updateSettings(user.$id, { [key]: value });
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorSelect = async (color: string) => {
    await handleSettingChange('accentColor', color);
    setShowColorPicker(false);
  };

  const handleDefaultTimeChange = async (time: number) => {
    await handleSettingChange('defaultTime', time);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text fontSize={28} fontWeight="700" marginBottom="$6" marginTop="$4" marginHorizontal="$4">
        Settings
      </Text>

      {/* Pie Timer Section */}
      <YStack
        marginHorizontal="$4"
        marginBottom="$6"
        paddingBottom="$4"
        borderBottomWidth={1}
        borderBottomColor="$gray5"
      >
        <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$3">
          <YStack flex={1}>
            <Text fontSize="$5" fontWeight="600" marginBottom="$1">Pie Timer</Text>
            <Text fontSize="$3" color="$gray10" lineHeight={20} marginBottom="$3">
              Set the pie timer as the default timer (this only works for tasks that are 1hr or less).
            </Text>
          </YStack>
        </XStack>
        <Switch
          value={currentSettings.pieTimerEnabled}
          onValueChange={(value) =>
            handleSettingChange('pieTimerEnabled', value)
          }
          disabled={isLoading}
        />
      </YStack>

      {/* Accent Color Section */}
      <YStack
        marginHorizontal="$4"
        marginBottom="$6"
        paddingBottom="$4"
        borderBottomWidth={1}
        borderBottomColor="$gray5"
      >
        <Text fontSize="$5" fontWeight="600" marginBottom="$1">Accent Color</Text>
        <Text fontSize="$3" color="$gray10" lineHeight={20} marginBottom="$3">
          Set the color for the pie timer and the Silent Visual Alarm.
        </Text>

        <Button
          backgroundColor={currentSettings.accentColor}
          onPress={() => setShowColorPicker(!showColorPicker)}
          paddingVertical="$3"
          marginTop="$2"
        >
          <Text color="white" fontWeight="600">Selected Color</Text>
        </Button>

        {showColorPicker && (
          <YStack marginTop="$3" padding="$2" backgroundColor="$gray2" borderRadius="$2">
            <FlatList
              data={COLORS}
              renderItem={({ item }) => (
                <Button
                  backgroundColor={item}
                  width="23%"
                  aspectRatio={1}
                  borderRadius="$2"
                  margin="1%"
                  borderWidth={2}
                  borderColor={currentSettings.accentColor === item ? '#333' : 'transparent'}
                  onPress={() => handleColorSelect(item)}
                  icon={currentSettings.accentColor === item && (
                    <Ionicons name="checkmark" size={20} color="white" />
                  )}
                />
              )}
              numColumns={4}
              keyExtractor={(item) => item}
              scrollEnabled={false}
            />
          </YStack>
        )}
      </YStack>

      {/* Theme Section */}
      <YStack
        marginHorizontal="$4"
        marginBottom="$6"
        paddingBottom="$4"
        borderBottomWidth={1}
        borderBottomColor="$gray5"
      >
        <Text fontSize="$5" fontWeight="600" marginBottom="$1">Theme</Text>
        <Text fontSize="$3" color="$gray10" lineHeight={20} marginBottom="$3">
          Shine brightly in light mode, or turn to the dark side
        </Text>

        <XStack gap="$3" marginTop="$3">
          {(['auto', 'light', 'dark'] as const).map((theme) => (
            <Button
              key={theme}
              flex={1}
              paddingVertical="$2.5"
              borderWidth={2}
              borderColor={currentSettings.theme === theme ? currentSettings.accentColor : '$gray5'}
              backgroundColor={currentSettings.theme === theme ? '$gray2' : 'transparent'}
              onPress={() => handleSettingChange('theme', theme)}
            >
              <Text
                fontSize="$3"
                fontWeight="500"
                color={currentSettings.theme === theme ? currentSettings.accentColor : '$gray10'}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </Text>
            </Button>
          ))}
        </XStack>
      </YStack>

      {/* Smart Time Detection Section */}
      <YStack
        marginHorizontal="$4"
        marginBottom="$6"
        paddingBottom="$4"
        borderBottomWidth={1}
        borderBottomColor="$gray5"
      >
        <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$3">
          <YStack flex={1}>
            <Text fontSize="$5" fontWeight="600" marginBottom="$1">Smart Time Detection</Text>
            <Text fontSize="$3" color="$gray10" lineHeight={20} marginBottom="$3">
              If you type a number after a task&apos;s title it will automatically set the timer for that task
            </Text>
          </YStack>
        </XStack>
        <Switch
          value={currentSettings.smartTimeDetection}
          onValueChange={(value) =>
            handleSettingChange('smartTimeDetection', value)
          }
          disabled={isLoading}
        />
      </YStack>

      {/* Default Time Section */}
      <YStack
        marginHorizontal="$4"
        marginBottom="$6"
        paddingBottom="$4"
        borderBottomWidth={1}
        borderBottomColor="$gray5"
      >
        <Text fontSize="$5" fontWeight="600" marginBottom="$1">Default Time</Text>
        <Text fontSize="$3" color="$gray10" lineHeight={20} marginBottom="$3">
          Set the default time used when creating new tasks.
        </Text>

        <XStack gap="$2" marginTop="$3" flexWrap="wrap">
          {[5, 10, 15, 20, 30].map((time) => (
            <Button
              key={time}
              paddingVertical="$2"
              paddingHorizontal="$3"
              borderWidth={2}
              borderColor={currentSettings.defaultTime === time ? 'transparent' : '$gray5'}
              backgroundColor={currentSettings.defaultTime === time ? currentSettings.accentColor : 'transparent'}
              onPress={() => handleDefaultTimeChange(time)}
            >
              <Text
                fontSize="$3"
                fontWeight="500"
                color={currentSettings.defaultTime === time ? 'white' : '$gray10'}
              >
                {time}m
              </Text>
            </Button>
          ))}
        </XStack>
      </YStack>

      <YStack height={32} />
    </ScrollView>
  );
}
