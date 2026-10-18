import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { fetchCharacters, fetchEpisodes, fetchLocations, fetchResource } from '../api/rickAndMortyApi';
import CharacterCard from '../components/CharacterCard';
import { LoadingState, MessageState } from '../components/ScreenState';
import { colors } from '../theme';

const portals = [
  { key: 'Characters', icon: 'people', label: 'Characters', color: colors.portal },
  { key: 'Locations', icon: 'compass', label: 'Locations', color: colors.cyan },
  { key: 'Episodes', icon: 'film', label: 'Episodes', color: colors.warning },
];

export default function DiscoverScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [randomizing, setRandomizing] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [characters, locations, episodes] = await Promise.all([
        fetchCharacters(),
        fetchLocations(),
        fetchEpisodes(),
      ]);
      setStats({
        Characters: characters.info.count,
        Locations: locations.info.count,
        Episodes: episodes.info.count,
      });
      setFeatured(characters.results[Math.floor(Math.random() * characters.results.length)]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const surpriseMe = async () => {
    if (!stats?.Characters || randomizing) return;

    setRandomizing(true);
    try {
      const id = Math.floor(Math.random() * stats.Characters) + 1;
      setFeatured(await fetchResource('character', id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setRandomizing(false);
    }
  };

  if (loading && !stats) {
    return <View style={styles.screen}><LoadingState label="Calibrating the portal..." /></View>;
  }

  if (error && !stats) {
    return (
      <View style={styles.screen}>
        <MessageState actionLabel="Try again" message={error} onAction={loadDashboard} title="Portal connection lost" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.screen}
    >
      <View style={styles.hero}>
        <View style={styles.orbitLarge} />
        <View style={styles.orbitSmall} />
        <Text style={styles.kicker}>CENTRAL FINITE CURVE DATABASE</Text>
        <Text style={styles.title}>The Ultimate{`\n`}Rick & Morty Explorer</Text>
        <Text style={styles.subtitle}>
          Every character, dimension, and episode—connected through one interdimensional archive.
        </Text>
        <View style={styles.heroBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.heroBadgeText}>LIVE API LINK ESTABLISHED</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        {portals.map((portal) => (
          <Pressable
            key={portal.key}
            onPress={() => navigation.navigate(portal.key)}
            style={({ pressed }) => [styles.statCard, pressed && styles.pressed]}
          >
            <Ionicons color={portal.color} name={portal.icon} size={22} />
            <Text style={styles.statNumber}>{stats?.[portal.key] ?? '—'}</Text>
            <Text style={styles.statLabel}>{portal.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionKicker}>PORTAL ROULETTE</Text>
          <Text style={styles.sectionTitle}>Meet a random specimen</Text>
        </View>
        <Pressable disabled={randomizing} onPress={surpriseMe} style={styles.randomButton}>
          <Ionicons color={colors.ink} name="shuffle" size={17} />
          <Text style={styles.randomText}>{randomizing ? 'Opening...' : 'Surprise me'}</Text>
        </Pressable>
      </View>

      {featured ? (
        <CharacterCard
          character={featured}
          onPress={() => navigation.navigate('CharacterDetail', { character: featured })}
        />
      ) : null}

      <View style={styles.actions}>
        <Pressable onPress={() => navigation.navigate('Saved')} style={styles.actionCard}>
          <Ionicons color={colors.portal} name="bookmark" size={25} />
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Saved archive</Text>
            <Text style={styles.actionText}>Return to your favorite discoveries.</Text>
          </View>
          <Ionicons color={colors.muted} name="arrow-forward" size={19} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('About')} style={styles.actionCard}>
          <Ionicons color={colors.cyan} name="information-circle" size={26} />
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>About this project</Text>
            <Text style={styles.actionText}>Data, attribution, and the developer.</Text>
          </View>
          <Ionicons color={colors.muted} name="arrow-forward" size={19} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { padding: 18, paddingBottom: 42 },
  hero: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 22,
    position: 'relative',
  },
  orbitLarge: {
    borderColor: colors.portal,
    borderRadius: 100,
    borderWidth: 18,
    height: 170,
    opacity: 0.09,
    position: 'absolute',
    right: -35,
    top: -48,
    width: 170,
  },
  orbitSmall: {
    backgroundColor: colors.cyan,
    borderRadius: 45,
    bottom: -35,
    height: 90,
    opacity: 0.07,
    position: 'absolute',
    right: 72,
    width: 90,
  },
  kicker: { color: colors.portal, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 34, fontWeight: '900', lineHeight: 38, marginTop: 10 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 13, maxWidth: 520 },
  heroBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceRaised,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  liveDot: { backgroundColor: colors.portal, borderRadius: 5, height: 8, width: 8 },
  heroBadgeText: { color: colors.text, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  statsRow: { flexDirection: 'row', gap: 10, marginVertical: 18 },
  statCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 15,
  },
  statNumber: { color: colors.text, fontSize: 21, fontWeight: '900', marginTop: 6 },
  statLabel: { color: colors.muted, fontSize: 10, marginTop: 2 },
  sectionHeader: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 13,
    marginTop: 6,
  },
  sectionKicker: { color: colors.cyan, fontSize: 10, fontWeight: '900', letterSpacing: 1.3 },
  sectionTitle: { color: colors.text, fontSize: 21, fontWeight: '900', marginTop: 4 },
  randomButton: {
    alignItems: 'center',
    backgroundColor: colors.portal,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  randomText: { color: colors.ink, fontSize: 11, fontWeight: '900' },
  actions: { gap: 10, marginTop: 12 },
  actionCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 13,
    padding: 16,
  },
  actionCopy: { flex: 1 },
  actionTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  actionText: { color: colors.muted, fontSize: 12, marginTop: 3 },
  pressed: { opacity: 0.76 },
});
