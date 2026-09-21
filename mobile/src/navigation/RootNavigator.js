import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import JournalScreen from '../screens/JournalScreen';
import CardsScreen from '../screens/CardsScreen';
import CheckInScreen from '../screens/CheckInScreen';
import TherapistScreen from '../screens/TherapistScreen';
import CrisisScreen from '../screens/CrisisScreen';
import { colors } from '../theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ICONS = {
  Home: 'paw',
  Journal: 'book',
  Cards: 'mail',
  'Check In': 'people',
  Therapists: 'medkit',
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Check In" component={CheckInScreen} />
      <Tab.Screen name="Therapists" component={TherapistScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        {/* Crisis screen is pushed modally from anywhere via navigation.navigate('Crisis') */}
        <Stack.Screen name="Crisis" component={CrisisScreen} options={{ presentation: 'modal', headerShown: true, title: 'Support' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
