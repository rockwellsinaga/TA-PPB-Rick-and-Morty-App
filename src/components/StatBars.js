import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

const palette = [colors.portal, colors.cyan, colors.violet, colors.warning, colors.danger];

export default function StatBars({ data, limit = 8 }) {
  const visible = data.slice(0, limit);
  const max = Math.max(...visible.map((item) => item.value), 1);

  return (
    <View style={styles.chart}>
      {visible.map((item, index) => (
        <View key={item.label} style={styles.row}>
          <View style={styles.labels}>
            <Text numberOfLines={1} style={styles.name}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.bar,
                {
                  backgroundColor: palette[index % palette.length],
                  width: `${Math.max(3, (item.value / max) * 100)}%`,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { gap: 13 },
  row: { gap: 6 },
  labels: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { color: colors.text, flex: 1, fontFamily: fonts.bodySemiBold, fontSize: 12 },
  value: { color: colors.muted, fontFamily: fonts.bodyBold, fontSize: 12, marginLeft: 12 },
  track: { backgroundColor: colors.backgroundSoft, borderRadius: 999, height: 8, overflow: 'hidden' },
  bar: { borderRadius: 999, height: '100%' },
});
