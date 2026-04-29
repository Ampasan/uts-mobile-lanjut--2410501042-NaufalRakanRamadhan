import React, { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

function ButtonFavorite({
  label = 'Tambah ke Favorit',
  onPress,
  disabled = false,
  compact = false,
}) {
  const isDanger = String(label).toLowerCase().includes('hapus');

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        compact ? styles.buttonCompact : null,
        isDanger ? styles.buttonDanger : null,
        pressed ? styles.buttonPressed : null,
        disabled ? styles.buttonDisabled : null,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

export default memo(ButtonFavorite);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: 52,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 14,
    ...theme.shadows.float,
  },
  buttonDanger: {
    backgroundColor: theme.colors.danger,
  },
  buttonCompact: {
    width: 'auto',
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...theme.shadows.soft,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  label: {
    color: theme.colors.onPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
});
