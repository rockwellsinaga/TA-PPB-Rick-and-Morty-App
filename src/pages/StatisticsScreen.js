import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { loadUniverseSnapshot } from '../api/universeSnapshot';
import AmbientBackground from '../components/AmbientBackground';
import { LoadingState, MessageState } from '../components/ScreenState';
import StatBars from '../components/StatBars';
import { buildUniverseStatistics } from '../utils/analytics';
import { selectionFeedback } from '../utils/feedback';
import { colors, fonts, layout } from '../theme';

const metrics = [
  ['characters', 'people', colors.portal],
  ['locations', 'planet', colors.cyan],
  ['episodes', 'film', colors.violet],
];

function Ranking({ items, valueKey, suffix }) {
  return (
    <View>
      {items.map((item, index) => (
        <View key={item.id} style={styles.rankRow}>
          <Text style={styles.rankNumber}>{String(index + 1).padStart(2, '0')}</Text>
          <View style={styles.rankCopy}>
            <Text numberOfLines={1} style={styles.rankName}>{item.name}</Text>
            <Text style={styles.rankMeta}>{item[valueKey]} {suffix}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function StatisticsScreen() {
  const { width } = useWindowDimensions();
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stats = useMemo(() => snapshot ? buildUniverseStatistics(snapshot) : null, [snapshot]);

  const load = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      setSnapshot(await loadUniverseSnapshot({ forceRefresh }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading && !stats) {
    return <View style={styles.screen}><AmbientBackground /><LoadingState label="Indexing the entire multiverse..." /></View>;
  }

  if (error && !stats) {
    return <View style={styles.screen}><AmbientBackground /><MessageState actionLabel="Retry" message={error} onAction={() => load()} title="Analytics offline" /></View>;
  }

  const refresh = () => {
    selectionFeedback();
    load(true);
  };

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>MULTIVERSE LAB / MODULE 02</Text>
            <Text style={styles.title}>Galactic{`\n`}Statistics</Text>
          </View>
          <Pressable disabled={loading} onPress={refresh} style={styles.refreshButton}>
            <Ionicons color={colors.portal} name="refresh" size={20} />
          </Pressable>
        </View>
        <Text style={styles.subtitle}>A live census derived from every record in the public API.</Text>
        <Text style={styles.cacheNote}>Snapshot: {new Date(snapshot.cachedAt).toLocaleString()}</Text>

        <View style={styles.metrics}>
          {metrics.map(([key, icon, color]) => (
            <View key={key} style={styles.metricCard}>
              <Ionicons color={color} name={icon} size={22} />
              <Text style={styles.metricValue}>{stats.counts[key]}</Text>
              <Text style={styles.metricLabel}>{key}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.grid, width >= 820 && styles.gridWide]}>
          <View style={styles.chartCard}>
            <Text style={styles.cardEyebrow}>VITAL STATUS</Text>
            <Text style={styles.cardTitle}>Alive, dead, unknown</Text>
            <StatBars data={stats.statuses} />
          </View>
          <View style={styles.chartCard}>
            <Text style={styles.cardEyebrow}>IDENTITY</Text>
            <Text style={styles.cardTitle}>Gender distribution</Text>
            <StatBars data={stats.genders} />
          </View>
          <View style={styles.chartCard}>
            <Text style={styles.cardEyebrow}>BIODIVERSITY</Text>
            <Text style={styles.cardTitle}>Most common species</Text>
            <StatBars data={stats.species} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Record holders</Text>
        <View style={[styles.grid, width >= 820 && styles.gridWide]}>
          <View style={styles.chartCard}>
            <Text style={styles.cardEyebrow}>MOST TRAVELED</Text>
            <Text style={styles.cardTitle}>Episode appearances</Text>
            <Ranking items={stats.topCharacters} suffix="episodes" valueKey="episodeCount" />
          </View>
          <View style={styles.chartCard}>
            <Text style={styles.cardEyebrow}>MOST POPULATED</Text>
            <Text style={styles.cardTitle}>Location residents</Text>
            <Ranking items={stats.topLocations} suffix="residents" valueKey="residentCount" />
          </View>
          <View style={styles.chartCard}>
            <Text style={styles.cardEyebrow}>BIGGEST CAST</Text>
            <Text style={styles.cardTitle}>Episode manifests</Text>
            <Ranking items={stats.topEpisodes} suffix="characters" valueKey="castCount" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: layout.maxContent, padding: 18, paddingBottom: 48, width: '100%' },
  headerRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  headerCopy: { flex: 1 },
  eyebrow: { color: colors.cyan, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.7, marginTop: 6 },
  title: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 34, lineHeight: 41, marginTop: 9 },
  subtitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginTop: 9 },
  cacheNote: { color: colors.mutedDark, fontFamily: fonts.body, fontSize: 10, marginTop: 6 },
  refreshButton: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 22, borderWidth: 1, height: 44, justifyContent: 'center', width: 44 },
  metrics: { flexDirection: 'row', gap: 10, marginTop: 22 },
  metricCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, flex: 1, paddingHorizontal: 5, paddingVertical: 16 },
  metricValue: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 23, marginTop: 7 },
  metricLabel: { color: colors.muted, fontFamily: fonts.body, fontSize: 10, marginTop: 3, textTransform: 'capitalize' },
  grid: { gap: 12, marginTop: 20 },
  gridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  chartCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, flex: 1, minWidth: 270, padding: 17 },
  cardEyebrow: { color: colors.portal, fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1.3 },
  cardTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 15, marginBottom: 18, marginTop: 5 },
  sectionTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 20, marginTop: 30 },
  rankRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: 12, paddingVertical: 10 },
  rankNumber: { color: colors.cyan, fontFamily: fonts.display, fontSize: 12 },
  rankCopy: { flex: 1 },
  rankName: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 13 },
  rankMeta: { color: colors.muted, fontFamily: fonts.body, fontSize: 11, marginTop: 2 },
});
