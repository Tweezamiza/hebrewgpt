import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'completed';
  instructions: string;
}

export const AgentOrchestraScreen: React.FC = () => {
  const { colors } = useTheme();

  const mockAgents: Agent[] = [
    {
      id: '1',
      name: 'מנהל המשימות',
      role: 'ראשי',
      status: 'idle',
      instructions: 'אחראי על תיאום וניהול שאר הסוכנים',
    },
    {
      id: '2',
      name: 'חוקר מידע',
      role: 'מחקר',
      status: 'idle',
      instructions: 'אחראי על איסוף וניתוח מידע',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>תזמו��ת הסוכנים</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {mockAgents.map((agent) => (
          <TouchableOpacity
            key={agent.id}
            style={[styles.agentCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.agentHeader}>
              <Text style={[styles.agentName, { color: colors.text }]}>{agent.name}</Text>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: agent.status === 'idle' ? '#888' : '#4CAF50' }
              ]} />
            </View>
            
            <Text style={[styles.roleText, { color: colors.text + '80' }]}>
              תפקיד: {agent.role}
            </Text>
            
            <Text 
              style={[styles.instructionsText, { color: colors.text }]}
              numberOfLines={2}
            >
              {agent.instructions}
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="play" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="delete" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  roleText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'right',
  },
  instructionsText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
}); 