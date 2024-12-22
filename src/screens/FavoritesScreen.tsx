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

export const FavoritesScreen: React.FC = () => {
  const { colors } = useTheme();

  // This will be replaced with actual data later
  const mockFavorites = [
    {
      id: '1',
      title: 'שיחה על בינה מלאכותית',
      date: '12 בדצמבר, 2023',
      preview: 'דיון מעניין על השפעת הבינה המלאכותית על חיי היומיום',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {mockFavorites.length > 0 ? (
          mockFavorites.map((favorite) => (
            <TouchableOpacity
              key={favorite.id}
              style={[styles.favoriteCard, { backgroundColor: colors.card }]}
              onPress={() => {}}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {favorite.title}
                  </Text>
                  <MaterialCommunityIcons
                    name="star"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.cardDate, { color: colors.text + '80' }]}>
                  {favorite.date}
                </Text>
                <Text 
                  style={[styles.cardPreview, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {favorite.preview}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="star-outline"
              size={48}
              color={colors.text + '40'}
            />
            <Text style={[styles.emptyStateText, { color: colors.text + '80' }]}>
              אין שיחות מועדפות עדיין
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.text + '60' }]}>
              הוסף שיחות לרשימת המועדפים כדי למצוא אותן כאן
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
  favoriteCard: {
    marginHorizontal: 16,
    marginTop: 16,
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