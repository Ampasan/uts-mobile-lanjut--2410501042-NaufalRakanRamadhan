import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { theme } from '../constants/theme';

const PROFILE_IMAGE_URL = 'https://res.cloudinary.com/drrmbeiyk/image/upload/v1777217745/foto_geztgv.webp';

const PROFILE = {
  name: 'Naufal Rakan Ramadhan',
  nim: '2410501042',
  className: 'B',
  theme: 'BookShelf',
  apiCredit: 'OpenLibrary',
};

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function AboutScreen() {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>About BookShelf</Text>
        <Text style={styles.subtitle}>Informasi Developer.</Text>

        <View style={styles.card}>
          <Image source={{ uri: PROFILE_IMAGE_URL }} style={styles.avatar} resizeMode="cover" />

          <View style={styles.infoWrap}>
            <InfoRow label="Nama" value={PROFILE.name} />
            <InfoRow label="NIM" value={PROFILE.nim} />
            <InfoRow label="Kelas" value={PROFILE.className} />
            <InfoRow label="Tema" value={PROFILE.theme} />
            <InfoRow label="Credit API" value={PROFILE.apiCredit} />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Dibuat oleh {PROFILE.name}</Text>
          <Text style={styles.footerSubtext}>BookShelf</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg, gap: theme.spacing.md },
  title: { ...theme.typography.title, color: theme.colors.textPrimary },
  subtitle: { color: theme.colors.textSecondary, ...theme.typography.caption },
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    padding: 14,
    gap: 14,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.skeleton,
  },
  infoWrap: { gap: theme.spacing.sm },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.skeleton,
    paddingBottom: 6,
  },
  infoLabel: { color: theme.colors.textSecondary, fontWeight: '700' },
  infoValue: { color: theme.colors.textPrimary, ...theme.typography.strong },
  footer: {
    marginTop: 'auto',
    paddingTop: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 2,
  },
  footerText: { color: theme.colors.textPrimary, ...theme.typography.strong },
  footerSubtext: { color: theme.colors.textSecondary, ...theme.typography.caption },
});

