import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

export default function ErrorState({ message }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.lg },
  text: { color: theme.colors.textPrimary, fontWeight: '700', textAlign: 'center' },
});

