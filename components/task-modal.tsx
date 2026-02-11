import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Task } from '@/lib/types';

interface TaskModalProps {
  visible: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  accentColor: string;
}

const EMOJI_OPTIONS = ['📝', '💼', '🎯', '📚', '💪', '🎨', '🍳', '🧘', '📱', '✉️', '🏃', '🎵'];

export function TaskModal({ visible, task, onClose, onSave, accentColor }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [duration, setDuration] = useState(task?.plannedDuration?.toString() || '15');
  const [emoji, setEmoji] = useState(task?.emoji || '📝');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }

    const plannedDuration = parseInt(duration) || 15;

    onSave({
      title: title.trim(),
      plannedDuration,
      emoji,
    });

    // Reset form
    setTitle('');
    setDuration('15');
    setEmoji('📝');
    setShowEmojiPicker(false);
  };

  const handleClose = () => {
    setTitle('');
    setDuration('15');
    setEmoji('📝');
    setShowEmojiPicker(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{task ? 'Edit Task' : 'New Task'}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Emoji</Text>
              <TouchableOpacity
                style={[styles.emojiButton, { borderColor: accentColor }]}
                onPress={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Text style={styles.selectedEmoji}>{emoji}</Text>
              </TouchableOpacity>

              {showEmojiPicker && (
                <View style={styles.emojiPicker}>
                  {EMOJI_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.emojiOption,
                        emoji === option && { backgroundColor: '#f0f0f0' },
                      ]}
                      onPress={() => {
                        setEmoji(option);
                        setShowEmojiPicker(false);
                      }}
                    >
                      <Text style={styles.emojiOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Task Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter task name"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.formGroup}>
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
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: accentColor }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>
                {task ? 'Update Task' : 'Create Task'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  emojiButton: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedEmoji: {
    fontSize: 40,
  },
  emojiPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  emojiOption: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  emojiOptionText: {
    fontSize: 32,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
