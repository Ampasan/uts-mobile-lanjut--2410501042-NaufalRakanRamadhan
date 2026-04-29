import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

import StackNavigator from "./src/navigation/StackNavigator";
import { theme } from "./src/constants/theme";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.textPrimary,
    border: theme.colors.border,
    primary: theme.colors.primary,
  },
};

export default function App() {
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const apply = async () => {
      try {
        await NavigationBar.setVisibilityAsync("hidden");
      } catch {}
    };

    apply();
    return undefined;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <StackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
