import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList, Alert } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as types from '@/lib/types';

const EMOJIS = ['📝', '🍽️', '🚶', '🧘', '💼', '📖', '💪', '🎯', '🧹', '🧴', '👕', '🎵', '🏃', '💻', '☕'];

interface TaskModalProps {
  visible: boolean;
  task?: types.Task;
  onClose: () => void;
  onSave: (task: Omit<types.Task, '$id' | '$createdAt' | '$updatedAt'>) => void;
  accentColor: string;
}

export const TaskModal = ({
  visible,
  task,
  onClose,
  onSave,
  accentColor,
}: TaskModalProps) => {
  const [title, setTitle] = useState(task?.title || '');
  const [duration, setDuration] = useState(String(task?.plannedDuration || 15));
  const [selectedEmoji, setSelectedEmoji] = useState(task?.emoji || '📝');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const durationNum = parseInt(duration) || 15;
    if (durationNum <= 0) {
      Alert.alert('Error', 'Duration must be greater than 0');
      return;
    }

    onSave({
      title: title.trim(),
      plannedDuration: durationNum,
      emoji: selectedEmoji,
      completed: task?.completed || false,
      userId: task?.userId || '',
      order: task?.order || 0,
      actualDuration: task?.actualDuration || 0,
    });

    setTitle('');
    setDuration('15');
    setSelectedEmoji('📝');
    setShowEmojiPicker(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{task ? 'Edit Task' : 'New Task'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Emoji Picker */}
            <View style={styles.section}>
              <Text style={styles.label}>Choose Emoji</Text>
              {!showEmojiPicker && (
                <TouchableOpacity
                  style={[styles.emojiButton, { borderColor: accentColor }]}
                  onPress={() => setShowEmojiPicker(true)}
                >
                  <Text style={styles.emojiDisplay}>{selectedEmoji}</Text>
                </TouchableOpacity>
              )}

              {showEmojiPicker && (
                <View style={styles.emojiGrid}>
                  <FlatList
                    data={EMOJIS}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.emojiOption,
                          selectedEmoji === item && styles.emojiSelected,
                          selectedEmoji === item && { borderColor: accentColor },
                        ]}
                        onPress={() => {
                          setSelectedEmoji(item);
                          setShowEmojiPicker(false);
                        }}
                      >
                        <Text style={styles.emojiOptionText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    numColumns={5}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false}
                  />
                </View>
              )}
            </View>

            {/* Task Title */}
            <View style={styles.section}>
              <Text style={styles.label}>Task Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter task name"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#999"
              />
            </View>

            {/* Duration */}
            <View style={styles.section}>
              <Text style={styles.label}>Duration (minutes)</Text>
              <TextInput
                style={styles.input}
                placeholder="15"
                value={duration}
                onChangeText={setDuration}
                keyboardType="number-pad"
                placeholderTextColor="#999"
              />
            </View>

            {/* Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: accentColor }]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  {task ? 'Update Task' : 'Add Task'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
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
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    gap: 16,
  },
  section: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  emojiButton: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiDisplay: {
    fontSize: 48,
  },
  emojiGrid: {
    paddingVertical: 8,
  },
  emojiOption: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#f0f0f0',
  },
  emojiSelected: {
    backgroundColor: '#e0e0e0',
  },
  emojiOptionText: {
    fontSize: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#e5e5e5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
