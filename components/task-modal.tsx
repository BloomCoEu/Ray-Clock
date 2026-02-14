import { useState, useEffect } from 'react';
import {
  Modal,
  ScrollView,
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
  const [description, setDescription] = useState(task?.description || '');
  const [duration, setDuration] = useState(task?.plannedDuration?.toString() || '15');
  const [emoji, setEmoji] = useState(task?.emoji || '📝');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; duration?: string }>({});

  // Update form when task prop changes
  useEffect(() => {
    if (visible) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setDuration(task.plannedDuration?.toString() || '15');
        setEmoji(task.emoji || '📝');
      } else {
        setTitle('');
        setDescription('');
        setDuration('15');
        setEmoji('📝');
      }
      setShowEmojiPicker(false);
      setErrors({});
    }
  }, [task, visible]);

  const handleSave = () => {
    // Validate inputs
    const newErrors: { title?: string; duration?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Task name is required';
    }

    const parsedDuration = parseInt(duration);
    if (!duration || isNaN(parsedDuration) || parsedDuration <= 0) {
      newErrors.duration = 'Duration must be a positive number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const plannedDuration = parsedDuration || 15;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      plannedDuration,
      emoji,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDuration('15');
    setEmoji('📝');
    setShowEmojiPicker(false);
    setErrors({});
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDuration('15');
    setEmoji('📝');
    setShowEmojiPicker(false);
    setErrors({});
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
                  onChangeText={(text) => {
                    setTitle(text);
                    if (errors.title) setErrors({ ...errors, title: undefined });
                  }}
                  borderColor={errors.title ? '$red9' : '$gray5'}
                  borderWidth={1}
                />
                {errors.title && (
                  <Text fontSize="$2" color="$red9">{errors.title}</Text>
                )}
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600">Description (optional)</Text>
                <Input
                  size="$4"
                  placeholder="Add more details about the task"
                  value={description}
                  onChangeText={setDescription}
                  borderColor="$gray5"
                  borderWidth={1}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  maxLength={1000}
                />
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600">Duration (minutes)</Text>
                <Input
                  size="$4"
                  placeholder="15"
                  value={duration}
                  onChangeText={(text) => {
                    setDuration(text);
                    if (errors.duration) setErrors({ ...errors, duration: undefined });
                  }}
                  keyboardType="number-pad"
                  borderColor={errors.duration ? '$red9' : '$gray5'}
                  borderWidth={1}
                />
                {errors.duration && (
                  <Text fontSize="$2" color="$red9">{errors.duration}</Text>
                )}
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
            >
              <Text color="white" fontWeight="600" fontSize="$5">
                {task ? 'Update Task' : 'Create Task'}
              </Text>
            </Button>
          </YStack>
        </YStack>
      </YStack>
    </Modal>
  );
}
