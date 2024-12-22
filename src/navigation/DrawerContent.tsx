import React, { useState, useCallback } from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useChatContext } from '../context/ChatContext';
import { useAssistantContext } from '../context/AssistantContext';
import { useTheme } from '@react-navigation/native';
import { Logo } from '../components/Logo';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const DrawerContent = (props: any) => {
  const { colors } = useTheme();
  const { conversations, selectConversation, createNewConversation, deleteConversation } = useChatContext();
  const { currentAssistant } = useAssistantContext();
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // Debug logs
  console.log('DrawerContent: Current conversations:', conversations);
  console.log('DrawerContent: deleteConversation exists:', !!deleteConversation);
  console.log('DrawerContent: isDeleteMode:', isDeleteMode);

  const handleConversationSelect = (conversationId: string) => {
    if (conversationId === 'new') {
      createNewConversation();
    } else {
      selectConversation(conversationId);
    }
    props.navigation.navigate('Chat');
    props.navigation.closeDrawer();
  };

  const handleDelete = useCallback((conversationId: string) => {
    console.log('Delete attempt for conversation:', conversationId);
    
    if (!deleteConversation) {
      console.error('deleteConversation is not available');
      return;
    }

    // Direct deletion without confirmation (working version)
    try {
      deleteConversation(conversationId)
        .then(() => {
          console.log('Delete operation completed');
          setIsDeleteMode(false);
        })
        .catch(err => {
          console.error('Delete operation failed:', err);
        });
    } catch (error) {
      console.error('Error in delete handler:', error);
    }
  }, [deleteConversation]);

  const renderConversationItem = useCallback((conversation: any) => {
    const onDeletePress = () => {
      console.log('Delete button pressed for:', conversation.id);
      if (conversation && conversation.id) {
        handleDelete(conversation.id);
      } else {
        console.error('Invalid conversation object:', conversation);
      }
    };

    return (
      <View key={conversation.id} style={styles.drawerItemWrapper}>
        <DrawerItem
          label={({ focused }) => (
            <View style={styles.drawerItemContent}>
              <Text 
                style={[
                  styles.drawerLabel, 
                  { 
                    color: colors.text,
                    opacity: 1,
                    flex: 1,
                    fontWeight: '500',
                  }
                ]}
                numberOfLines={2}
              >
                {conversation.title || 'שיחה חדשה'}
              </Text>
            </View>
          )}
          onPress={() => !isDeleteMode && handleConversationSelect(conversation.id)}
          icon={({ size }) => (
            <MaterialCommunityIcons 
              name="message-text-outline"
              size={size} 
              color={colors.text + '80'} 
            />
          )}
          style={styles.drawerItem}
        />
        {isDeleteMode && (
          <TouchableOpacity 
            onPress={onDeletePress}
            style={[styles.deleteButtonAbsolute]}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name="delete" 
              size={20} 
              color="#ff4444"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }, [colors.text, handleConversationSelect, handleDelete, isDeleteMode]);

  return (
    <DrawerContentScrollView {...props} style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Logo size={60} />
        <Text style={[styles.title, { color: colors.text }]}>HebrewGPT</Text>
        {currentAssistant && (
          <Text style={[styles.subtitle, { color: colors.text + '80' }]} numberOfLines={1}>
            {currentAssistant.name}
          </Text>
        )}
      </View>

      <View style={styles.drawerContent}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontWeight: '600' }]}>
              שיחות
            </Text>
            {conversations.length > 0 && (
              <TouchableOpacity
                onPress={() => setIsDeleteMode(!isDeleteMode)}
                style={[
                  styles.deleteAllButton,
                  isDeleteMode && { backgroundColor: colors.primary + '20' }
                ]}
              >
                <Text style={[
                  styles.deleteAllText,
                  { color: isDeleteMode ? '#ff4444' : colors.text }
                ]}>
                  {isDeleteMode ? 'סיום מחיקה' : 'מחק שיחות'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <DrawerItem
            label="שיחה חדשה"
            icon={({ size }) => (
              <MaterialCommunityIcons 
                name="message-plus-outline"
                size={size} 
                color={colors.primary} 
              />
            )}
            onPress={() => handleConversationSelect('new')}
            style={styles.drawerItem}
          />
          
          {conversations.map(conversation => renderConversationItem(conversation))}
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle, 
            { 
              color: colors.text,
              fontWeight: '600',
            }
          ]}>עוזרים</Text>
          <DrawerItem
            label="עוזרים שלי"
            icon={({ size }) => (
              <MaterialCommunityIcons 
                name="account-group-outline"
                size={size} 
                color={colors.text + '80'} 
              />
            )}
            onPress={() => {
              props.navigation.navigate('MyAgents');
              props.navigation.closeDrawer();
            }}
            style={styles.drawerItem}
          />
          <DrawerItem
            label="צור עוזר חדש"
            icon={({ size }) => (
              <MaterialCommunityIcons 
                name="account-plus-outline"
                size={size} 
                color={colors.text + '80'} 
              />
            )}
            onPress={() => {
              props.navigation.navigate('CreateAssistant');
              props.navigation.closeDrawer();
            }}
            style={styles.drawerItem}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle, 
            { 
              color: colors.text,
              fontWeight: '600',
            }
          ]}>הגדרות וכלים</Text>
          <DrawerItem
            label="הגדרות"
            icon={({ size }) => (
              <MaterialCommunityIcons 
                name="cog-outline"
                size={size} 
                color={colors.text + '80'} 
              />
            )}
            onPress={() => {
              props.navigation.navigate('Settings');
              props.navigation.closeDrawer();
            }}
            style={styles.drawerItem}
          />
          <DrawerItem
            label="מועדפים"
            icon={({ size }) => (
              <MaterialCommunityIcons 
                name="star-outline"
                size={size} 
                color={colors.text + '80'} 
              />
            )}
            onPress={() => {
              props.navigation.navigate('Favorites');
              props.navigation.closeDrawer();
            }}
            style={styles.drawerItem}
          />
          <DrawerItem
            label="היסטוריה"
            icon={({ size }) => (
              <MaterialCommunityIcons 
                name="history"
                size={size} 
                color={colors.text + '80'} 
              />
            )}
            onPress={() => {
              props.navigation.navigate('History');
              props.navigation.closeDrawer();
            }}
            style={styles.drawerItem}
          />
          <DrawerItem
            label="עזרה ותמיכה"
            icon={({ size }) => (
              <MaterialCommunityIcons 
                name="help-circle-outline"
                size={size} 
                color={colors.text + '80'} 
              />
            )}
            onPress={() => {
              props.navigation.navigate('Help');
              props.navigation.closeDrawer();
            }}
            style={styles.drawerItem}
          />
        </View>

        <View style={styles.separator} />

        <DrawerItem
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="brain" size={size} color={color} />
          )}
          label="תזמורת הסוכנים"
          onPress={() => props.navigation.navigate('AgentOrchestra')}
          labelStyle={styles.drawerLabel}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.version, { color: colors.text + '60' }]}>גרסה 1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 40 : 16,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 8,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 4,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 16,
    marginBottom: 4,
    marginTop: 4,
  },
  drawerLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    marginLeft: 32,
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row-reverse',
    borderRadius: 6,
    marginHorizontal: 4,
    minHeight: 44,
    paddingRight: 12,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 8,
    marginHorizontal: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  version: {
    fontSize: 11,
  },
  drawerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  deleteButton: {
    marginLeft: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deleteAllText: {
    fontSize: 12,
    fontWeight: '500',
  },
  drawerItemWrapper: {
    position: 'relative',
  },
  deleteButtonAbsolute: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -20 }],
    padding: 8,
    zIndex: 1,
  },
});

export default DrawerContent;
