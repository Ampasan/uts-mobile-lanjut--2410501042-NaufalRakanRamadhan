import React, { useCallback, useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import useFetch from '../hooks/useFetch';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorState from '../components/ErrorState';
import ButtonFavorite from '../components/ButtonFavorite';
import { fetchAuthor, fetchWorkDetail, fetchWorkEditions } from '../services/api';
import useFavoriteStore from '../store/useFavoriteStore';
import useSmoothLoading from '../hooks/useSmoothLoading';
import ScreenContainer from '../components/ScreenContainer';
import { theme } from '../constants/theme';

function pickWorkId(routeParams) {
  const p = routeParams ?? {};
  const candidate = p.workId ?? p.id ?? '';
  return typeof candidate === 'string' || typeof candidate === 'number' ? String(candidate) : '';
}

function coverUriFromWork(work) {
  const coverId = Array.isArray(work?.covers) ? work.covers[0] : null;
  if (!Number.isFinite(coverId)) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
}

function textValue(value) {
  if (typeof value === 'string') return value.trim();
  if (value && typeof value === 'object' && typeof value.value === 'string') return value.value.trim();
  return '';
}

function cleanJoin(list) {
  const items = Array.isArray(list) ? list : [];
  const out = items.map((x) => String(x ?? '').trim()).filter(Boolean);
  return out.length ? out.join(', ') : '';
}

async function buildBookDetail(workId) {
  const work = await fetchWorkDetail(workId);

  const authorsKeys = Array.isArray(work?.authors)
    ? work.authors
        .map((a) => a?.author?.key)
        .filter((k) => typeof k === 'string' && k.length)
        .slice(0, 4)
    : [];

  const authors = await Promise.all(
    authorsKeys.map(async (key) => {
      try {
        const a = await fetchAuthor(key);
        return a?.name ?? '';
      } catch {
        return '';
      }
    }),
  );

  let edition = null;
  try {
    const editions = await fetchWorkEditions(workId, { limit: 1 });
    edition = Array.isArray(editions?.entries) ? editions.entries[0] : null;
  } catch {
    edition = null;
  }

  return { work, edition, authors: authors.filter(Boolean) };
}

function MetaBadge({ label, value }) {
  const text = String(value ?? '').trim();
  if (!text) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeLabel}>{label}</Text>
      <Text numberOfLines={2} style={styles.badgeValue}>
        {text}
      </Text>
    </View>
  );
}

export default function DetailScreen({ route }) {
  const workId = pickWorkId(route?.params);

  const favorites = useFavoriteStore((s) => s.favorites);
  const addFavorite = useFavoriteStore((s) => s.addFavorite);
  const removeFavorite = useFavoriteStore((s) => s.removeFavorite);

  const fetcher = useCallback(() => buildBookDetail(workId), [workId]);
  const { data, loading, error, refetch } = useFetch(fetcher, [fetcher]);
  const showLoading = useSmoothLoading(loading);

  const viewModel = useMemo(() => {
    const work = data?.work ?? null;
    const edition = data?.edition ?? null;
    const coverId = Array.isArray(work?.covers) ? work.covers[0] : null;
    const coverUri = coverUriFromWork(work);
    const title = textValue(work?.title) || textValue(edition?.title) || 'Untitled';

    const description =
      textValue(work?.description) ||
      textValue(edition?.description) ||
      'Tidak ada sinopsis.';

    const authors = Array.isArray(data?.authors) ? data.authors : [];
    const authorLine = authors.length ? authors.join(', ') : 'Unknown';

    const publishYear =
      textValue(work?.first_publish_date) ||
      textValue(edition?.publish_date) ||
      '';

    const publisher = cleanJoin(edition?.publishers);
    const language = cleanJoin(edition?.languages?.map((l) => l?.key?.split('/').pop()));
    return {
      coverId: Number.isFinite(coverId) ? coverId : null,
      coverUri,
      title,
      authorLine,
      publishYear,
      publisher,
      language,
      description,
    };
  }, [data]);

  const isFavorite = useMemo(() => favorites.some((b) => b?.id === workId), [favorites, workId]);

  const toggleFavorite = useCallback(() => {
    if (!workId) return;

    if (isFavorite) {
      removeFavorite(workId);
      return;
    }

    addFavorite({
      id: workId,
      title: viewModel.title,
      author: viewModel.authorLine,
      coverId: viewModel.coverId,
    });
  }, [addFavorite, isFavorite, removeFavorite, viewModel, workId]);

  if (!workId) {
    return (
      <ScreenContainer>
        <ErrorState message="workId tidak ditemukan dari navigation params." />
      </ScreenContainer>
    );
  }

  if (showLoading) return <LoadingIndicator message="Memuat detail buku..." />;
  if (error)
    return (
      <ScreenContainer>
        <View style={styles.errorWrap}>
          <ErrorState message="Gagal memuat detail buku." />
          <Pressable onPress={refetch} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Coba Lagi</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.coverFrame}>
            {viewModel.coverUri ? (
              <Image source={{ uri: viewModel.coverUri }} style={styles.cover} resizeMode="cover" />
            ) : (
              <View style={styles.coverFallback}>
                <Text style={styles.coverFallbackText}>No Cover</Text>
              </View>
            )}
          </View>

          <View style={styles.headlineBlock}>
            <Text style={styles.title}>{viewModel.title}</Text>
            <Text style={styles.author}>{viewModel.authorLine}</Text>
          </View>

          <View style={styles.badgesRow}>
            <MetaBadge label="Tahun" value={viewModel.publishYear} />
            <MetaBadge label="Publisher" value={viewModel.publisher} />
            <MetaBadge label="Bahasa" value={viewModel.language} />
          </View>

          <ButtonFavorite
            onPress={toggleFavorite}
            label={isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
          />
        </View>

        <View style={styles.synopsisCard}>
          <Text style={styles.sectionTitle}>Sinopsis</Text>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.synopsisScrollContent}
          >
            <Text style={styles.desc}>{viewModel.description}</Text>
          </ScrollView>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.lg,
    ...theme.shadows.soft,
  },
  coverFrame: {
    width: 220,
    aspectRatio: 3 / 4,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    backgroundColor: theme.colors.skeleton,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.soft,
  },
  cover: { width: '100%', height: '100%' },
  coverFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  coverFallbackText: { color: theme.colors.textSecondary, ...theme.typography.strong },
  headlineBlock: {
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  author: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  badgesRow: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  badge: {
    minWidth: '31%',
    flexGrow: 1,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  badgeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  synopsisCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    gap: theme.spacing.sm,
    minHeight: 240,
    ...theme.shadows.soft,
  },
  sectionTitle: { fontWeight: '800', color: theme.colors.textPrimary, fontSize: 18 },
  synopsisScrollContent: {
    paddingBottom: theme.spacing.sm,
  },
  desc: {
    color: theme.colors.textPrimary,
    lineHeight: 24,
    fontSize: 14,
  },

  errorWrap: { flex: 1, padding: theme.spacing.lg, justifyContent: 'center', gap: theme.spacing.md },
  secondaryButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
  },
  secondaryButtonText: { ...theme.typography.strong, color: theme.colors.textPrimary },
});

