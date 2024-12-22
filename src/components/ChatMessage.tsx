import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { speak, stopSpeaking, hapticFeedback } from '../services/feedback';
import { useChatContext } from '../context/ChatContext';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: number;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  isUser,
  timestamp,
}) => {
  const { settings } = useChatContext();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    scale.value = withSequence(
      withDelay(100, withSpring(1.05, { damping: 12 })),
      withSpring(1, { damping: 15 })
    );
    opacity.value = withDelay(
      50,
      withSpring(1, { damping: 20 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = async () => {
    if (!settings.voiceOutput || isSpeaking) return;
    
    try {
      await hapticFeedback('light');
      setIsSpeaking(true);
      await speak(content);
    } catch (error) {
      console.error('Error speaking message:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleLongPress = async () => {
    try {
      await hapticFeedback('light');
      await stopSpeaking();
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };

  const messageTime = useMemo(() => {
    return new Date(timestamp).toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [timestamp]);

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
        animatedStyle,
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
      disabled={!settings.voiceOutput}
    >
      <View style={styles.messageContent}>
        <Text style={[
          styles.text,
          isUser ? styles.userText : styles.botText,
        ]}>
          {content}
        </Text>
        <View style={styles.footer}>
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.botTimestamp,
          ]}>
            {messageTime}
          </Text>
          {settings.voiceOutput && (
            <MaterialIcons
              name={isSpeaking ? "volume-up" : "volume-mute"}
              size={16}
              color={isUser ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.5)"}
              style={styles.icon}
            />
          )}
        </View>
      </View>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 16,
    elevation: 1,
  },
  userContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#19C37D',
  },
  botContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#40414f',
  },
  messageContent: {
    padding: 12,
    minWidth: 80,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'right',
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  botTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  icon: {
    marginRight: 4,
  },
});
