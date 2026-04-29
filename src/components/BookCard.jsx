import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

function coverUrl(coverId) {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}

function BookCard({ title, author, coverId, onPress, variant = 'grid' }) {
  const uri = coverUrl(coverId);
  const listMode = variant === 'list';

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, listMode ? styles.cardList : null]}
      android_ripple={{ color: theme.colors.border }}
    >
      <View style={[styles.coverFrame, listMode ? styles.coverFrameList : null]}>
        {uri ? (
          <Image source={{ uri }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={styles.coverFallback}>
            <Text style={styles.coverFallbackText}>No Cover</Text>
          </View>
        )}
      </View>

      <View style={styles.meta}>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.author}>
          {author}
        </Text>
      </View>
    </Pressable>
  );
}

export default memo(BookCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 11,
    borderWidth: 1.2,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
  },
  cardList: {
    width: 220,
  },
  coverFrame: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.skeleton,
    marginBottom: 10,
  },
  coverFrameList: {
    aspectRatio: 16 / 10,
  },
  cover: { width: '100%', height: '100%' },
  coverFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  coverFallbackText: { color: theme.colors.textSecondary, fontWeight: '700' },
  meta: { gap: 2 },
  title: { ...theme.typography.cardTitle, color: theme.colors.textPrimary },
  author: { marginTop: 4, ...theme.typography.caption, color: theme.colors.textSecondary },
});

