import 'react-native-gesture-handler';
import React from 'react';
import {
  StyleSheet,
  I18nManager,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ChatProvider } from './src/context/ChatContext';
import { AssistantProvider } from './src/context/AssistantContext';
import DrawerContent from './src/navigation/DrawerContent';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { CreateAssistantScreen } from './src/screens/CreateAssistantScreen';
import { MyAgentsScreen } from './src/screens/MyAgentsScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ChatScreen from './src/screens/ChatScreen';
import { RootDrawerParamList } from './src/types/navigation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { HelpScreen } from './src/screens/HelpScreen';
import { AgentOrchestraScreen } from './src/screens/AgentOrchestraScreen';

// Enable RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const Drawer = createDrawerNavigator<RootDrawerParamList>();

// Custom theme
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#10a37f', // OpenAI green
    background: '#1a1b1e',
    card: '#2d2d2d',
    text: '#ffffff',
    border: 'rgba(255,255,255,0.1)',
    notification: '#10a37f',
  },
};

const DRAWER_WIDTH = Math.min(Dimensions.get('window').width * 0.75, 320);

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AssistantProvider>
        <ChatProvider>
          <NavigationContainer theme={CustomDarkTheme}>
            <KeyboardAvoidingView 
              style={styles.container} 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              enabled
            >
              <Drawer.Navigator
                drawerContent={(props) => <DrawerContent {...props} />}
                screenOptions={({ navigation }) => ({
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: CustomDarkTheme.colors.card,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: CustomDarkTheme.colors.border,
                  },
                  headerTintColor: CustomDarkTheme.colors.text,
                  headerTitleStyle: {
                    fontWeight: '600',
                  },
                  drawerStyle: {
                    backgroundColor: CustomDarkTheme.colors.card,
                    width: DRAWER_WIDTH,
                  },
                  drawerType: 'slide',
                  overlayColor: 'rgba(0,0,0,0.7)',
                  drawerPosition: 'right',
                  swipeEnabled: true,
                  swipeEdgeWidth: 50,
                  headerLeft: () => null,
                  headerRight: ({ tintColor }) => (
                    <MaterialCommunityIcons 
                      name="menu" 
                      size={24} 
                      color={tintColor}
                      style={{ marginRight: 16 }}
                      onPress={() => navigation.toggleDrawer()}
                    />
                  ),
                })}
              >
                <Drawer.Screen
                  name="Chat"
                  component={ChatScreen}
                  options={{
                    title: 'HebrewGPT',
                    headerTitleAlign: 'center',
                  }}
                />
                <Drawer.Screen
                  name="MyAgents"
                  component={MyAgentsScreen}
                  options={{
                    title: 'העוזרים שלי',
                    headerTitleAlign: 'center',
                  }}
                />
                <Drawer.Screen
                  name="CreateAssistant"
                  component={CreateAssistantScreen}
                  options={{
                    title: 'צור עוזר חדש',
                    headerTitleAlign: 'center',
                  }}
                />
                <Drawer.Screen
                  name="Favorites"
                  component={FavoritesScreen}
                  options={{
                    title: 'מועדפים',
                    headerTitleAlign: 'center',
                  }}
                />
                <Drawer.Screen
                  name="History"
                  component={HistoryScreen}
                  options={{
                    title: 'היסטוריה',
                    headerTitleAlign: 'center',
                  }}
                />
                <Drawer.Screen
                  name="Help"
                  component={HelpScreen}
                  options={{
                    title: 'עזר�� ותמיכה',
                    headerTitleAlign: 'center',
                  }}
                />
                <Drawer.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{
                    title: 'הגדרות',
                    headerTitleAlign: 'center',
                  }}
                />
                <Drawer.Screen 
                  name="AgentOrchestra" 
                  component={AgentOrchestraScreen}
                  options={{
                    title: 'תזמורת הסוכנים',
                    drawerLabel: 'תזמורת הסוכנים',
                  }}
                />
              </Drawer.Navigator>
            </KeyboardAvoidingView>
          </NavigationContainer>
        </ChatProvider>
      </AssistantProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
