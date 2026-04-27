import React, { useCallback, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import EmptyState from '../components/EmptyState';
import BookCard from '../components/BookCard';
import useFavoriteStore from '../store/useFavoriteStore';
import ScreenContainer from '../components/ScreenContainer';
import { theme } from '../constants/theme';

export default function FavoritesScreen({ navigation }) {
  const favorites = useFavoriteStore((s) => s.favorites);
  const removeFavorite = useFavoriteStore((s) => s.removeFavorite);

  const gridData = useMemo(() => {
    if (!favorites.length) return favorites;
    if (favorites.length % 2 === 0) return favorites;
    return [...favorites, { id: '__favorite_spacer__', __spacer: true }];
  }, [favorites]);

  const openDetail = useCallback(
    (book) => {
      if (!book?.id) return;
      navigation.navigate('Detail', { workId: book.id, title: book.title });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }) => {
      if (item?.__spacer) return <View style={[styles.itemWrap, styles.spacer]} />;

      return (
        <View style={styles.itemWrap}>
          <BookCard
            title={item.title}
            author={item.author}
            coverId={item.coverId}
            onPress={() => openDetail(item)}
          />
          <Pressable onPress={() => removeFavorite(item.id)} style={styles.removeBtn}>
            <Text style={styles.removeBtnText}>Hapus dari Favorit</Text>
          </Pressable>
        </View>
      );
    },
    [openDetail, removeFavorite],
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>Buku yang Anda simpan untuk dibaca nanti.</Text>
      </View>

      <FlatList
        data={gridData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={favorites.length ? styles.listContent : [styles.listContent, styles.emptyContent]}
        removeClippedSubviews
        initialNumToRender={10}
        windowSize={7}
        ListEmptyComponent={<EmptyState title="Belum ada favorit" message="Tambahkan dari halaman detail buku." />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.sm },
  title: { ...theme.typography.title, color: theme.colors.textPrimary },
  subtitle: { marginTop: theme.spacing.xs, color: theme.colors.textSecondary, ...theme.typography.body },

  listContent: { paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md },
  emptyContent: { flexGrow: 1 },
  row: { gap: theme.spacing.md, marginBottom: theme.spacing.md },

  itemWrap: { flex: 1, gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  spacer: { opacity: 0 },
  removeBtn: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  removeBtnText: { ...theme.typography.strong, color: theme.colors.textPrimary },
});

