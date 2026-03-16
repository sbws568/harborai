import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  indigo: string;
  violet: string;
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  border: string;
  borderLight: string;
  shadow: string;
  chatAiBubble: string;
  chatUserBubble: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    chat: number;
    full: number;
  };
  shadow: {
    sm: object;
    md: object;
    lg: object;
  };
}

const lightColors: ThemeColors = {
  primary: '#0EA5E9',
  primaryLight: '#E0F2FE',
  indigo: '#6366F1',
  violet: '#8B5CF6',
  gradientStart: '#0EA5E9',
  gradientMid: '#6366F1',
  gradientEnd: '#8B5CF6',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  background: '#FAFBFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F4F6',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  shadow: 'rgba(0,0,0,0.08)',
  chatAiBubble: '#EEF2FF',
  chatUserBubble: '#6366F1',
};

const darkColors: ThemeColors = {
  primary: '#38BDF8',
  primaryLight: '#1E3A5F',
  indigo: '#818CF8',
  violet: '#A78BFA',
  gradientStart: '#0EA5E9',
  gradientMid: '#6366F1',
  gradientEnd: '#8B5CF6',
  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#78350F',
  error: '#F87171',
  errorLight: '#7F1D1D',
  background: '#111827',
  surface: '#1F2937',
  surfaceSecondary: '#374151',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  textInverse: '#1F2937',
  border: '#374151',
  borderLight: '#4B5563',
  shadow: 'rgba(0,0,0,0.3)',
  chatAiBubble: '#1E1B4B',
  chatUserBubble: '#4F46E5',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  chat: 20,
  full: 9999,
};

const createShadow = (dark: boolean) => ({
  sm: {
    shadowColor: dark ? '#000' : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: dark ? 0.2 : 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: dark ? '#000' : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: dark ? 0.3 : 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: dark ? '#000' : '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: dark ? 0.4 : 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
});

const lightTheme: Theme = {
  dark: false,
  colors: lightColors,
  spacing,
  borderRadius,
  shadow: createShadow(false),
};

const darkTheme: Theme = {
  dark: true,
  colors: darkColors,
  spacing,
  borderRadius,
  shadow: createShadow(true),
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{
        theme: isDark ? darkTheme : lightTheme,
        isDark,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
