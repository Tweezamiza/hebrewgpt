import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  useSharedValue,
} from 'react-native-reanimated';
import { useChatContext } from '../context/ChatContext';
import { startRecording, stopRecording, hapticFeedback } from '../services/feedback';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);
  const { settings } = useChatContext();

  // Animation values
  const scale = useSharedValue(1);
  const recordingScale = useSharedValue(1);
  const recordingOpacity = useSharedValue(1);

  const handleSend = async () => {
    if (message.trim() === '' || isLoading) return;
    
    try {
      await hapticFeedback('success');
      scale.value = withSequence(
        withSpring(0.9),
        withSpring(1)
      );
      
      onSend(message);
      setMessage('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error sending message:', error);
      await hapticFeedback('error');
    }
  };

  const handleVoiceStart = async () => {
    try {
      setRecordingError(null);
      await hapticFeedback('light');
      setIsRecording(true);
      await startRecording();
      
      // Start recording animation
      recordingScale.value = withSpring(1.2);
      recordingOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    } catch (error) {
      console.error('Failed to start recording:', error);
      setRecordingError('Failed to start recording');
      await hapticFeedback('error');
      setIsRecording(false);
    }
  };

  const handleVoiceEnd = async () => {
    if (!isRecording) return;
    
    try {
      const audioUri = await stopRecording();
      setIsRecording(false);
      
      // Reset animation
      recordingScale.value = withSpring(1);
      recordingOpacity.value = withTiming(1);
      
      // Here you would typically send the audio to a speech-to-text service
      // For now, we'll just show a placeholder message
      setMessage('הקלטה הושלמה...');
      
      await hapticFeedback('success');
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setRecordingError('Failed to stop recording');
      await hapticFeedback('error');
    } finally {
      setIsRecording(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const recordingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recordingScale.value }],
    opacity: recordingOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {settings.voiceInput && (
        <Animated.View style={[styles.voiceButtonContainer, recordingAnimatedStyle]}>
          <TouchableOpacity
            style={[
              styles.voiceButton,
              isRecording && styles.voiceButtonRecording,
              recordingError && styles.voiceButtonError,
            ]}
            onPressIn={handleVoiceStart}
            onPressOut={handleVoiceEnd}
            disabled={isLoading}
          >
            <MaterialIcons
              name={isRecording ? 'mic' : 'mic-none'}
              size={24}
              color={recordingError ? '#ff4444' : '#fff'}
            />
          </TouchableOpacity>
        </Animated.View>
      )}
      
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="הקלד הודעה..."
        placeholderTextColor="#666"
        multiline
        maxLength={1000}
        textAlign="right"
        textAlignVertical="center"
        editable={!isLoading}
      />
      
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={[styles.sendButton, (!message.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <MaterialIcons name="send" size={24} color="#fff" style={{ transform: [{ scaleX: -1 }] }} />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#343541',
    borderTopWidth: 1,
    borderTopColor: '#2a2b32',
    flex: 1,
  },
  voiceButtonContainer: {
    marginLeft: 8,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#19C37D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonRecording: {
    backgroundColor: '#ff4444',
  },
  voiceButtonError: {
    backgroundColor: '#662222',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#40414f',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 8,
    textAlign: 'right',
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#19C37D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#2a2b32',
  },
});
