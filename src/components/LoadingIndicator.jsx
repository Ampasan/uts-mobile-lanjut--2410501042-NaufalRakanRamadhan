import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

export default function LoadingIndicator({ message = 'Memuat...' }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={theme.colors.accent} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  message: {
    color: theme.colors.textSecondary,
    ...theme.typography.caption,
  },
});

