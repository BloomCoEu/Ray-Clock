import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
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

      setPresets([...presets, newPreset]);
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
        createdTasks.push(createdTask);
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
      setPresets([...presets, duplicated]);
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Preset Lists</Text>
      <Text style={styles.description}>
        Presets are templates you can import into your main list. Use for repeatable sets of tasks and routines.
      </Text>

      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: accentColor }]}
        onPress={() => setShowModal(true)}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.createButtonText}>Create Preset</Text>
      </TouchableOpacity>

      <FlatList
        data={presets}
        renderItem={({ item }) => {
          const totalTime = calculateTotalTime(item.tasks);
          return (
            <View style={[styles.presetCard, { borderLeftColor: accentColor }]}>
              <View style={styles.presetHeader}>
                <View>
                  <Text style={styles.presetEmoji}>{item.emoji || '📝'}</Text>
                </View>
                <View style={styles.presetInfo}>
                  <Text style={styles.presetName}>{item.name}</Text>
                  <Text style={styles.presetStats}>
                    {item.tasks.length} tasks • {totalTime}m total
                  </Text>
                </View>
              </View>

              <View style={styles.presetActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { borderColor: accentColor }]}
                  onPress={() => handleLoadPreset(item)}
                >
                  <Text style={[styles.actionText, { color: accentColor }]}>Load</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { borderColor: accentColor }]}
                  onPress={() => handleDuplicatePreset(item.$id)}
                >
                  <Text style={[styles.actionText, { color: accentColor }]}>Duplicate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { borderColor: '#ef4444' }]}
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
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        scrollEnabled={false}
        keyExtractor={(item) => item.$id}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No presets yet. Create one to get started!</Text>
          </View>
        }
      />

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Preset</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.label}>Preset Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter preset name"
                value={presetName}
                onChangeText={setPresetName}
                placeholderTextColor="#999"
              />

              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: accentColor }]}
                onPress={handleCreatePreset}
                disabled={isLoading}
              >
                <Text style={styles.submitButtonText}>Create Preset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  presetCard: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingRight: 12,
  },
  presetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  presetEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  presetStats: {
    fontSize: 12,
    color: '#666',
  },
  presetActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalContent: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
