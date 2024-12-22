import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Switch, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useChatContext } from '../context/ChatContext';
import type { Settings } from '../context/ChatContext';
import Slider from '@react-native-community/slider';

type ModelType = 'gpt-4o' | 'gpt-4o-mini' | 'o1-preview' | 'o1-mini' | 'gpt-4' | 'gpt-4-32k' | 'gpt-4-1106-preview' | 'gpt-4-vision-preview' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-16k';

interface ModelSelectorProps {
  visible: boolean;
  onClose: () => void;
  currentModel: ModelType;
  onSelect: (model: ModelType) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ visible, onClose, currentModel, onSelect }) => {
  const { colors } = useTheme();
  const models = [
    { id: 'gpt-4o' as ModelType, name: 'GPT-4 Optimized', description: 'המודל המתקדם ביותר, מותאם במיוחד לעברית' },
    { id: 'gpt-4o-mini' as ModelType, name: 'GPT-4 Optimized Mini', description: 'גרסה קלה ומהירה של המודל המותאם לעברית' },
    { id: 'o1-preview' as ModelType, name: 'O1 Preview', description: 'מודל חדשני בגרסת תצוגה מוקדמת' },
    { id: 'o1-mini' as ModelType, name: 'O1 Mini', description: 'גרסה קלה של מודל O1' },
    { id: 'gpt-4' as ModelType, name: 'GPT-4', description: 'המודל החכם ביותר, מתאים למשימות מורכבות' },
    { id: 'gpt-4-32k' as ModelType, name: 'GPT-4 32K', description: 'גרסה עם זיכרון מורחב' },
    { id: 'gpt-4-1106-preview' as ModelType, name: 'GPT-4 Turbo', description: 'הגרסה המתקדמת ביותר של GPT-4' },
    { id: 'gpt-4-vision-preview' as ModelType, name: 'GPT-4 Vision', description: 'תומך בניתוח תמונות' },
    { id: 'gpt-3.5-turbo' as ModelType, name: 'GPT-3.5 Turbo', description: 'מהיר וחסכוני' },
    { id: 'gpt-3.5-turbo-16k' as ModelType, name: 'GPT-3.5 Turbo 16K', description: 'גרסה עם זיכרון מורחב' },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>בחר מודל</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {models.map((model) => (
            <Pressable
              key={model.id}
              style={[
                styles.modelItem,
                currentModel === model.id && styles.selectedModel
              ]}
              onPress={() => {
                onSelect(model.id);
                onClose();
              }}
            >
              <View>
                <Text style={[styles.modelName, { color: colors.text }]}>{model.name}</Text>
                <Text style={[styles.modelDescription, { color: colors.text }]}>{model.description}</Text>
              </View>
              {currentModel === model.id && (
                <MaterialIcons name="check" size={24} color={colors.primary} />
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

interface SettingItemProps {
  icon: string;
  title: string;
  value?: boolean | string | number;
  onPress?: (value?: any) => void;
  type?: 'toggle' | 'select' | 'button' | 'slider';
  description?: string;
  sliderProps?: any;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  icon, 
  title, 
  value, 
  onPress, 
  type = 'toggle',
  description,
  sliderProps,
}) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={type === 'toggle' || type === 'slider'}
    >
      <View style={styles.settingLeft}>
        <MaterialIcons name={icon as any} size={24} color={colors.text} style={styles.icon} />
        <View>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {description && (
            <Text style={[styles.settingDescription, { color: colors.text }]}>{description}</Text>
          )}
        </View>
      </View>
      {type === 'toggle' && (
        <Switch
          value={value as boolean}
          onValueChange={onPress}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
        />
      )}
      {type === 'select' && (
        <View style={styles.settingRight}>
          <Text style={[styles.settingValue, { color: colors.text }]}>{value}</Text>
          <MaterialIcons name="chevron-right" size={24} color={colors.text} />
        </View>
      )}
      {type === 'slider' && (
        <View style={styles.sliderContainer}>
          <Slider
            {...sliderProps}
            value={value as number}
            onValueChange={onPress}
            style={styles.slider}
          />
          <Text style={[styles.sliderValue, { color: colors.text }]}>
            {value}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

interface Section {
  title: string;
  data: SettingItemProps[];
}

export const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { settings, updateSettings } = useChatContext();
  const [isModelSelectorVisible, setIsModelSelectorVisible] = useState(false);
  
  const toggleSetting = async (settingKey: keyof Pick<Settings, 'darkMode' | 'voiceInput' | 'voiceOutput' | 'pushNotifications' | 'haptics'>) => {
    const newValue = !settings[settingKey];
    await AsyncStorage.setItem(settingKey.toString(), JSON.stringify(newValue));
    updateSettings({ [settingKey]: newValue });
  };

  const updateTemperature = (value: number) => {
    updateSettings({ temperature: value });
  };

  const updateMaxTokens = (value: number) => {
    updateSettings({ maxTokens: Math.round(value) });
  };

  const sections: Section[] = [
    {
      title: 'כללי',
      data: [
        {
          icon: 'dark-mode',
          title: 'מצב כהה',
          value: settings.darkMode,
          onPress: () => toggleSetting('darkMode'),
          type: 'toggle',
        },
        {
          icon: 'translate',
          title: 'שפת ממשק',
          value: 'עברית',
          type: 'select',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'מודל AI',
      data: [
        {
          icon: 'psychology',
          title: 'מודל',
          value: settings.model,
          type: 'select',
          onPress: () => setIsModelSelectorVisible(true),
          description: 'בחר את המודל שישמש לשיחות',
        },
        {
          icon: 'thermostat',
          title: 'יצירתיות',
          value: settings.temperature,
          type: 'slider',
          description: 'ערך גבוה = תשובות יותר יצירתיות',
          sliderProps: {
            minimumValue: 0,
            maximumValue: 1,
            step: 0.1,
          },
          onPress: updateTemperature,
        },
        {
          icon: 'format-size',
          title: 'אורך מקסימלי',
          value: settings.maxTokens,
          type: 'slider',
          description: 'אורך מקסימלי של התשובה',
          sliderProps: {
            minimumValue: 256,
            maximumValue: 4096,
            step: 256,
          },
          onPress: updateMaxTokens,
        },
      ],
    },
    {
      title: 'קלט/פלט',
      data: [
        {
          icon: 'mic',
          title: 'קלט קולי',
          value: settings.voiceInput,
          onPress: () => toggleSetting('voiceInput'),
          type: 'toggle',
        },
        {
          icon: 'volume-up',
          title: 'פלט קולי',
          value: settings.voiceOutput,
          onPress: () => toggleSetting('voiceOutput'),
          type: 'toggle',
        },
      ],
    },
    {
      title: 'התראות',
      data: [
        {
          icon: 'notifications',
          title: 'התראות פוש',
          value: settings.pushNotifications,
          onPress: () => toggleSetting('pushNotifications'),
          type: 'toggle',
        },
        {
          icon: 'vibration',
          title: 'רטט',
          value: settings.haptics,
          onPress: () => toggleSetting('haptics'),
          type: 'toggle',
        },
      ],
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
            {section.data.map((item, itemIndex) => (
              <SettingItem key={itemIndex} {...item} />
            ))}
          </View>
        </View>
      ))}
      
      <ModelSelector
        visible={isModelSelectorVisible}
        onClose={() => setIsModelSelectorVisible(false)}
        currentModel={settings.model}
        onSelect={(model: ModelType) => updateSettings({ model })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionContent: {
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    marginRight: 8,
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  selectedModel: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  modelName: {
    fontSize: 16,
    fontWeight: '500',
  },
  modelDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  sliderContainer: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
  },
  sliderValue: {
    marginLeft: 8,
    width: 40,
    textAlign: 'right',
  },
});
