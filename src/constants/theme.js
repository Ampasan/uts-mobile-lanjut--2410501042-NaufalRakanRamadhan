export const colors = {
  primary: "#00DC64",
  onPrimary: "#FFFFFF",

  background: "#FFFFFF",
  surface: "#FFFFFF",
  card: "#F7F7F7",
  surfaceMuted: "#F8F8F8",

  border: "#ecececff",

  textPrimary: "#121212",
  textSecondary: "#FFFFFF99",
  textMuted: "#9CA3AF",

  accent: "#FF6B6B",
  danger: "#E53935",

  skeleton: "#ECECEC",
  skeletonHighlight: "#F6F6F6",

  chipBg: "#F0F0F0",
  chipActiveBg: "#D8FFE9",

  soft: "#F1F5F9",
};

export const spacing = {
  xs: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xlg: 20,
  xl: 24,
  xxl: 30,
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 999,
};

export const typography = {
  title: { fontSize: 28, fontWeight: "800" },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  cardTitle: { fontSize: 14, fontWeight: "800" },
  subtitle: { fontSize: 15, fontWeight: "600" },
  body: { fontSize: 14, fontWeight: "500" },
  caption: { fontSize: 12, fontWeight: "500" },
  strong: { fontWeight: "800" },
};

export const shadows = {
  soft: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  float: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 7,
  },
};

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
};
