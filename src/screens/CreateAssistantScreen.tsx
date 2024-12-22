import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useChatContext } from '../context/ChatContext';

interface Assistant {
  id: string;
  name: string;
  instructions: string;
  model: string;
  createdAt: number;
}

export const CreateAssistantScreen: React.FC = () => {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const { settings, updateSettings } = useChatContext();

  const handleSave = async () => {
    const newAssistant: Assistant = {
      id: Date.now().toString(),
      name,
      instructions,
      model: settings.model,
      createdAt: Date.now(),
    };

    // We'll implement the save functionality when we create the AssistantContext
    console.log('Saving assistant:', newAssistant);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>שם העוזר</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              value={name}
              onChangeText={setName}
              placeholder="הכנס שם לעוזר..."
              placeholderTextColor={colors.text + '80'}
              textAlign="right"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>הוראות והנחיות</Text>
            <TextInput
              style={[styles.instructionsInput, { backgroundColor: colors.card, color: colors.text }]}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="הכנס הוראות והנחיות לעוזר..."
              placeholderTextColor={colors.text + '80'}
              multiline
              textAlign="right"
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <MaterialIcons name="save" size={24} color="#fff" />
            <Text style={styles.saveButtonText}>שמור עוזר</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  instructionsInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    minHeight: 200,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 