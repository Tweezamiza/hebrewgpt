import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface HelpSection {
  title: string;
  items: {
    id: string;
    title: string;
    icon: string;
    onPress: () => void;
  }[];
}

export const HelpScreen: React.FC = () => {
  const { colors } = useTheme();

  const helpSections: HelpSection[] = [
    {
      title: 'מדריכים',
      items: [
        {
          id: '1',
          title: 'איך להתחיל',
          icon: 'rocket-launch-outline',
          onPress: () => {},
        },
        {
          id: '2',
          title: 'יצירת עוזר מותאם אישית',
          icon: 'account-cog-outline',
          onPress: () => {},
        },
        {
          id: '3',
          title: 'טיפים לשיחה יעילה',
          icon: 'lightbulb-outline',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'תמיכה',
      items: [
        {
          id: '4',
          title: 'שאלות נפוצות',
          icon: 'frequently-asked-questions',
          onPress: () => {},
        },
        {
          id: '5',
          title: 'דווח על תקלה',
          icon: 'bug-outline',
          onPress: () => {},
        },
        {
          id: '6',
          title: 'צור קשר',
          icon: 'email-outline',
          onPress: () => {},
        },
      ],
    },
  ];

  const renderHelpItem = (item: HelpSection['items'][0]) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.helpCard, { backgroundColor: colors.card }]}
      onPress={item.onPress}
    >
      <MaterialCommunityIcons
        name={item.icon as any}
        size={24}
        color={colors.primary}
        style={styles.cardIcon}
      />
      <Text style={[styles.cardTitle, { color: colors.text }]}>
        {item.title}
      </Text>
      <MaterialCommunityIcons
        name="chevron-left"
        size={24}
        color={colors.text + '60'}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="help-circle-outline"
          size={48}
          color={colors.primary}
        />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          כיצד נוכל לעזור?
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.text + '80' }]}>
          בחר מהאפשרויות למטה או צור איתנו קשר
        </Text>
      </View>

      {helpSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text + '80' }]}>
            {section.title}
          </Text>
          {section.items.map(renderHelpItem)}
        </View>
      ))}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: colors.primary + '20' }]}
          onPress={() => Linking.openURL('https://hebrewgpt.com')}
        >
          <Text style={[styles.footerButtonText, { color: colors.primary }]}>
            בקר באתר שלנו
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
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
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  cardIcon: {
    marginLeft: 16,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  footer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  footerButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 