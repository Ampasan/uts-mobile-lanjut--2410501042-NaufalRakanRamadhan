import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { theme } from '../constants/theme';

const PROFILE_IMAGE = require('../../assets/foto.webp');

const PROFILE = {
  name: 'Naufal Rakan Ramadhan',
  nim: '2410501042',
  className: 'B',
  theme: 'BookShelf',
  apiCredit: 'OpenLibrary',
};

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function AboutScreen() {
  return (
    <ScreenContainer edges={['top']}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.profileBlock}>
            <Image
              source={PROFILE_IMAGE}
              style={styles.avatar}
              resizeMode="cover"
            />
            <Text style={styles.name}>{PROFILE.name}</Text>
            <Text style={styles.identity}>NIM: {PROFILE.nim}</Text>
            <Text style={styles.identity}>Kelas: {PROFILE.className}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Info Aplikasi</Text>
            <View style={styles.infoWrap}>
              <InfoRow label="Tema" value={PROFILE.theme} />
              <InfoRow label="API" value={PROFILE.apiCredit} />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Aplikasi ini dibuat oleh {PROFILE.name} dengan penuh semangat, logika, dan secangkir kopi.</Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    justifyContent: 'flex-start',
  },
  card: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.xl,
    ...theme.shadows.float,
  },
  profileBlock: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.skeleton,
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  identity: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoWrap: {
    width: '100%',
    gap: theme.spacing.sm,
  },
  infoCard: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingTop: theme.spacing.xs,
  },
  footerText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
});

