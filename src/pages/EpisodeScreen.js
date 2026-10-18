import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { fetchEpisodes, getNextPage } from '../api/rickAndMortyApi';
import { FilterChips } from '../components/FilterControls';
import { EpisodeCard } from '../components/ResourceCards';
import SearchBar from '../components/SearchBar';
import { LoadingState, MessageState } from '../components/ScreenState';
import { colors } from '../theme';

const seasons = [
  { label: 'All', value: '' },
  ...Array.from({ length: 5 }, (_, index) => ({
    label: `Season ${index + 1}`,
    value: `S0${index + 1}`,
  })),
];

export default function EpisodeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [season, setSeason] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [total, setTotal] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const loadEpisodes = useCallback(async ({ page = 1, append = false } = {}) => {
    append ? setLoadingMore(true) : setLoading(true);
    setError(null);

    try {
      const payload = await fetchEpisodes({ name: query, episode: season, page });
      setEpisodes((current) => append ? [...current, ...payload.results] : payload.results);
      setTotal(payload.info.count);
      setNextPage(getNextPage(payload.info.next));
    } catch (requestError) {
      setError(requestError.message);
      if (!append) setEpisodes([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [query, season]);

  useEffect(() => {
    loadEpisodes();
  }, []);

  const header = (
    <View>
      <Text style={styles.eyebrow}>GALACTIC BROADCAST ARCHIVE</Text>
      <Text style={styles.title}>Episodes</Text>
      <Text style={styles.subtitle}>Every adventure, air date, and complete character manifest.</Text>
      <SearchBar disabled={loading} onChangeText={setQuery} onSubmit={() => loadEpisodes()} placeholder="Search by episode title" value={query} />
      <Pressable onPress={() => setFilterOpen((open) => !open)} style={styles.filterToggle}>
        <View style={styles.filterLabel}>
          <Ionicons color={colors.portal} name="layers-outline" size={19} />
          <Text style={styles.filterText}>{season ? `Filtered: ${season}` : 'Browse by season'}</Text>
        </View>
        <Ionicons color={colors.muted} name={filterOpen ? 'chevron-up' : 'chevron-down'} size={19} />
      </Pressable>
      {filterOpen ? (
        <View style={styles.filterPanel}>
          <FilterChips label="Season" onChange={setSeason} options={seasons} value={season} />
          <Pressable onPress={() => loadEpisodes()} style={styles.applyButton}><Text style={styles.applyText}>Apply season</Text></Pressable>
        </View>
      ) : null}
      <View style={styles.resultRow}>
        <Text style={styles.resultCount}>{total} transmissions</Text>
        <Text style={styles.resultHint}>Full cast available</Text>
      </View>
    </View>
  );

  if (loading && episodes.length === 0) {
    return <View style={styles.screen}><View style={styles.loadingHeader}>{header}</View><LoadingState label="Tuning the receiver..." /></View>;
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={episodes}
      keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={<MessageState actionLabel="Try again" message={error ?? 'No episode matches this search.'} onAction={() => loadEpisodes()} title={error ? 'Transmission interrupted' : 'No episodes found'} />}
      ListFooterComponent={nextPage ? (
        <Pressable disabled={loadingMore} onPress={() => loadEpisodes({ page: nextPage, append: true })} style={styles.loadMore}>
          <Text style={styles.loadMoreText}>{loadingMore ? 'Receiving...' : 'Load more episodes'}</Text>
        </Pressable>
      ) : null}
      ListHeaderComponent={header}
      onRefresh={() => loadEpisodes()}
      refreshing={loading && episodes.length > 0}
      renderItem={({ item }) => <EpisodeCard episode={item} onPress={() => navigation.navigate('EpisodeDetail', { episode: item })} />}
      style={styles.screen}
    />
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  loadingHeader: { paddingHorizontal: 18, paddingTop: 18 },
  list: { padding: 18, paddingBottom: 38 },
  eyebrow: { color: colors.portal, fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginTop: 4 },
  title: { color: colors.text, fontSize: 34, fontWeight: '900', marginTop: 5 },
  subtitle: { color: colors.muted, lineHeight: 21, marginBottom: 17, marginTop: 7 },
  filterToggle: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 13, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 13 },
  filterLabel: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  filterText: { color: colors.text, fontWeight: '800' },
  filterPanel: { backgroundColor: colors.surface, borderBottomLeftRadius: 14, borderBottomRightRadius: 14, borderColor: colors.border, borderTopWidth: 0, borderWidth: 1, padding: 14 },
  applyButton: { alignItems: 'center', backgroundColor: colors.portal, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 11 },
  applyText: { color: colors.ink, fontWeight: '900' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 18 },
  resultCount: { color: colors.text, fontSize: 13, fontWeight: '900' },
  resultHint: { color: colors.muted, fontSize: 11 },
  loadMore: { alignItems: 'center', borderColor: colors.portal, borderRadius: 14, borderWidth: 1, marginTop: 2, padding: 15 },
  loadMoreText: { color: colors.portal, fontWeight: '900' },
});
