import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  const openDetail = () => {
    navigation.navigate('Detail', {
      bookId: 'bk_001',
      from: 'Home',
      timestamp: Date.now(),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>
        Navigasi ke Detail.
      </Text>

      <Pressable onPress={openDetail} style={styles.button}>
        <Text style={styles.buttonText}>Buka Detail</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#6b7280' },
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

