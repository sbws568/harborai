import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'outline';
  icon?: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  loading = false,
  disabled = false,
  size = 'md',
  variant = 'primary',
  icon,
}) => {
  const { theme } = useTheme();

  const getGradientColors = (): [string, string, string] => {
    if (variant === 'success') {
      return ['#10B981', '#059669', '#047857'];
    }
    return [theme.colors.gradientStart, theme.colors.gradientMid, theme.colors.gradientEnd];
  };

  const getHeight = () => {
    switch (size) {
      case 'sm': return 40;
      case 'lg': return 60;
      default: return 52;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return 14;
      case 'lg': return 18;
      default: return 16;
    }
  };

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
        style={[
          styles.button,
          {
            height: getHeight(),
            borderRadius: theme.borderRadius.lg,
            borderWidth: 2,
            borderColor: theme.colors.indigo,
            backgroundColor: 'transparent',
          },
          disabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.indigo} />
        ) : (
          <Text
            style={[
              styles.text,
              { fontSize: getFontSize(), color: theme.colors.indigo },
              textStyle,
            ]}
          >
            {icon ? `${icon} ${title}` : title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[disabled && styles.disabled, style]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradient,
          {
            height: getHeight(),
            borderRadius: theme.borderRadius.lg,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text
            style={[
              styles.text,
              { fontSize: getFontSize(), color: '#FFFFFF' },
              textStyle,
            ]}
          >
            {icon ? `${icon} ${title}` : title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default GradientButton;
