import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import OffersScreen from '../screens/OffersScreen';
import MyPlanScreen from '../screens/MyPlanScreen';
import SettingsScreen from '../screens/SettingsScreen';

type TabParamList = {
  Home: undefined;
  Chat: undefined;
  Offers: undefined;
  MyPlan: undefined;
  Settings: undefined;
};

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const Tab = createBottomTabNavigator<TabParamList>();

interface TabIconProps {
  name: IoniconName;
  nameActive: IoniconName;
  label: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ name, nameActive, label, focused }) => {
  const { theme } = useTheme();
  const activeColor = '#6366F1';
  const inactiveColor = theme.dark ? '#6B7280' : '#9CA3AF';

  return (
    <View style={styles.tabIcon}>
      <Ionicons
        name={focused ? nameActive : name}
        size={22}
        color={focused ? activeColor : inactiveColor}
      />
      <Text style={[styles.tabLabel, { color: focused ? activeColor : inactiveColor }]}>
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
          borderTopColor: theme.dark ? '#1F2937' : '#F3F4F6',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
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
          headerTitle: 'Easefinancials',
          headerTitleStyle: {
            color: '#6366F1',
            fontWeight: '800',
            fontSize: 20,
            letterSpacing: -0.3,
          },
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home-outline" nameActive="home" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerTitle: 'Arya · AI Counselor',
          headerTitleStyle: {
            color: '#6366F1',
            fontWeight: '700',
            fontSize: 17,
          },
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="chatbubble-ellipses-outline"
              nameActive="chatbubble-ellipses"
              label="Chat"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Offers"
        component={OffersScreen}
        options={{
          headerTitle: 'Your Offers',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="shield-checkmark-outline"
              nameActive="shield-checkmark"
              label="Offers"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyPlan"
        component={MyPlanScreen}
        options={{
          headerTitle: 'My Plan',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="bar-chart-outline"
              nameActive="bar-chart"
              label="Plan"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="person-circle-outline"
              nameActive="person-circle"
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default AppNavigator;
