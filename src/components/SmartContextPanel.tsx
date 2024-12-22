import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

const PANEL_WIDTH = Math.min(350, Dimensions.get('window').width * 0.8);

interface Tool {
  id: string;
  name: string;
  icon: string;
  onPress: () => void;
}

interface SuggestedQuestion {
  id: string;
  text: string;
}

export const SmartContextPanel: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const { colors } = useTheme();
  const translateX = useSharedValue(PANEL_WIDTH);

  React.useEffect(() => {
    translateX.value = withSpring(isVisible ? 0 : PANEL_WIDTH, {
      damping: 20,
      stiffness: 90,
    });
  }, [isVisible]);

  const quickTools: Tool[] = [
    { id: '1', name: 'מחשבון', icon: 'calculator', onPress: () => {} },
    { id: '2', name: 'מתרגם', icon: 'translate', onPress: () => {} },
    { id: '3', name: 'לוח', icon: 'clipboard-outline', onPress: () => {} },
  ];

  const suggestedQuestions: SuggestedQuestion[] = [
    { id: '1', text: 'תוכל להרחיב על הנושא?' },
    { id: '2', text: 'איך זה עובד בפועל?' },
    { id: '3', text: 'מה ההשלכות של זה?' },
  ];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );

  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: colors.card },
        animatedStyle,
      ]}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderSection('כלים מהירים', (
          <View style={styles.toolsGrid}>
            {quickTools.map((tool) => (
              <TouchableOpacity
                key={tool.id}
                style={[styles.toolButton, { backgroundColor: colors.primary + '20' }]}
                onPress={tool.onPress}
              >
                <MaterialCommunityIcons
                  name={tool.icon as any}
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.toolName, { color: colors.text }]}>
                  {tool.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {renderSection('הקשר פעיל', (
          <View style={[styles.contextBox, { backgroundColor: colors.background }]}>
            <Text style={[styles.contextText, { color: colors.text }]}>
              מדברים על: בינה מלאכותית
            </Text>
            <Text style={[styles.memoryText, { color: colors.text + '80' }]}>
              זיכרון: 4 הודעות אחרונות
            </Text>
          </View>
        ))}

        {renderSection('שאלות המשך מוצעות', (
          <View style={styles.suggestedQuestions}>
            {suggestedQuestions.map((question) => (
              <TouchableOpacity
                key={question.id}
                style={[styles.questionButton, { backgroundColor: colors.background }]}
              >
                <MaterialCommunityIcons
                  name="lightbulb-outline"
                  size={20}
                  color={colors.primary}
                  style={styles.questionIcon}
                />
                <Text 
                  style={[styles.questionText, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {question.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {renderSection('קבצים מצורפים', (
          <View style={[styles.attachmentsBox, { backgroundColor: colors.background }]}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={24}
              color={colors.text + '60'}
            />
            <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
              אין קבצים מצורפים
            </Text>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: PANEL_WIDTH,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'right',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    minWidth: 100,
    flex: 1,
  },
  toolName: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  contextBox: {
    padding: 12,
    borderRadius: 12,
  },
  contextText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
  memoryText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  suggestedQuestions: {
    gap: 8,
  },
  questionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  questionIcon: {
    marginLeft: 8,
  },
  questionText: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  attachmentsBox: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
  },
}); 