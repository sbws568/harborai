import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import OffersScreen from '../screens/OffersScreen';
import MyPlanScreen from '../screens/MyPlanScreen';
import SettingsScreen from '../screens/SettingsScreen';

type RootStackParamList = {
  MainTabs: undefined;
  Chat: undefined;
  Offers: undefined;
};

type TabParamList = {
  Home: undefined;
  Chat: undefined;
  Offers: undefined;
  MyPlan: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
  color: string;
}

const TabIcon: React.FC<TabIconProps> = ({ emoji, label, focused, color }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>{emoji}</Text>
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? theme.colors.indigo : theme.colors.textTertiary },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const MainTabs: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.borderLight,
          borderTopWidth: 1,
          height: 85,
          paddingTop: 8,
          paddingBottom: 24,
        },
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTitleStyle: {
          color: theme.colors.text,
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'HarborAI',
          headerTitleStyle: {
            color: theme.colors.indigo,
            fontWeight: '800',
            fontSize: 20,
          },
          tabBarIcon: ({ focused, color }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerTitle: 'Harbor AI Chat',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon emoji="💬" label="Chat" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Offers"
        component={OffersScreen}
        options={{
          headerTitle: 'Your Offers',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon emoji="🎯" label="Offers" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyPlan"
        component={MyPlanScreen}
        options={{
          headerTitle: 'My Plan',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon emoji="📋" label="Plan" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: 'Settings',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon emoji="⚙️" label="Settings" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: {
    fontSize: 22,
    opacity: 0.6,
  },
  tabEmojiActive: {
    opacity: 1,
    fontSize: 24,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});

export default AppNavigator;
