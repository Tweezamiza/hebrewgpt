import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const HistoryScreen: React.FC = () => {
  const { colors } = useTheme();

  // This will be replaced with actual data later
  const mockHistory = [
    {
      id: '1',
      title: 'שיחה על טכנולוגיה',
      date: 'היום, 14:30',
      preview: 'דיון על התפתחויות טכנולוגיות חדשות',
      agent: 'עוזר כללי',
    },
    {
      id: '2',
      title: 'עזרה בכתיבת קוד',
      date: 'אתמול, 18:20',
      preview: 'פתרון בעיות בפייתון ו-JavaScript',
      agent: 'מתכנת',
    },
  ];

  const renderHistoryItem = (item: typeof mockHistory[0]) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.historyCard, { backgroundColor: colors.card }]}
      onPress={() => {}}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.cardDate, { color: colors.text + '80' }]}>
            {item.date}
          </Text>
        </View>
        <Text style={[styles.cardAgent, { color: colors.primary }]}>
          {item.agent}
        </Text>
        <Text 
          style={[styles.cardPreview, { color: colors.text }]}
          numberOfLines={2}
        >
          {item.preview}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {mockHistory.length > 0 ? (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text + '80' }]}>
                היום
              </Text>
              {mockHistory
                .filter(item => item.date.includes('היום'))
                .map(renderHistoryItem)}
            </View>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text + '80' }]}>
                אתמול
              </Text>
              {mockHistory
                .filter(item => item.date.includes('אתמול'))
                .map(renderHistoryItem)}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="history"
              size={48}
              color={colors.text + '40'}
            />
            <Text style={[styles.emptyStateText, { color: colors.text + '80' }]}>
              אין היסטוריית שיחות
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.text + '60' }]}>
              השיחות שלך יופיעו כאן
            </Text>
          </View>
        )}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 8,
    textAlign: 'right',
  },
  historyCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  cardDate: {
    fontSize: 12,
    marginLeft: 8,
    textAlign: 'left',
  },
  cardAgent: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'right',
  },
  cardPreview: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'right',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
}); 