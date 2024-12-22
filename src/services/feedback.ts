import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const speak = async (text: string, options = {}) => {
  try {
    if (isWeb) {
      // Use Web Speech API for web
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      utterance.pitch = 1;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      return;
    }

    const defaultOptions = {
      language: 'he-IL',
      pitch: 1,
      rate: 0.9,
    };

    await Speech.speak(text, {
      ...defaultOptions,
      ...options,
    });
  } catch (error) {
    console.error('Error speaking text:', error);
  }
};

export const stopSpeaking = async () => {
  try {
    if (isWeb) {
      window.speechSynthesis.cancel();
      return;
    }
    await Speech.stop();
  } catch (error) {
    console.error('Error stopping speech:', error);
  }
};

export const hapticFeedback = async (type: 'success' | 'error' | 'light' = 'light') => {
  try {
    if (isWeb) {
      // Skip haptics on web
      return;
    }

    switch (type) {
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'light':
      default:
        await Haptics.selectionAsync();
        break;
    }
  } catch (error) {
    console.error('Error providing haptic feedback:', error);
  }
};

let recording: Audio.Recording | null = null;

export const startRecording = async (): Promise<void> => {
  try {
    if (isWeb) {
      throw new Error('Recording not supported on web');
    }

    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await recording.startAsync();
  } catch (error) {
    console.error('Error starting recording:', error);
    throw error;
  }
};

export const stopRecording = async (): Promise<string> => {
  try {
    if (isWeb) {
      throw new Error('Recording not supported on web');
    }

    if (!recording) {
      throw new Error('No recording in progress');
    }

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    recording = null;

    if (!uri) {
      throw new Error('No recording URI available');
    }

    return uri;
  } catch (error) {
    console.error('Error stopping recording:', error);
    throw error;
  }
};
