import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Assistant {
  id: string;
  name: string;
  instructions: string;
  model: string;
  createdAt: number;
}

interface AssistantContextType {
  assistants: Assistant[];
  currentAssistant: Assistant | null;
  createAssistant: (assistant: Omit<Assistant, 'id' | 'createdAt'>) => Promise<void>;
  deleteAssistant: (id: string) => Promise<void>;
  selectAssistant: (id: string) => void;
}

const AssistantContext = createContext<AssistantContextType | null>(null);

export const useAssistantContext = () => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistantContext must be used within an AssistantProvider');
  }
  return context;
};

const STORAGE_KEY = 'assistants';
const CURRENT_ASSISTANT_KEY = 'currentAssistant';

const defaultAssistant: Assistant = {
  id: 'default',
  name: 'עוזר כללי',
  instructions: 'עוזר כללי שעונה בעברית',
  model: 'gpt-4',
  createdAt: Date.now(),
};

export const AssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assistants, setAssistants] = useState<Assistant[]>([defaultAssistant]);
  const [currentAssistant, setCurrentAssistant] = useState<Assistant | null>(defaultAssistant);

  useEffect(() => {
    loadAssistants();
    loadCurrentAssistant();
  }, []);

  const loadAssistants = useCallback(async () => {
    try {
      const savedAssistants = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedAssistants) {
        setAssistants(JSON.parse(savedAssistants));
      }
    } catch (error) {
      console.error('Error loading assistants:', error);
    }
  }, []);

  const loadCurrentAssistant = useCallback(async () => {
    try {
      const savedCurrentAssistant = await AsyncStorage.getItem(CURRENT_ASSISTANT_KEY);
      if (savedCurrentAssistant) {
        setCurrentAssistant(JSON.parse(savedCurrentAssistant));
      }
    } catch (error) {
      console.error('Error loading current assistant:', error);
    }
  }, []);

  const saveAssistants = useCallback(async (newAssistants: Assistant[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAssistants));
    } catch (error) {
      console.error('Error saving assistants:', error);
    }
  }, []);

  const saveCurrentAssistant = useCallback(async (assistant: Assistant | null) => {
    try {
      if (assistant) {
        await AsyncStorage.setItem(CURRENT_ASSISTANT_KEY, JSON.stringify(assistant));
      } else {
        await AsyncStorage.removeItem(CURRENT_ASSISTANT_KEY);
      }
    } catch (error) {
      console.error('Error saving current assistant:', error);
    }
  }, []);

  const createAssistant = useCallback(async (assistantData: Omit<Assistant, 'id' | 'createdAt'>) => {
    const newAssistant: Assistant = {
      ...assistantData,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };

    setAssistants(prev => {
      const updated = [...prev, newAssistant];
      saveAssistants(updated);
      return updated;
    });
  }, [saveAssistants]);

  const deleteAssistant = useCallback(async (id: string) => {
    if (id === 'default') return; // Prevent deleting default assistant

    setAssistants(prev => {
      const updated = prev.filter(a => a.id !== id);
      saveAssistants(updated);
      return updated;
    });

    if (currentAssistant?.id === id) {
      setCurrentAssistant(defaultAssistant);
      saveCurrentAssistant(defaultAssistant);
    }
  }, [currentAssistant, saveAssistants, saveCurrentAssistant]);

  const selectAssistant = useCallback((id: string) => {
    const assistant = assistants.find(a => a.id === id);
    if (assistant) {
      setCurrentAssistant(assistant);
      saveCurrentAssistant(assistant);
    }
  }, [assistants, saveCurrentAssistant]);

  const value = {
    assistants,
    currentAssistant,
    createAssistant,
    deleteAssistant,
    selectAssistant,
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}; 