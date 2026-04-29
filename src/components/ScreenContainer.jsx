import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../constants/theme';

export default function ScreenContainer({ children, edges = ['top', 'bottom'], padded = false, style }) {
  return (
    <SafeAreaView edges={edges} style={[styles.safe, style]}>
      {padded ? <View style={styles.padded}>{children}</View> : children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  padded: { flex: 1, paddingHorizontal: theme.spacing.lg },
});
