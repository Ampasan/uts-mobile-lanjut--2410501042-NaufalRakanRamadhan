import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../constants/theme';

import TabNavigator from './TabNavigator';
import DetailScreen from '../screens/DetailScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="MainTabs">
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          title: 'Book Detail',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.onPrimary,
          headerTitleStyle: { ...theme.typography.strong },
        }}
      />
    </Stack.Navigator>
  );
}

