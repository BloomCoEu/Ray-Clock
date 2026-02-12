import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { settingsService } from '@/lib/appwrite-service';
import { useTodoistSync } from '@/hooks/use-todoist-sync';
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
  const [todoistApiKey, setTodoistApiKey] = useState(settings?.todoistApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);

  const { syncFromTodoist, isSyncing, syncMessage, lastSyncError } = useTodoistSync();

  // Sync local state with settings when settings change
  useEffect(() => {
    if (settings?.todoistApiKey) {
      setTodoistApiKey(settings.todoistApiKey);
    }
  }, [settings?.todoistApiKey]);

  const currentSettings = settings || {
    userId: user?.$id || '',
    defaultTime: 15,
    accentColor: '#10B981',
    theme: 'auto' as const,
    smartTimeDetection: true,
    pieTimerEnabled: false,
    todoistApiKey: '',
    todoistSyncEnabled: false,
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

  const handleSaveTodoistApiKey = async () => {
    if (!todoistApiKey.trim()) {
      Alert.alert('Error', 'Please enter a valid Todoist API key');
      return;
    }

    try {
      await handleSettingChange('todoistApiKey', todoistApiKey.trim());
      Alert.alert('Success', 'Todoist API key saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save Todoist API key');
    }
  };

  const handleSyncNow = async () => {
    if (!currentSettings.todoistApiKey) {
      Alert.alert('Error', 'Please configure your Todoist API key first');
      return;
    }

    if (!currentSettings.todoistSyncEnabled) {
      Alert.alert('Error', 'Please enable Todoist sync first');
      return;
    }

    try {
      await syncFromTodoist();
    } catch (error) {
      Alert.alert('Sync Error', 'Failed to sync with Todoist. Please check your API key and try again.');
    }
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

      {/* Todoist Integration Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔗 Todoist Integration</Text>
        <Text style={styles.sectionDescription}>
          Connect your Todoist account to sync tasks automatically.
        </Text>

        {/* API Key Input */}
        <View style={styles.apiKeyContainer}>
          <TextInput
            style={styles.apiKeyInput}
            placeholder="Enter Todoist API Key"
            value={todoistApiKey}
            onChangeText={setTodoistApiKey}
            secureTextEntry={!showApiKey}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowApiKey(!showApiKey)}
          >
            <Ionicons
              name={showApiKey ? 'eye-off' : 'eye'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: currentSettings.accentColor }]}
          onPress={handleSaveTodoistApiKey}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>Save API Key</Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          Get your API key from Todoist Settings → Integrations → Developer
        </Text>

        {/* Enable Sync Toggle */}
        <View style={styles.syncToggleContainer}>
          <Text style={styles.syncToggleLabel}>Enable Todoist Sync</Text>
          <Switch
            value={currentSettings.todoistSyncEnabled}
            onValueChange={(value) =>
              handleSettingChange('todoistSyncEnabled', value)
            }
            disabled={isLoading || !currentSettings.todoistApiKey}
          />
        </View>

        {/* Sync Button */}
        {currentSettings.todoistSyncEnabled && currentSettings.todoistApiKey && (
          <TouchableOpacity
            style={[styles.syncButton, { borderColor: currentSettings.accentColor }]}
            onPress={handleSyncNow}
            disabled={isSyncing || isLoading}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color={currentSettings.accentColor} />
            ) : (
              <Ionicons name="sync" size={20} color={currentSettings.accentColor} />
            )}
            <Text style={[styles.syncButtonText, { color: currentSettings.accentColor }]}>
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Sync Status Messages */}
        {syncMessage && (
          <Text style={[styles.syncStatus, { color: lastSyncError ? '#EF4444' : '#22C55E' }]}>
            {syncMessage}
          </Text>
        )}
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
  apiKeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  apiKeyInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  eyeButton: {
    padding: 8,
  },
  saveButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  helperText: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  syncToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  syncToggleLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  syncButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  syncButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  syncStatus: {
    marginTop: 8,
    fontSize: 13,
    textAlign: 'center',
  },
});

