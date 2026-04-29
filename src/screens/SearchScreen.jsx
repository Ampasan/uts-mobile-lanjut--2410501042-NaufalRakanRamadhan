import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorState from "../components/ErrorState";
import BookCard from "../components/BookCard";
import ScreenContainer from "../components/ScreenContainer";
import FilterCategory from "../components/FilterCategory";
import { searchBooks as apiSearchBooks } from "../services/api";
import useSmoothLoading from "../hooks/useSmoothLoading";
import { theme } from "../constants/theme";

const CATEGORY_OPTIONS = [
  { key: "all", label: "All", subject: "" },
  { key: "romance", label: "Romansa", subject: "romance" },
  { key: "fantasy", label: "Fantasi", subject: "fantasy" },
  { key: "science_fiction", label: "Sci-Fi", subject: "science_fiction" },
  { key: "history", label: "Histori", subject: "history" },
  { key: "mystery", label: "Misteri", subject: "mystery" },
  { key: "horror", label: "Horor", subject: "horror" },
];

function tidyQuery(raw) {
  const text = String(raw ?? "");
  return text.replace(/\s+/g, " ").trim();
}

function validateQuery(query) {
  const text = tidyQuery(query);
  if (!text) return "Pencarian tidak boleh kosong.";
  if (text.length < 3) return "Minimal 3 karakter.";
  return "";
}

function workIdFromKey(key) {
  const raw = String(key ?? "").trim();
  if (!raw) return "";
  const parts = raw.split("/").filter(Boolean);
  const idx = parts.indexOf("works");
  if (idx === -1) return "";
  return parts[idx + 1] ? String(parts[idx + 1]).trim() : "";
}

function mapDocToCard(doc) {
  const d = doc && typeof doc === "object" ? doc : {};

  const title =
    typeof d.title === "string" && d.title.trim() ? d.title.trim() : "Untitled";
  const author =
    Array.isArray(d.author_name) && d.author_name.length
      ? String(d.author_name[0] ?? "").trim() || "Unknown"
      : "Unknown";

  const coverId = Number.isFinite(d.cover_i) ? d.cover_i : null;
  const workId = workIdFromKey(d.key);

  return { id: workId || `${title}-${author}`, workId, title, author, coverId };
}

async function searchBooks(query, signal) {
  const data = await apiSearchBooks(query, { signal });
  const docs = Array.isArray(data?.docs) ? data.docs : [];
  return docs
    .map(mapDocToCard)
    .filter((x) => x && typeof x === "object" && x.id);
}

async function searchBooksByCategory(query, subject, signal) {
  const data = await apiSearchBooks(query, { subject, signal });
  const docs = Array.isArray(data?.docs) ? data.docs : [];
  return docs
    .map(mapDocToCard)
    .filter((x) => x && typeof x === "object" && x.id);
}

function withTimeout(signal, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const abortFromUpstream = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", abortFromUpstream, { once: true });
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeoutId);
      if (signal) signal.removeEventListener("abort", abortFromUpstream);
    },
  };
}

function normalizeFetchError(err) {
  const message = err?.message ? String(err.message) : "";
  const lower = message.toLowerCase();
  if (lower.includes("aborted") || lower.includes("abort"))
    return "Request timeout. Coba lagi.";
  if (lower.includes("network request failed"))
    return "Koneksi bermasalah. Cek internet lalu coba lagi.";
  return message || "Request failed";
}

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [helperError, setHelperError] = useState("");

  const [items, setItems] = useState([]);
  const [phase, setPhase] = useState("idle");
  const [remoteError, setRemoteError] = useState("");
  const [everSearched, setEverSearched] = useState(false);
  const [lastAllItems, setLastAllItems] = useState([]);

  const abortRef = useRef(null);
  const tokenRef = useRef(0);

  const loading = phase === "loading";
  const showLoading = useSmoothLoading(loading);
  const showList = items.length > 0 && phase !== "error";
  const currentCategory = useMemo(
    () =>
      CATEGORY_OPTIONS.find((item) => item.key === selectedCategory) ??
      CATEGORY_OPTIONS[0],
    [selectedCategory],
  );
  const resultCountLabel = useMemo(() => {
    const total = items.length;
    return `${total} ditemukan`;
  }, [items.length]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort?.();
    };
  }, []);

  const runSearch = useCallback(async (queryText, categoryKey) => {
    const activeCategory = categoryKey ?? selectedCategory;
    const activeMeta =
      CATEGORY_OPTIONS.find((item) => item.key === activeCategory) ??
      CATEGORY_OPTIONS[0];
    const cleanQuery = tidyQuery(queryText);

    const message = validateQuery(cleanQuery);
    setHelperError(message);

    if (message) {
      setEverSearched(false);
      setItems([]);
      setRemoteError("");
      setPhase("idle");
      return;
    }

    setEverSearched(true);
    setRemoteError("");
    setPhase("loading");

    abortRef.current?.abort?.();
    const controller = new AbortController();
    abortRef.current = controller;

    const token = (tokenRef.current += 1);

    try {
      const TIMEOUT_MS = 12000;
      const { signal, cleanup } = withTimeout(controller.signal, TIMEOUT_MS);

      let result;
      try {
        if (activeCategory === "all") {
          result = await searchBooks(cleanQuery, signal);
        } else {
          result = await searchBooksByCategory(
            cleanQuery,
            activeMeta.subject,
            signal,
          );
        }
      } catch (e) {
        const msg = String(e?.message ?? "");
        if (!signal.aborted && /network request failed/i.test(msg)) {
          if (activeCategory === "all") {
            result = await searchBooks(cleanQuery, signal);
          } else {
            result = await searchBooksByCategory(
              cleanQuery,
              activeMeta.subject,
              signal,
            );
          }
        } else {
          throw e;
        }
      } finally {
        cleanup();
      }

      if (token !== tokenRef.current) return;
      setItems(result);
      if (activeCategory === "all") setLastAllItems(result);
      setPhase("ready");
    } catch (e) {
      if (controller.signal.aborted) return;
      if (token !== tokenRef.current) return;
      setItems([]);
      setRemoteError(normalizeFetchError(e));
      setPhase("error");
    }
  }, [selectedCategory]);

  const submitSearch = useCallback(async () => {
    await runSearch(query, selectedCategory);
  }, [query, runSearch, selectedCategory]);

  const onChange = useCallback(
    (text) => {
      setQuery(text);
      if (helperError) setHelperError("");
      if (phase === "error") {
        setRemoteError("");
        setPhase("idle");
      }
    },
    [helperError, phase],
  );

  useEffect(() => {
    if (selectedCategory === "all") {
      setItems(lastAllItems);
      setRemoteError("");
      setHelperError("");
      setPhase(lastAllItems.length ? "ready" : "idle");
      setEverSearched(lastAllItems.length > 0);
      return;
    }
    if (tidyQuery(query).length >= 3) {
      runSearch(query, selectedCategory);
      return;
    }
    setItems([]);
    setRemoteError("");
    setHelperError("");
    setPhase("idle");
    setEverSearched(false);
  }, [lastAllItems, runSearch, selectedCategory]);

  const contentEmpty = useMemo(() => {
    if (loading) return null;
    if (phase === "error") return null;

    if (!everSearched) {
      return (
        <EmptyState
          title="Cari Buku"
          message="Ketik minimal 3 karakter lalu tekan search."
        />
      );
    }

    return (
      <EmptyState title="Tidak ditemukan" message="Coba kata kunci lain." />
    );
  }, [everSearched, loading, phase, selectedCategory]);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.cardCell}>
        <BookCard
          title={item.title}
          author={item.author}
          coverId={item.coverId}
          onPress={() =>
            navigation.navigate("Detail", { workId: item.workId || item.id })
          }
        />
      </View>
    ),
    [navigation],
  );

  return (
    <ScreenContainer edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Cari Buku</Text>
        <Text style={styles.subtitle}>
          Temukan buku favoritmu dengan pencarian.
        </Text>
        <SearchBar
          value={query}
          onChangeText={onChange}
          onSubmit={submitSearch}
          disabled={loading}
        />
        <FilterCategory
          categories={CATEGORY_OPTIONS}
          selectedKey={selectedCategory}
          onChange={setSelectedCategory}
          disabled={loading}
        />
        {helperError ? (
          <Text style={styles.helperError}>{helperError}</Text>
        ) : null}
      </View>

      {showLoading ? (
        <LoadingIndicator message="Mencari buku..." />
      ) : remoteError ? (
        <View style={styles.errorWrap}>
          <ErrorState message="Gagal mengambil data pencarian." />
          <Text style={styles.errorDetail}>{remoteError}</Text>
          <Pressable onPress={submitSearch} style={styles.retry}>
            <Text style={styles.retryText}>Coba Lagi</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={showList ? items : []}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            everSearched ? (
              <View style={styles.resultBar}>
                <Text style={styles.resultTitle}>Hasil ditemukan</Text>
                <Text style={styles.resultCount}>{resultCountLabel}</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={contentEmpty}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  helperError: { color: theme.colors.danger, ...theme.typography.strong },

  listContent: {
    paddingHorizontal: theme.spacing.xlg,
    paddingBottom: 100,
    flexGrow: 1,
  },
  resultBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: theme.spacing.lg,
  },
  resultTitle: {
    ...theme.typography.sectionTitle,
    color: theme.colors.textPrimary,
  },
  resultCount: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textMuted,
  },
  row: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    justifyContent: "space-between",
  },
  cardCell: { width: "48%" },

  errorWrap: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: "center",
    gap: 10,
  },
  errorDetail: {
    textAlign: "center",
    color: theme.colors.textMuted,
    fontWeight: "700",
  },
  retry: {
    alignSelf: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
  },
  retryText: { ...theme.typography.strong, color: theme.colors.textPrimary },
});
