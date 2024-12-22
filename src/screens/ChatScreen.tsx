import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { WelcomePrompt } from '../components/WelcomePrompt';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { ChatInput } from '../components/ChatInput';
import { ChatMessage } from '../components/ChatMessage';
import { useChatContext } from '../context/ChatContext';

const ChatScreen: React.FC = () => {
  const { colors } = useTheme();
  const { 
    currentConversation, 
    sendMessage, 
    isLoading,
    createNewConversation 
  } = useChatContext();

  const handleInitialMessage = async (message: string) => {
    await createNewConversation();
    await sendMessage(message);
  };

  const handleVoiceRecordingComplete = (text: string) => {
    if (text) {
      if (!currentConversation) {
        handleInitialMessage(text);
      } else {
        sendMessage(text);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!currentConversation ? (
        <WelcomePrompt onSendMessage={handleInitialMessage} />
      ) : (
        <>
          <ScrollView 
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
            {currentConversation.messages.map((message) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                isUser={message.role === 'user'}
                timestamp={message.timestamp}
              />
            ))}
          </ScrollView>
          
          <View style={styles.bottomContainer}>
            <ChatInput onSend={sendMessage} isLoading={isLoading} />
            <VoiceRecorder onRecordingComplete={handleVoiceRecordingComplete} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 8,
    flexGrow: 1,
  },
  bottomContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#343541',
    borderTopWidth: 1,
    borderTopColor: '#2a2b32',
    minHeight: 60,
  },
});

export default ChatScreen;
