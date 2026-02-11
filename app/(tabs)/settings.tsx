import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Pie Timer Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Pie Timer</Text>
            <Text style={styles.sectionDescription}>
              Set the pie timer as the default timer (this only works for tasks that are 1hr or less).
            </Text>
          </View>
        </View>
        <Switch
          value={currentSettings.pieTimerEnabled}
          onValueChange={(value) =>
            handleSettingChange('pieTimerEnabled', value)
          }
          disabled={isLoading}
          style={styles.switch}
        />
      </View>

      {/* Accent Color Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accent Color</Text>
        <Text style={styles.sectionDescription}>
          Set the color for the pie timer and the Silent Visual Alarm.
        </Text>

        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: currentSettings.accentColor }]}
          onPress={() => setShowColorPicker(!showColorPicker)}
        >
          <Text style={styles.colorButtonText}>Selected Color</Text>
        </TouchableOpacity>

        {showColorPicker && (
          <View style={styles.colorPicker}>
            <FlatList
              data={COLORS}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.colorOption,
                    { backgroundColor: item },
                    currentSettings.accentColor === item &&
                      styles.colorOptionSelected,
                  ]}
                  onPress={() => handleColorSelect(item)}
                >
                  {currentSettings.accentColor === item && (
                    <Ionicons name="checkmark" size={20} color="white" />
                  )}
                </TouchableOpacity>
              )}
              numColumns={4}
              keyExtractor={(item) => item}
              scrollEnabled={false}
            />
          </View>
        )}
      </View>

      {/* Theme Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <Text style={styles.sectionDescription}>
          Shine brightly in light mode, or turn to the dark side
        </Text>

        <View style={styles.themeOptions}>
          {(['auto', 'light', 'dark'] as const).map((theme) => (
            <TouchableOpacity
              key={theme}
              style={[
                styles.themeButton,
                currentSettings.theme === theme && styles.themeButtonActive,
                { borderColor: currentSettings.accentColor },
              ]}
              onPress={() => handleSettingChange('theme', theme)}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  currentSettings.theme === theme && {
                    color: currentSettings.accentColor,
                  },
                ]}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Smart Time Detection Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Smart Time Detection</Text>
            <Text style={styles.sectionDescription}>
              If you type a number after a task&apos;s title it will automatically set the timer for that task
            </Text>
          </View>
        </View>
        <Switch
          value={currentSettings.smartTimeDetection}
          onValueChange={(value) =>
            handleSettingChange('smartTimeDetection', value)
          }
          disabled={isLoading}
          style={styles.switch}
        />
      </View>

      {/* Default Time Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default Time</Text>
        <Text style={styles.sectionDescription}>
          Set the default time used when creating new tasks.
        </Text>

        <View style={styles.defaultTimeInput}>
          {[5, 10, 15, 20, 30].map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeButton,
                currentSettings.defaultTime === time &&
                  styles.timeButtonActive,
                currentSettings.defaultTime === time && {
                  backgroundColor: currentSettings.accentColor,
                },
              ]}
              onPress={() => handleDefaultTimeChange(time)}
            >
              <Text
                style={[
                  styles.timeButtonText,
                  currentSettings.defaultTime === time && {
                    color: 'white',
                  },
                ]}
              >
                {time}m
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    marginTop: 16,
    marginHorizontal: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  switch: {
    marginTop: 8,
  },
  colorButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  colorPicker: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  colorOption: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 8,
    margin: '1%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#333',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    alignItems: 'center',
  },
  themeButtonActive: {
    backgroundColor: '#f0f0f0',
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  defaultTimeInput: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  timeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderRadius: 8,
  },
  timeButtonActive: {
    borderColor: 'transparent',
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  spacer: {
    height: 32,
  },
});

