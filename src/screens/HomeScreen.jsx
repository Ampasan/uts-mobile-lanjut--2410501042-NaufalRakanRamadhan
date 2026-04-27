import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import useFetch from "../hooks/useFetch";
import { fetchDailyTrending, fetchSubjectWorks } from "../services/api";
import useSmoothLoading from "../hooks/useSmoothLoading";
import { theme } from "../constants/theme";

import BookCard from "../components/BookCard";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorState from "../components/ErrorState";
import ScreenContainer from "../components/ScreenContainer";
import FilterCategory from "../components/FilterCategory";

const CATEGORY_OPTIONS = [
  { key: "all", label: "All", subject: "" },
  { key: "romance", label: "Romansa", subject: "romance" },
  { key: "fantasy", label: "Fantasi", subject: "fantasy" },
  { key: "science_fiction", label: "Sci-Fi", subject: "science_fiction" },
  { key: "history", label: "Histori", subject: "history" },
  { key: "mystery", label: "Misteri", subject: "mystery" },
  { key: "horror", label: "Horor", subject: "horror" },
];

function workId(work, index) {
  const key = typeof work?.key === "string" ? work.key : "";
  const tail = key.includes("/") ? key.split("/").pop() : key;
  return tail || String(work?.cover_i) || `${index}`;
}

function workAuthor(work) {
  if (Array.isArray(work?.authors) && work.authors[0]?.name)
    return work.authors[0].name;
  if (Array.isArray(work?.author_name) && work.author_name[0])
    return work.author_name[0];
  if (typeof work?.author_name === "string") return work.author_name;
  return "Unknown";
}

function mapDocToCard(doc, index) {
  const title =
    typeof doc?.title === "string" && doc.title.trim()
      ? doc.title.trim()
      : "Untitled";
  const author =
    Array.isArray(doc?.author_name) && doc.author_name[0]
      ? String(doc.author_name[0]).trim()
      : "Unknown";
  const key = typeof doc?.key === "string" ? doc.key : "";
  const tail = key.includes("/") ? key.split("/").pop() : key;
  return {
    id: tail || `${title}-${index}`,
    title,
    author,
    coverId: doc?.cover_i ?? null,
  };
}

async function fetchAllBooksFromSearch(limit = 5) {
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent("book")}&limit=${limit}`,
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const docs = Array.isArray(json?.docs) ? json.docs : [];
  return docs
    .map(mapDocToCard)
    .filter((item) => item && item.id && Number.isFinite(item.coverId))
    .slice(0, limit);
}

export default function HomeScreen({ navigation }) {
  const { data, loading, error, refetch } = useFetch(fetchDailyTrending, []);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const showLoading = useSmoothLoading(loading && !refreshing);

  const books = useMemo(() => {
    const works = Array.isArray(data?.works) ? data.works : [];
    const withCover = works.filter((w) => Number.isFinite(w?.cover_i));
    return withCover.slice(0, 4).map((w, idx) => ({
      id: workId(w, idx),
      title: w?.title ?? "Untitled",
      author: workAuthor(w),
      coverId: w?.cover_i ?? null,
    }));
  }, [data]);

  const currentCategory = useMemo(
    () =>
      CATEGORY_OPTIONS.find((item) => item.key === selectedCategory) ??
      CATEGORY_OPTIONS[0],
    [selectedCategory],
  );

  const loadCategoryBooks = useCallback(async (subject) => {
    setCategoryLoading(true);
    setCategoryError("");
    try {
      let mapped = [];
      if (!subject) {
        mapped = await fetchAllBooksFromSearch(4);
      } else {
        const result = await fetchSubjectWorks(subject, { limit: 10 });
        const works = Array.isArray(result?.works) ? result.works : [];
        mapped = works
          .filter((w) => Number.isFinite(w?.cover_id ?? w?.cover_i))
          .slice(0, 4)
          .map((w, idx) => ({
            id: workId(w, idx),
            title: w?.title ?? "Untitled",
            author: workAuthor(w),
            coverId: w?.cover_id ?? w?.cover_i ?? null,
          }));
      }
      setCategoryBooks(mapped);
    } catch (e) {
      setCategoryBooks([]);
      setCategoryError("Gagal memuat kategori.");
    } finally {
      setCategoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategoryBooks(currentCategory.subject);
  }, [currentCategory.subject, loadCategoryBooks]);

  const showCategoryLoading = useSmoothLoading(categoryLoading && !refreshing);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    await loadCategoryBooks(currentCategory.subject);
    setRefreshing(false);
  }, [currentCategory.subject, loadCategoryBooks, refetch]);

  const openDetail = useCallback(
    (book) => {
      navigation.navigate("Detail", { workId: book.id, title: book.title });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.cardCell}>
        <BookCard
          title={item.title}
          author={item.author}
          coverId={item.coverId}
          onPress={() => openDetail(item)}
        />
      </View>
    ),
    [openDetail],
  );

  if (showLoading) return <LoadingIndicator message="Mengambil buku trending..." />;
  if (error) return <ErrorState message="Gagal memuat data trending" />;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Trending Hari Ini</Text>
        <Text style={styles.subtitle}>
          Ringkasan buku populer hari ini, plus koleksi berdasarkan kategori di
          bawah.
        </Text>
      </View>

      <FlatList
        data={categoryBooks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        removeClippedSubviews
        initialNumToRender={10}
        windowSize={7}
        ListHeaderComponent={
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <FlatList
              data={books}
              keyExtractor={(item) => `trending-${item.id}`}
              renderItem={renderItem}
              numColumns={2}
              columnWrapperStyle={styles.row}
              scrollEnabled={false}
              contentContainerStyle={styles.sectionList}
              ListEmptyComponent={
                <ErrorState message="Trending belum tersedia." />
              }
            />

            <Text style={styles.sectionTitle}>
              Kategori: {currentCategory.label}
            </Text>
            <FilterCategory
              categories={CATEGORY_OPTIONS}
              selectedKey={selectedCategory}
              onChange={setSelectedCategory}
              disabled={refreshing || categoryLoading}
            />

            {showCategoryLoading ? (
              <LoadingIndicator message="Mengambil buku kategori..." />
            ) : null}
            {categoryError ? <ErrorState message={categoryError} /> : null}
          </View>
        }
        ListEmptyComponent={
          !showCategoryLoading && !categoryError ? (
            <ErrorState message="Data kategori tidak tersedia" />
          ) : null
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.sm },
  title: { ...theme.typography.title, color: theme.colors.textPrimary },
  sectionTitle: {
    ...theme.typography.sectionTitle,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  sectionWrap: { paddingBottom: theme.spacing.md, gap: theme.spacing.sm },
  sectionList: { paddingBottom: theme.spacing.md },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  row: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    justifyContent: "space-between",
  },
  cardCell: { width: "48%" },
});
