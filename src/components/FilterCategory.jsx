import React, { memo, useCallback } from 'react';
import { LayoutAnimation, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

function FilterCategory({ categories, selectedKey, onChange, disabled = false }) {
  const safeCategories = Array.isArray(categories) ? categories : [];
  const handleChange = useCallback(
    (key) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      onChange?.(key);
    },
    [onChange],
  );

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
              onPress={() => handleChange(key)}
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
  row: { gap: theme.spacing.sm, paddingBottom: theme.spacing.sm, paddingRight: theme.spacing.lg },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: theme.radius.pill,
    borderWidth: 1.2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  chipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.chipActiveBg,
  },
  text: { color: theme.colors.textPrimary, ...theme.typography.caption },
  textActive: { color: theme.colors.primary, ...theme.typography.strong },
  disabled: { opacity: 0.7 },
});
