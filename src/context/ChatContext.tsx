import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OpenAI from 'openai';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  darkMode: boolean;
  model: 'gpt-4o' | 'gpt-4o-mini' | 'o1-preview' | 'o1-mini' | 'gpt-4' | 'gpt-4-32k' | 'gpt-4-1106-preview' | 'gpt-4-vision-preview' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-16k';
  voiceInput: boolean;
  voiceOutput: boolean;
  pushNotifications: boolean;
  haptics: boolean;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  settings: Settings;
  isLoading: boolean;
  createNewConversation: () => void;
  selectConversation: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  updateSettings: (newSettings: Partial<Settings>) => void;
  deleteConversation: (id: string) => Promise<void>;
}

const defaultSettings: Settings = {
  darkMode: true,
  model: 'gpt-4o',
  voiceInput: false,
  voiceOutput: false,
  pushNotifications: true,
  haptics: true,
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt: 'אתה עוזר מועיל שמדבר עברית רהוטה. אתה עונה בעברית בלבד, אלא אם כן מתבקש אחרת.',
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  const openai = useMemo(() => {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key is not configured');
      return null;
    }
    return new OpenAI({ 
      apiKey,
      dangerouslyAllowBrowser: true // Enable browser usage
    });
  }, []);

  useEffect(() => {
    loadSettings();
    loadConversations();
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('settings');
      if (savedSettings) {
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const savedConversations = await AsyncStorage.getItem('conversations');
      if (savedConversations) {
        setConversations(JSON.parse(savedConversations));
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }, []);

  const saveConversations = useCallback(async (newConversations: Conversation[]) => {
    try {
      await AsyncStorage.setItem('conversations', JSON.stringify(newConversations));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  }, []);

  const saveSettings = useCallback(async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  }, []);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'שיח חדשה',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setConversations(prev => {
      const updated = [newConversation, ...prev];
      saveConversations(updated).catch(console.error);
      return updated;
    });
    setCurrentConversationId(newConversation.id);
  }, []);

  const selectConversation = useCallback((id: string) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setCurrentConversationId(id);
    } else {
      console.error('Conversation not found:', id);
    }
  }, [conversations]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !openai) return;

    setIsLoading(true);
    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };

      // If no current conversation, create one
      if (!currentConversationId) {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          messages: [userMessage],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        setConversations(prev => {
          const updated = [newConversation, ...prev];
          saveConversations(updated).catch(console.error);
          return updated;
        });
        setCurrentConversationId(newConversation.id);
        
        // Get AI response for the new conversation
        const response = await openai.chat.completions.create({
          model: settings.model,
          messages: [
            { role: 'system', content: settings.systemPrompt },
            { role: 'user', content: content.trim() },
          ],
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
        });

        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: response.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
          timestamp: Date.now(),
        };

        setConversations(prev => {
          const updated = prev.map(conv => {
            if (conv.id === newConversation.id) {
              return {
                ...conv,
                messages: [...conv.messages, assistantMessage],
                updatedAt: Date.now(),
              };
            }
            return conv;
          });
          saveConversations(updated).catch(console.error);
          return updated;
        });
        
        return;
      }

      // Handle message in existing conversation
      setConversations(prev => {
        const updated = prev.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, userMessage],
              updatedAt: Date.now(),
            };
          }
          return conv;
        });
        saveConversations(updated).catch(console.error);
        return updated;
      });

      const currentConv = conversations.find(conv => conv.id === currentConversationId);
      if (!currentConv) return;

      const response = await openai.chat.completions.create({
        model: settings.model,
        messages: [
          { role: 'system', content: settings.systemPrompt },
          ...currentConv.messages.map(m => ({
            role: m.role as any,
            content: m.content,
          })),
          { role: 'user', content: content.trim() },
        ],
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
      });

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
        timestamp: Date.now(),
      };

      setConversations(prev => {
        const updated = prev.map(conv => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, assistantMessage],
              updatedAt: Date.now(),
            };
          }
          return conv;
        });
        saveConversations(updated).catch(console.error);
        return updated;
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, settings, openai, conversations]);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await saveSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw new Error('Failed to update settings');
    }
  }, [settings, saveSettings]);

  const deleteConversation = useCallback(async (id: string) => {
    console.log('ChatContext: Delete called with ID:', id);
    console.log('ChatContext: Current conversations:', conversations);
    console.log('ChatContext: Current conversation ID:', currentConversationId);
    
    if (!id) {
      console.error('No ID provided for deletion');
      return;
    }

    try {
      // Update state immediately
      const newConversations = conversations.filter(conv => conv.id !== id);
      console.log('ChatContext: Filtered conversations:', newConversations);
      
      setConversations(newConversations);
      console.log('ChatContext: State updated with new conversations');
      
      if (currentConversationId === id) {
        console.log('ChatContext: Clearing current conversation ID');
        setCurrentConversationId(null);
      }

      // Save to storage
      await AsyncStorage.setItem('conversations', JSON.stringify(newConversations));
      console.log('ChatContext: Successfully saved to storage');
      
      return Promise.resolve();
    } catch (error) {
      console.error('ChatContext: Delete operation failed:', error);
      return Promise.reject(error);
    }
  }, [conversations, currentConversationId]);

  // Add debug log for conversations changes
  useEffect(() => {
    console.log('ChatContext: Conversations updated:', conversations);
  }, [conversations]);

  // Add debug log for current conversation changes
  useEffect(() => {
    console.log('ChatContext: Current conversation ID updated:', currentConversationId);
  }, [currentConversationId]);

  const currentConversation = useMemo(() => 
    conversations.find(conv => conv.id === currentConversationId) || null
  , [conversations, currentConversationId]);

  const value = useMemo(() => ({
    conversations,
    currentConversation: currentConversationId 
      ? conversations.find(conv => conv.id === currentConversationId) || null
      : null,
    settings,
    isLoading,
    createNewConversation,
    selectConversation,
    sendMessage,
    updateSettings,
    deleteConversation,
  }), [
    conversations,
    currentConversationId,
    settings,
    isLoading,
    createNewConversation,
    selectConversation,
    sendMessage,
    updateSettings,
    deleteConversation,
  ]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
