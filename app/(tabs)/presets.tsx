import { ScrollView, Modal, Alert, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { YStack, XStack, Text, Button, Input } from 'tamagui';
import { useAppStore } from '@/lib/store';
import { presetService, taskService } from '@/lib/appwrite-service';
import { Ionicons } from '@expo/vector-icons';
import * as types from '@/lib/types';

export default function PresetsScreen() {
  const user = useAppStore((state) => state.user);
  const presets = useAppStore((state) => state.presets);
  const settings = useAppStore((state) => state.settings);
  const setPresets = useAppStore((state) => state.setPresets);
  const setTasks = useAppStore((state) => state.setTasks);

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPreset, setEditingPreset] = useState<types.Preset | null>(null);
  const [presetName, setPresetName] = useState('');

  const accentColor = settings?.accentColor || '#10B981';

  useEffect(() => {
    if (user) {
      loadPresets();
    }
  }, [user]);

  const loadPresets = async () => {
    try {
      setIsLoading(true);
      if (!user) return;
      const loadedPresets = await presetService.getPresets(user.$id);
      setPresets(loadedPresets.documents || []);
    } catch (error) {
      console.error('Error loading presets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePreset = async () => {
    try {
      if (!user || !presetName.trim()) {
        Alert.alert('Error', 'Please enter a preset name');
        return;
      }

      const newPreset = await presetService.createPreset(user.$id, {
        name: presetName,
        emoji: '🎯',
        tasks: [],
        totalTime: 0,
        userId: user.$id,
      });

      setPresets([...presets, newPreset as any]);
      setPresetName('');
      setShowModal(false);
    } catch (error) {
      console.error('Error creating preset:', error);
      Alert.alert('Error', 'Failed to create preset');
    }
  };

  const handleLoadPreset = async (preset: types.Preset) => {
    try {
      if (!user) return;

      // Create tasks from preset
      const createdTasks: types.Task[] = [];
      let order = 0;

      for (const task of preset.tasks) {
        const createdTask = await taskService.createTask(user.$id, {
          title: task.title,
          plannedDuration: task.plannedDuration,
          emoji: task.emoji || '📝',
          completed: false,
          userId: user.$id,
          order: order++,
          actualDuration: 0,
        });
        createdTasks.push(createdTask as any);
      }

      setTasks(createdTasks);
      Alert.alert('Success', `Loaded preset: ${preset.name}`);
    } catch (error) {
      console.error('Error loading preset:', error);
      Alert.alert('Error', 'Failed to load preset');
    }
  };

  const handleDeletePreset = async (presetId: string) => {
    try {
      await presetService.deletePreset(presetId);
      setPresets(presets.filter((p) => p.$id !== presetId));
      Alert.alert('Success', 'Preset deleted');
    } catch (error) {
      console.error('Error deleting preset:', error);
      Alert.alert('Error', 'Failed to delete preset');
    }
  };

  const handleDuplicatePreset = async (presetId: string) => {
    try {
      if (!user) return;
      const duplicated = await presetService.duplicatePreset(presetId, user.$id);
      setPresets([...presets, duplicated as any]);
      Alert.alert('Success', 'Preset duplicated');
    } catch (error) {
      console.error('Error duplicating preset:', error);
      Alert.alert('Error', 'Failed to duplicate preset');
    }
  };

  const calculateTotalTime = (tasks: Array<{ plannedDuration: number }>) => {
    return tasks.reduce((sum, t) => sum + t.plannedDuration, 0);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack paddingHorizontal="$4" paddingTop="$4">
        <Text fontSize={28} fontWeight="700" marginBottom="$2" marginTop="$4">
          Preset Lists
        </Text>
        <Text fontSize="$3" color="$gray10" lineHeight={20} marginBottom="$5">
          Presets are templates you can import into your main list. Use for repeatable sets of tasks and routines.
        </Text>

        <Button
          backgroundColor={accentColor}
          onPress={() => setShowModal(true)}
          paddingVertical="$3"
          marginBottom="$5"
          icon={<Ionicons name="add" size={24} color="white" />}
        >
          <Text color="white" fontSize="$4" fontWeight="600">Create Preset</Text>
        </Button>

        <FlatList
          data={presets}
          renderItem={({ item }) => {
            const totalTime = calculateTotalTime(item.tasks);
            return (
              <YStack
                borderLeftWidth={4}
                borderLeftColor={accentColor}
                paddingLeft="$3"
                paddingVertical="$3"
                marginBottom="$3"
                backgroundColor="$gray2"
                borderRadius="$3"
                paddingRight="$3"
              >
                <XStack alignItems="center" marginBottom="$3">
                  <Text fontSize={32} marginRight="$3">{item.emoji || '📝'}</Text>
                  <YStack flex={1}>
                    <Text fontSize="$4" fontWeight="600" marginBottom={2}>
                      {item.name}
                    </Text>
                    <Text fontSize="$2" color="$gray10">
                      {item.tasks.length} tasks • {totalTime}m total
                    </Text>
                  </YStack>
                </XStack>

                <XStack gap="$2">
                  <Button
                    flex={1}
                    paddingVertical="$2"
                    borderWidth={2}
                    borderColor={accentColor}
                    backgroundColor="transparent"
                    onPress={() => handleLoadPreset(item)}
                  >
                    <Text color={accentColor} fontSize="$2" fontWeight="600">Load</Text>
                  </Button>
                  <Button
                    flex={1}
                    paddingVertical="$2"
                    borderWidth={2}
                    borderColor={accentColor}
                    backgroundColor="transparent"
                    onPress={() => handleDuplicatePreset(item.$id)}
                  >
                    <Text color={accentColor} fontSize="$2" fontWeight="600">Duplicate</Text>
                  </Button>
                  <Button
                    flex={1}
                    paddingVertical="$2"
                    borderWidth={2}
                    borderColor="#ef4444"
                    backgroundColor="transparent"
                    onPress={() =>
                      Alert.alert(
                        'Delete Preset',
                        'Are you sure?',
                        [
                          { text: 'Cancel' },
                          {
                            text: 'Delete',
                            onPress: () => handleDeletePreset(item.$id),
                            style: 'destructive',
                          },
                        ]
                      )
                    }
                    icon={<Ionicons name="trash-outline" size={20} color="#ef4444" />}
                  />
                </XStack>
              </YStack>
            );
          }}
          scrollEnabled={false}
          keyExtractor={(item) => item.$id}
          ListEmptyComponent={
            <YStack paddingVertical="$10" alignItems="center">
              <Text fontSize="$3" color="$gray10">No presets yet. Create one to get started!</Text>
            </YStack>
          }
        />

      </YStack>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <YStack flex={1} justifyContent="flex-end" backgroundColor="rgba(0,0,0,0.5)">
          <YStack
            backgroundColor="white"
            borderTopLeftRadius="$4"
            borderTopRightRadius="$4"
            paddingHorizontal="$4"
            paddingTop="$5"
            paddingBottom="$8"
          >
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$5">
              <Text fontSize="$6" fontWeight="600">Create New Preset</Text>
              <Button
                circular
                size="$3"
                backgroundColor="transparent"
                onPress={() => setShowModal(false)}
                icon={<Ionicons name="close" size={24} color="#000" />}
              />
            </XStack>

            <YStack gap="$4">
              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="600" marginBottom="$1">Preset Name</Text>
                <Input
                  size="$4"
                  placeholder="Enter preset name"
                  value={presetName}
                  onChangeText={setPresetName}
                  borderColor="$gray5"
                  borderWidth={1}
                />
              </YStack>

              <Button
                backgroundColor={accentColor}
                onPress={handleCreatePreset}
                disabled={isLoading}
                opacity={isLoading ? 0.6 : 1}
              >
                <Text color="white" fontSize="$4" fontWeight="600">Create Preset</Text>
              </Button>
            </YStack>
          </YStack>
        </YStack>
      </Modal>
    </ScrollView>
  );
}
