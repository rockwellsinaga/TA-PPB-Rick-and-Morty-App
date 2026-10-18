import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { colors, gradients } from '../theme';

export default function AmbientBackground() {
  return (
    <View style={[StyleSheet.absoluteFill, styles.background]}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} />
      <View style={[styles.glow, styles.portalGlow]} />
      <View style={[styles.glow, styles.cyanGlow]} />
      <View style={styles.grid} />
    </View>
  );
}

const styles = StyleSheet.create({
  background: { pointerEvents: 'none' },
  glow: { borderRadius: 999, position: 'absolute' },
  portalGlow: { backgroundColor: colors.portal, height: 280, opacity: 0.035, right: -110, top: -90, width: 280 },
  cyanGlow: { backgroundColor: colors.cyan, bottom: 80, height: 220, left: -120, opacity: 0.025, width: 220 },
  grid: { borderColor: colors.border, borderLeftWidth: 1, borderTopWidth: 1, height: '100%', left: '50%', opacity: 0.08, position: 'absolute', top: 0, width: 1 },
});
