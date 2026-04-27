import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

export default function EmptyState({ title = 'Kosong', message }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>—</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl, gap: 10 },
  badge: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 22, fontWeight: '900', color: theme.colors.textMuted },
  title: { ...theme.typography.sectionTitle, color: theme.colors.textPrimary, textAlign: 'center' },
  message: { color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 20, ...theme.typography.body },
});

