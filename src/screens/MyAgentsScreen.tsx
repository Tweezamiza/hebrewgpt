import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Assistant {
  id: string;
  name: string;
  instructions: string;
  model: string;
  createdAt: number;
}

export const MyAgentsScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  // This will be replaced with actual data from AssistantContext
  const mockAgents: Assistant[] = [
    {
      id: '1',
      name: 'עוזר כללי',
      instructions: 'עוזר כללי שעונה בעברית',
      model: 'gpt-4',
      createdAt: Date.now(),
    },
  ];

  const handleAgentPress = (agent: Assistant) => {
    // We'll implement this when we create the AssistantContext
    console.log('Selected agent:', agent);
  };

  const handleDeleteAgent = (agentId: string) => {
    Alert.alert(
      'מחיקת עוזר',
      'האם אתה בט��ח שברצונך למחוק את העוזר?',
      [
        {
          text: 'ביטול',
          style: 'cancel',
        },
        {
          text: 'מחק',
          style: 'destructive',
          onPress: () => {
            // We'll implement this when we create the AssistantContext
            console.log('Deleting agent:', agentId);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {mockAgents.map((agent) => (
          <TouchableOpacity
            key={agent.id}
            style={[styles.agentCard, { backgroundColor: colors.card }]}
            onPress={() => handleAgentPress(agent)}
          >
            <View style={styles.agentInfo}>
              <Text style={[styles.agentName, { color: colors.text }]}>{agent.name}</Text>
              <Text style={[styles.agentModel, { color: colors.text + '80' }]}>{agent.model}</Text>
              <Text 
                style={[styles.agentInstructions, { color: colors.text }]} 
                numberOfLines={2}
              >
                {agent.instructions}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteAgent(agent.id)}
            >
              <MaterialIcons name="delete-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('CreateAssistant' as never)}
      >
        <MaterialIcons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  agentCard: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'right',
  },
  agentModel: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'right',
  },
  agentInstructions: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'right',
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    left: 16, // Changed from right to left for RTL
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 