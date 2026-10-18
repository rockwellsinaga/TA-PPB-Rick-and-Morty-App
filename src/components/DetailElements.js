import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

export function DetailRow({ label, value, last = false }) {
  return (
    <View style={[styles.row, last && styles.lastRow]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || 'Unknown'}</Text>
    </View>
  );
}

export function SectionTitle({ eyebrow, title, count }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionCopy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {count !== undefined ? <Text style={styles.count}>{count}</Text> : null}
    </View>
  );
}

export function LinkCard({ icon, label, value, onPress, disabled = false }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.linkCard, disabled && styles.disabled, pressed && styles.pressed]}
    >
      <View style={styles.linkIcon}><Ionicons color={colors.cyan} name={icon} size={22} /></View>
      <View style={styles.linkCopy}>
        <Text style={styles.linkLabel}>{label}</Text>
        <Text numberOfLines={2} style={styles.linkValue}>{value || 'Unknown'}</Text>
      </View>
      {!disabled ? <Ionicons color={colors.muted} name="arrow-forward" size={19} /> : null}
    </Pressable>
  );
}

export function ApiRecordLink({ url }) {
  if (!url) return null;

  return (
    <Pressable onPress={() => Linking.openURL(url)} style={styles.apiLink}>
      <Ionicons color={colors.cyan} name="code-slash" size={17} />
      <Text style={styles.apiLinkText}>Open raw API record</Text>
      <Ionicons color={colors.muted} name="open-outline" size={15} />
    </Pressable>
  );
}

export const formatDatabaseDate = (value) => {
  if (!value) return 'Unknown';
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
};

const styles = StyleSheet.create({
  row: {
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
  },
  lastRow: { borderBottomWidth: 0 },
  label: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' },
  value: { color: colors.text, fontSize: 16, fontWeight: '800' },
  sectionTitleRow: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 26 },
  sectionCopy: { flex: 1 },
  eyebrow: { color: colors.cyan, fontSize: 10, fontWeight: '900', letterSpacing: 1.3, marginBottom: 4 },
  sectionTitle: { color: colors.text, fontSize: 21, fontWeight: '900' },
  count: { backgroundColor: colors.surfaceRaised, borderRadius: 999, color: colors.portal, fontSize: 12, fontWeight: '900', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 5 },
  linkCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 15, borderWidth: 1, flexDirection: 'row', gap: 12, marginBottom: 10, padding: 14 },
  linkIcon: { alignItems: 'center', backgroundColor: '#45d7df18', borderRadius: 12, height: 44, justifyContent: 'center', width: 44 },
  linkCopy: { flex: 1 },
  linkLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  linkValue: { color: colors.text, fontSize: 15, fontWeight: '900', marginTop: 4 },
  disabled: { opacity: 0.65 },
  pressed: { opacity: 0.75 },
  apiLink: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: 7, marginTop: 12, paddingVertical: 5 },
  apiLinkText: { color: colors.cyan, fontSize: 12, fontWeight: '800' },
});
