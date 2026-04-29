import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import SearchScreen from "../screens/SearchScreen";
import AboutScreen from "../screens/AboutScreen";

const Tab = createBottomTabNavigator();

function getTabBarIcon(routeName, focused) {
  const activeColor = theme.colors.onPrimary;
  const inactiveColor = "rgba(255, 255, 255, 0.6)";

  switch (routeName) {
    case "Home":
      return { name: focused ? "home" : "home-outline", color: focused ? activeColor : inactiveColor };
    case "Favorites":
      return { name: focused ? "heart" : "heart-outline", color: focused ? activeColor : inactiveColor };
    case "Search":
      return { name: focused ? "search" : "search-outline", color: focused ? activeColor : inactiveColor };
    case "About":
      return {
        name: focused ? "information-circle" : "information-circle-outline",
        color: focused ? activeColor : inactiveColor,
      };
    default:
      return { name: "ellipse-outline", color: focused ? activeColor : inactiveColor };
  }
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: "BookShelf",
        tabBarShowLabel: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: { ...theme.typography.strong },
        tabBarActiveTintColor: theme.colors.onPrimary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          position: "absolute",
          left: theme.spacing.lg,
          right: theme.spacing.lg,
          bottom: theme.spacing.lg,
          height: 70,
          borderTopWidth: 0,
          borderRadius: theme.radius.pill,
          backgroundColor: theme.colors.primary,
          paddingBottom: 10,
          paddingTop: 10,
          paddingHorizontal: theme.spacing.sm,
          ...theme.shadows.float,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
          ...theme.typography.strong,
        },
        tabBarItemStyle: {
          borderRadius: theme.radius.pill,
          marginHorizontal: 4,
          paddingVertical: 2,
        },
        tabBarIcon: ({ focused, size }) => {
          const { name, color } = getTabBarIcon(route.name, focused);
          return <Ionicons name={name} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarLabel: "Favorites" }}
      />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
    </Tab.Navigator>
  );
}
