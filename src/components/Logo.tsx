import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

interface LogoProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 80 }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[
      styles.container,
      {
        width: size,
        height: size,
        backgroundColor: colors.primary + '20',
        borderColor: colors.primary + '40',
      }
    ]}>
      <MaterialCommunityIcons
        name="brain"
        size={size * 0.6}
        color={colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
}); 