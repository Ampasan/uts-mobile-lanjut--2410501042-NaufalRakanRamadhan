import React, { useCallback } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import ButtonFavorite from '../components/ButtonFavorite';
import useFavoriteStore from '../store/useFavoriteStore';
import ScreenContainer from '../components/ScreenContainer';
import { theme } from '../constants/theme';

function coverUrl(coverId) {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}

export default function FavoritesScreen({ navigation }) {
  const favorites = useFavoriteStore((s) => s.favorites);
  const removeFavorite = useFavoriteStore((s) => s.removeFavorite);

  const openDetail = useCallback(
    (book) => {
      if (!book?.id) return;
      navigation.navigate('Detail', { workId: book.id, title: book.title });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }) => {
      const uri = coverUrl(item?.coverId);

      return (
        <Pressable onPress={() => openDetail(item)} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.coverFrame}>
              {uri ? (
                <Image source={{ uri }} style={styles.cover} resizeMode="cover" />
              ) : (
                <View style={styles.coverFallback}>
                  <Text style={styles.coverFallbackText}>No Cover</Text>
                </View>
              )}
            </View>

            <View style={styles.meta}>
              <Text numberOfLines={2} style={styles.bookTitle}>
                {item.title}
              </Text>
              <Text numberOfLines={1} style={styles.bookAuthor}>
                {item.author}
              </Text>

              <View style={styles.buttonWrap}>
                <ButtonFavorite
                  label="Hapus dari Favorit"
                  onPress={() => removeFavorite(item.id)}
                  compact
                />
              </View>
            </View>
          </View>
        </Pressable>
      );
    },
    [openDetail, removeFavorite],
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Favorit Saya</Text>
        <Text style={styles.subtitle}>Daftar buku yang ingin kamu simpan.</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          favorites.length ? styles.listContent : [styles.listContent, styles.emptyContent]
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Belum ada favorit</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
  },
  title: { ...theme.typography.title, color: theme.colors.textPrimary },
  subtitle: { marginTop: theme.spacing.xs, color: theme.colors.textSecondary, ...theme.typography.body },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: 120,
  },
  emptyContent: { flexGrow: 1 },
  separator: { height: theme.spacing.md },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    ...theme.shadows.soft,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'flex-start',
  },
  coverFrame: {
    width: 82,
    aspectRatio: 3 / 4,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.skeleton,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  coverFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  coverFallbackText: {
    fontSize: 11,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    ...theme.typography.strong,
  },
  meta: {
    flex: 1,
    minHeight: 108,
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  bookAuthor: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  buttonWrap: {
    paddingTop: theme.spacing.xs,
    alignSelf: 'flex-end',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
});

