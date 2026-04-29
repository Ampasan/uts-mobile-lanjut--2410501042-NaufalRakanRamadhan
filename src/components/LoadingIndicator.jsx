import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

export default function LoadingIndicator({ message = 'Memuat...' }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.card}>
          <View style={styles.cover} />
          <View style={styles.linePrimary} />
          <View style={styles.lineSecondary} />
        </View>
        <View style={styles.card}>
          <View style={styles.cover} />
          <View style={styles.linePrimary} />
          <View style={styles.lineSecondary} />
        </View>
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xlg,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
  },
  cover: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.skeleton,
    marginBottom: 10,
  },
  linePrimary: {
    height: 11,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.skeleton,
    marginBottom: 8,
    width: '86%',
  },
  lineSecondary: {
    height: 9,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.skeletonHighlight,
    width: '60%',
  },
  message: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    ...theme.typography.caption,
  },
});

