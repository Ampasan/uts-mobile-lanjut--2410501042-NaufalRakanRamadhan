import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import useFetch from "../hooks/useFetch";
import { fetchDailyTrending, fetchSubjectWorks, searchBooks } from "../services/api";
import useSmoothLoading from "../hooks/useSmoothLoading";
import { theme } from "../constants/theme";

import BookCard from "../components/BookCard";
import ErrorState from "../components/ErrorState";
import ScreenContainer from "../components/ScreenContainer";

const PROFILE_IMAGE = require("../../assets/foto.webp");

const CATEGORY_OPTIONS = [
  { key: "all", label: "All", subject: "" },
  { key: "romance", label: "Romansa", subject: "romance" },
  { key: "fantasy", label: "Fantasi", subject: "fantasy" },
  { key: "science_fiction", label: "Sci-Fi", subject: "science_fiction" },
  { key: "history", label: "Histori", subject: "history" },
  { key: "mystery", label: "Misteri", subject: "mystery" },
  { key: "horror", label: "Horor", subject: "horror" },
];

function getBookId(item, index) {
  const key = typeof item?.key === "string" ? item.key : "";
  const tail = key.includes("/") ? key.split("/").pop() : key;
  return tail || String(item?.cover_id ?? item?.cover_i ?? "") || `${index}`;
}

function getBookAuthor(item) {
  if (Array.isArray(item?.authors) && item.authors[0]?.name) {
    return item.authors[0].name;
  }
  if (Array.isArray(item?.author_name) && item.author_name[0]) {
    return item.author_name[0];
  }
  if (typeof item?.author_name === "string" && item.author_name.trim()) {
    return item.author_name.trim();
  }
  return "Unknown";
}

function shapeBook(item, index) {
  return {
    id: getBookId(item, index),
    title: item?.title?.trim?.() || "Untitled",
    author: getBookAuthor(item),
    coverId: item?.cover_id ?? item?.cover_i ?? null,
  };
}

function takeBooks(list, limit) {
  return (Array.isArray(list) ? list : [])
    .filter((item) => Number.isFinite(item?.cover_id ?? item?.cover_i))
    .slice(0, limit)
    .map(shapeBook);
}

async function fetchMixedBooks(limit = 8) {
  const data = await searchBooks("popular books");
  return takeBooks(data?.docs, limit);
}

function CategorySkeleton() {
  return (
    <View style={styles.skeletonWrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {CATEGORY_OPTIONS.map((item, index) => (
          <View
            key={`${item.key}-${index}`}
            style={[
              styles.skeletonChip,
              index === 0 ? styles.skeletonChipWide : null,
            ]}
          />
        ))}
      </ScrollView>
      <View style={styles.gridRow}>
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </View>
      <View style={styles.gridRow}>
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </View>
    </View>
  );
}

function TrendingSkeleton() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.trendingRow}
    >
      {[0, 1, 2].map((item) => (
        <View key={item} style={styles.trendingSkeleton} />
      ))}
    </ScrollView>
  );
}

export default function HomeScreen({ navigation }) {
  const { data, loading, error, refetch } = useFetch(fetchDailyTrending, []);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const gridAnim = useRef(new Animated.Value(1)).current;

  const currentCategory = useMemo(
    () =>
      CATEGORY_OPTIONS.find((item) => item.key === selectedCategory) ||
      CATEGORY_OPTIONS[0],
    [selectedCategory],
  );

  const trendingBooks = useMemo(() => takeBooks(data?.works, 4), [data]);
  const showTrendingSkeleton = useSmoothLoading(loading && !refreshing);
  const showCategorySkeleton = useSmoothLoading(categoryLoading && !refreshing);

  const animateGridIn = useCallback(() => {
    gridAnim.setValue(0.92);
    Animated.timing(gridAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [gridAnim]);

  const loadCategoryBooks = useCallback(
    async (subject) => {
      setCategoryLoading(true);
      setCategoryError("");

      try {
        const books = !subject
          ? await fetchMixedBooks(6)
          : takeBooks(
              (await fetchSubjectWorks(subject, { limit: 12 }))?.works,
              6,
            );

        setCategoryBooks(books);
        animateGridIn();
      } catch (loadError) {
        setCategoryBooks([]);
        setCategoryError("Buku tidak ditemukan");
      } finally {
        setCategoryLoading(false);
      }
    },
    [animateGridIn],
  );

  useEffect(() => {
    loadCategoryBooks(currentCategory.subject);
  }, [currentCategory.subject, loadCategoryBooks]);

  const openAboutScreen = useCallback(() => {
    navigation.navigate("About");
  }, [navigation]);

  const openDetail = useCallback(
    (book) => {
      navigation.navigate("Detail", { workId: book.id, title: book.title });
    },
    [navigation],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
      await loadCategoryBooks(currentCategory.subject);
    } finally {
      setRefreshing(false);
    }
  }, [currentCategory.subject, loadCategoryBooks, refetch]);

  const renderGridItem = useCallback(
    ({ item }) => (
      <Animated.View
        style={[
          styles.gridCell,
          {
            opacity: gridAnim,
            transform: [
              {
                translateY: gridAnim.interpolate({
                  inputRange: [0.92, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        <BookCard
          title={item.title}
          author={item.author}
          coverId={item.coverId}
          onPress={() => openDetail(item)}
        />
      </Animated.View>
    ),
    [gridAnim, openDetail],
  );

  const renderTrendingItem = useCallback(
    ({ item }) => (
      <View style={styles.trendingCardWrap}>
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

  const renderHeader = () => (
    <View style={styles.headerBlock}>
      <View style={styles.topBar}>
        <View style={styles.titleWrap}>
          <Text style={styles.brandTitle}>BookShelf</Text>
          <Text style={styles.brandSubtitle}>Jelajahi Buku Tanpa Batas</Text>
        </View>

        <Pressable onPress={openAboutScreen} style={styles.avatarButton}>
          <Image
            source={PROFILE_IMAGE}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </Pressable>
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Buku yang Sedang Tren</Text>
        <Text style={styles.sectionHint}>
          Pilihan populer untuk dibaca hari ini.
        </Text>
        {showTrendingSkeleton ? (
          <TrendingSkeleton />
        ) : error ? (
          <ErrorState message="Buku tren belum tersedia" />
        ) : (
          <FlatList
            data={trendingBooks}
            keyExtractor={(item) => `trending-${item.id}`}
            renderItem={renderTrendingItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingRow}
            ListEmptyComponent={
              <ErrorState message="Buku tren belum tersedia" />
            }
          />
        )}
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Telusuri berdasarkan Kategori</Text>
        <Text style={styles.sectionHint}>
          Pilih kategori untuk melihat buku sesuai pilihanmu.
        </Text>

        {showCategorySkeleton && categoryBooks.length === 0 ? (
          <CategorySkeleton />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {CATEGORY_OPTIONS.map((item) => {
              const active = item.key === selectedCategory;
              return (
                <Pressable
                  key={item.key}
                  onPress={() => setSelectedCategory(item.key)}
                  style={[styles.chip, active ? styles.chipActive : null]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      active ? styles.chipTextActive : null,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );

  return (
    <ScreenContainer edges={["top"]}>
      <FlatList
        data={showCategorySkeleton ? [] : categoryBooks}
        keyExtractor={(item) => item.id}
        renderItem={renderGridItem}
        numColumns={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.screenContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          showCategorySkeleton ? null : categoryError ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>{categoryError}</Text>
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>Buku tidak ditemukan</Text>
            </View>
          )
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xlg,
    paddingBottom: 120,
  },
  headerBlock: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titleWrap: {
    gap: 4,
  },
  brandTitle: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
  },
  brandSubtitle: {
    fontSize: 15,
    color: theme.colors.textMuted,
    fontWeight: "500",
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.soft,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.skeleton,
  },
  sectionBlock: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.sectionTitle,
    color: theme.colors.textPrimary,
  },
  sectionHint: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  trendingRow: {
    gap: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingRight: theme.spacing.lg,
  },
  trendingCardWrap: {
    width: 148,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  gridCell: {
    width: "47.5%",
  },
  chipsRow: {
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    paddingRight: theme.spacing.lg,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.chipBg,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  chipTextActive: {
    color: theme.colors.onPrimary,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  skeletonWrap: {
    gap: theme.spacing.md,
  },
  skeletonChip: {
    width: 78,
    height: 40,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.chipBg,
  },
  skeletonChipWide: {
    width: 64,
  },
  skeletonCard: {
    width: "47.5%",
    aspectRatio: 0.7,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.skeleton,
  },
  trendingSkeleton: {
    width: 148,
    aspectRatio: 0.7,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.skeleton,
  },
});
