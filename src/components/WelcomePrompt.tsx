import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Logo } from './Logo';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface WelcomePromptProps {
  onSendMessage?: (message: string) => void;
}

export const WelcomePrompt: React.FC<WelcomePromptProps> = ({ onSendMessage }) => {
  const { colors } = useTheme();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'image',
      title: 'צור תמונה',
      icon: 'image-plus',
      color: '#10b981',
      onPress: () => setMessage('אנא צור תמונה של...'),
    },
    {
      id: 'code',
      title: 'כתוב קוד',
      icon: 'code-braces',
      color: '#6366f1',
      onPress: () => setMessage('אנא כתוב קוד ל...'),
    },
    {
      id: 'write',
      title: 'עזור בכתיבה',
      icon: 'pencil-outline',
      color: '#8b5cf6',
      onPress: () => setMessage('אנא עזור לי לכתוב...'),
    },
    {
      id: 'summarize',
      title: 'תקציר טקסט',
      icon: 'text-box-check-outline',
      color: '#f59e0b',
      onPress: () => setMessage('אנא תקצר את הטקסט הבא...'),
    },
    {
      id: 'brainstorm',
      title: 'סיעור מוחות',
      icon: 'lightbulb-outline',
      color: '#ec4899',
      onPress: () => setMessage('בוא נעשה סיעור מוחות על...'),
    },
  ];

  const handleSend = async () => {
    if (!message.trim() || !onSendMessage) return;
    
    try {
      setIsLoading(true);
      await onSendMessage(message.trim());
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Logo size={120} />
        <Text style={[styles.title, { color: colors.text }]}>
          ברוכים הבאים ל-HebrewGPT
        </Text>
        <Text style={[styles.subtitle, { color: colors.text + '99' }]}>
          העוזר האישי שלך בעברית
        </Text>
      </View>

      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSend}
          disabled={!message.trim() || isLoading}
        >
          <MaterialCommunityIcons 
            name="send" 
            size={24} 
            color="#fff"
            style={{ transform: [{ rotate: '180deg' }] }}
          />
        </TouchableOpacity>
        
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={message}
          onChangeText={setMessage}
          placeholder="שאל אותי כל דבר..."
          placeholderTextColor={colors.text + '80'}
          multiline
          textAlign="right"
          onSubmitEditing={handleSend}
        />
      </View>

      <View style={styles.quickActions}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.actionButton,
              { backgroundColor: colors.card }
            ]}
            onPress={action.onPress}
          >
            <MaterialCommunityIcons
              name={action.icon as any}
              size={22}
              color={action.color}
              style={styles.actionIcon}
            />
            <Text style={[styles.actionText, { color: colors.text }]}>
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.disclaimer, { color: colors.text + '60' }]}>
        HebrewGPT עלול לטעות. בדוק מידע חשוב.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25,
    width: '100%',
    maxWidth: 500,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    marginBottom: 32,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: SCREEN_WIDTH > 650 ? 650 : SCREEN_WIDTH - 32,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    minWidth: 140,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionIcon: {
    marginLeft: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  disclaimer: {
    fontSize: 12,
    marginTop: 32,
    textAlign: 'center',
  },
}); 