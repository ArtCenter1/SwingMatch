import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { RootTabParamList } from '../types';

// Import screen components (will create these next)
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import RecordScreen from '../screens/RecordScreen';
import AILabScreen from '../screens/AILabScreen';
import MatchScreen from '../screens/MatchScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabNavigator() {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Record') {
            iconName = focused ? 'videocam' : 'videocam-outline';
          } else if (route.name === 'AILab') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Match') {
            iconName = focused ? 'people' : 'people-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.foreground,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'SwingMatch',
          headerStyle: {
            backgroundColor: colors.background,
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />
      <Tab.Screen 
        name="Library" 
        component={LibraryScreen}
        options={{ title: 'My Library' }}
      />
      <Tab.Screen 
        name="Record" 
        component={RecordScreen}
        options={{ 
          title: 'Record Session',
          tabBarLabel: 'Record',
        }}
      />
      <Tab.Screen 
        name="AILab" 
        component={AILabScreen}
        options={{ 
          title: 'AI Lab',
          tabBarLabel: 'AI Lab',
        }}
      />
      <Tab.Screen 
        name="Match" 
        component={MatchScreen}
        options={{ title: 'Find Players' }}
      />
    </Tab.Navigator>
  );
}
