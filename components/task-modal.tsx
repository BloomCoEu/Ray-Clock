import { useState } from 'react';
import {
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { YStack, XStack, Text, Button, Input } from 'tamagui';
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
      <YStack flex={1} justifyContent="flex-end" backgroundColor="rgba(0, 0, 0, 0.5)">
        <YStack backgroundColor="white" borderTopLeftRadius="$5" borderTopRightRadius="$5" maxHeight="80%">
          <XStack
            justifyContent="space-between"
            alignItems="center"
            paddingHorizontal="$5"
            paddingTop="$5"
            paddingBottom="$4"
            borderBottomWidth={1}
            borderBottomColor="$gray5"
          >
            <Text fontSize="$8" fontWeight="700">{task ? 'Edit Task' : 'New Task'}</Text>
            <Button
              size="$3"
              circular
              backgroundColor="transparent"
              onPress={handleClose}
              icon={<Ionicons name="close" size={28} color="#000" />}
            />
          </XStack>

          <ScrollView style={{ flex: 1 }}>
            <YStack paddingHorizontal="$5" paddingVertical="$4" gap="$5">
              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600">Emoji</Text>
                <Button
                  size="$5"
                  borderWidth={2}
                  borderColor={accentColor}
                  backgroundColor="transparent"
                  onPress={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Text fontSize={40}>{emoji}</Text>
                </Button>

                {showEmojiPicker && (
                  <XStack flexWrap="wrap" gap="$2" marginTop="$3" padding="$2" backgroundColor="$gray2" borderRadius="$3">
                    {EMOJI_OPTIONS.map((option) => (
                      <Button
                        key={option}
                        size="$5"
                        width={60}
                        height={60}
                        backgroundColor={emoji === option ? '$gray4' : 'transparent'}
                        onPress={() => {
                          setEmoji(option);
                          setShowEmojiPicker(false);
                        }}
                      >
                        <Text fontSize={32}>{option}</Text>
                      </Button>
                    ))}
                  </XStack>
                )}
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600">Task Name</Text>
                <Input
                  size="$4"
                  placeholder="Enter task name"
                  value={title}
                  onChangeText={setTitle}
                  borderColor="$gray5"
                  borderWidth={1}
                />
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600">Duration (minutes)</Text>
                <Input
                  size="$4"
                  placeholder="15"
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="number-pad"
                  borderColor="$gray5"
                  borderWidth={1}
                />
              </YStack>
            </YStack>
          </ScrollView>

          <YStack
            paddingHorizontal="$5"
            paddingVertical="$4"
            borderTopWidth={1}
            borderTopColor="$gray5"
          >
            <Button
              size="$5"
              backgroundColor={accentColor}
              onPress={handleSave}
              fontWeight="600"
              fontSize="$5"
            >
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </YStack>
        </YStack>
      </YStack>
    </Modal>
  );
}
