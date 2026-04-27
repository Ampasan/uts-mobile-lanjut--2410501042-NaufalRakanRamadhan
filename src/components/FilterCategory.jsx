import React, { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

function FilterCategory({ categories, selectedKey, onChange, disabled = false }) {
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {safeCategories.map((item) => {
          const key = String(item?.key ?? '');
          const label = String(item?.label ?? '').trim() || key;
          const active = key === selectedKey;

          return (
            <Pressable
              key={key}
              onPress={() => onChange?.(key)}
              disabled={disabled}
              style={[styles.chip, active ? styles.chipActive : null, disabled ? styles.disabled : null]}
            >
              <Text style={[styles.text, active ? styles.textActive : null]}>{label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default memo(FilterCategory);

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: theme.spacing.lg },
  row: { gap: theme.spacing.sm, paddingBottom: theme.spacing.sm },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipActive: {
    borderColor: theme.colors.accent,
    backgroundColor: '#e9fff2',
  },
  text: { color: theme.colors.textSecondary, ...theme.typography.caption },
  textActive: { color: '#047857', ...theme.typography.strong },
  disabled: { opacity: 0.7 },
});
