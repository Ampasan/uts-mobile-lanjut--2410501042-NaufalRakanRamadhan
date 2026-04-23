import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function DetailScreen({ navigation, route }) {
  const params = route?.params ?? {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detail</Text>

      <View style={styles.card}>
        <Text style={styles.label}>params</Text>
        <Text style={styles.mono}>{JSON.stringify(params, null, 2)}</Text>
      </View>

      <Pressable onPress={() => navigation.goBack()} style={styles.button}>
        <Text style={styles.buttonText}>Kembali</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 22, fontWeight: '700' },
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
  },
  label: { fontWeight: '700', marginBottom: 8 },
  mono: { fontFamily: 'monospace', color: '#111827' },
  button: {
    marginTop: 8,
    backgroundColor: '#00D564',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: '700' },
});

