import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';

export const webConfig = {
  // Web-specific configurations
  haptics: {
    enabled: false, // Disable haptics on web
  },
  speech: {
    enabled: true, // Enable speech on web using Web Speech API
  },
};

// Polyfills and web-specific adjustments
if (isWeb) {
  // Add any web-specific polyfills here
  global.WebSocket = require('websocket').w3cwebsocket;
} 