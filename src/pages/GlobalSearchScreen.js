import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { searchAllResources } from '../api/rickAndMortyApi';
import AmbientBackground from '../components/AmbientBackground';
import CharacterCard from '../components/CharacterCard';
import { EpisodeCard, LocationCard } from '../components/ResourceCards';
import SearchBar from '../components/SearchBar';
import { LoadingState, MessageState } from '../components/ScreenState';
import { selectionFeedback } from '../utils/feedback';
import { colors, fonts, layout } from '../theme';

const RECENT_KEY = '@ultimate-rick-and-morty/recent-searches';

function ResultSection({ count, title, children }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.count}>{count}</Text>
      </View>
      {children}
    </View>
  );
}

export default function GlobalSearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [results, setResults] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY)
      .then((value) => value && setRecent(JSON.parse(value)))
      .catch(() => {});
  }, []);

  const rememberSearch = (value) => {
    setRecent((current) => {
      const next = [value, ...current.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 6);
      AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  const runSearch = async (value = query) => {
    const normalized = value.trim();
    if (normalized.length < 2) return;
    setLoading(true);
    setError(null);
    setSearchedQuery(normalized);
    try {
      setResults(await searchAllResources(normalized));
      rememberSearch(normalized);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim().length < 2) return undefined;
    const timeout = setTimeout(() => runSearch(query), 500);
    return () => clearTimeout(timeout);
  }, [query]);

  const selectRecent = (value) => {
    selectionFeedback();
    setQuery(value);
  };

  const total = results
    ? results.characters.info.count + results.locations.info.count + results.episodes.info.count
    : 0;

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>SEARCH THE ENTIRE MULTIVERSE</Text>
        <Text style={styles.title}>One portal.{`\n`}Every record.</Text>
        <Text style={styles.subtitle}>Search characters, locations, and episodes at the same time.</Text>
        <SearchBar onChangeText={setQuery} onSubmit={() => runSearch()} placeholder="Try Rick, Earth, Pilot..." value={query} />

        {!results && !loading ? (
          <View>
            {recent.length > 0 ? (
              <View style={styles.recentBlock}>
                <Text style={styles.recentLabel}>RECENT SIGNALS</Text>
                <View style={styles.recentRow}>
                  {recent.map((item) => (
                    <Pressable key={item} onPress={() => selectRecent(item)} style={styles.recentChip}>
                      <Ionicons color={colors.muted} name="time-outline" size={15} />
                      <Text style={styles.recentText}>{item}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
            <View style={styles.promptCard}>
              <View style={styles.promptIcon}><Ionicons color={colors.portal} name="scan" size={38} /></View>
              <Text style={styles.promptTitle}>Awaiting a signal</Text>
              <Text style={styles.promptText}>Enter at least two characters. Results appear automatically after a short pause.</Text>
            </View>
          </View>
        ) : null}

        {loading ? <LoadingState label="Scanning all dimensions..." /> : null}
        {error ? <MessageState actionLabel="Retry" message={error} onAction={() => runSearch(searchedQuery)} title="Search signal lost" /> : null}

        {!loading && !error && results ? (
          <View>
            <View style={styles.resultSummary}>
              <Text style={styles.resultQuery}>“{searchedQuery}”</Text>
              <Text style={styles.resultTotal}>{total} matches across the multiverse</Text>
            </View>

            <ResultSection count={results.characters.info.count} title="Characters">
              {results.characters.results.length ? results.characters.results.map((character) => (
                <CharacterCard key={character.id} character={character} onPress={() => navigation.navigate('CharacterDetail', { character })} />
              )) : <Text style={styles.emptyText}>No matching characters.</Text>}
            </ResultSection>

            <ResultSection count={results.locations.info.count} title="Locations">
              {results.locations.results.length ? results.locations.results.map((location) => (
                <LocationCard key={location.id} location={location} onPress={() => navigation.navigate('LocationDetail', { location })} />
              )) : <Text style={styles.emptyText}>No matching locations.</Text>}
            </ResultSection>

            <ResultSection count={results.episodes.info.count} title="Episodes">
              {results.episodes.results.length ? results.episodes.results.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} onPress={() => navigation.navigate('EpisodeDetail', { episode })} />
              )) : <Text style={styles.emptyText}>No matching episodes.</Text>}
            </ResultSection>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: layout.maxContent, padding: 18, paddingBottom: 110, width: '100%' },
  eyebrow: { color: colors.cyan, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.8, marginTop: 6 },
  title: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 34, lineHeight: 42, marginTop: 10 },
  subtitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginBottom: 20, marginTop: 10 },
  recentBlock: { marginTop: 5 },
  recentLabel: { color: colors.muted, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, marginBottom: 10 },
  recentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  recentChip: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 999, borderWidth: 1, flexDirection: 'row', gap: 6, paddingHorizontal: 12, paddingVertical: 8 },
  recentText: { color: colors.text, fontFamily: fonts.bodyMedium, fontSize: 12 },
  promptCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 24, borderWidth: 1, marginTop: 22, padding: 28 },
  promptIcon: { alignItems: 'center', backgroundColor: '#c7ff4a14', borderRadius: 32, height: 64, justifyContent: 'center', width: 64 },
  promptTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 17, marginTop: 16 },
  promptText: { color: colors.muted, fontFamily: fonts.body, lineHeight: 21, marginTop: 8, maxWidth: 420, textAlign: 'center' },
  resultSummary: { borderBottomColor: colors.border, borderBottomWidth: 1, marginTop: 8, paddingBottom: 16 },
  resultQuery: { color: colors.text, fontFamily: fonts.display, fontSize: 19 },
  resultTotal: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, marginTop: 5 },
  section: { marginTop: 26 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 17 },
  count: { backgroundColor: colors.surfaceBright, borderRadius: 999, color: colors.portal, fontFamily: fonts.bodyBold, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 5 },
  emptyText: { color: colors.muted, fontFamily: fonts.body, paddingVertical: 12 },
});
