import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { fetchFilteredCharacters, getNextPage } from '../api/rickAndMortyApi';
import CharacterCard from '../components/CharacterCard';
import { FilterChips, FilterField } from '../components/FilterControls';
import SearchBar from '../components/SearchBar';
import { LoadingState, MessageState } from '../components/ScreenState';
import { colors } from '../theme';

const statusOptions = [
  { label: 'Any', value: '' },
  { label: 'Alive', value: 'alive' },
  { label: 'Dead', value: 'dead' },
  { label: 'Unknown', value: 'unknown' },
];

const genderOptions = [
  { label: 'Any', value: '' },
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Genderless', value: 'genderless' },
  { label: 'Unknown', value: 'unknown' },
];

const initialFilters = { status: '', species: '', type: '', gender: '' };

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [total, setTotal] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const loadCharacters = useCallback(async ({ page = 1, append = false } = {}) => {
    append ? setLoadingMore(true) : setLoading(true);
    setError(null);

    try {
      const payload = await fetchFilteredCharacters({ name: query, ...filters, page });
      setCharacters((current) => append ? [...current, ...payload.results] : payload.results);
      setTotal(payload.info.count);
      setNextPage(getNextPage(payload.info.next));
    } catch (requestError) {
      setError(requestError.message);
      if (!append) setCharacters([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, query]);

  useEffect(() => {
    loadCharacters();
  }, []);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const activeFilters = Object.values(filters).filter(Boolean).length;

  const clearFilters = () => {
    setFilters(initialFilters);
    setQuery('');
  };

  const header = (
    <View>
      <Text style={styles.eyebrow}>INTERDIMENSIONAL INDEX</Text>
      <Text style={styles.title}>Characters</Text>
      <Text style={styles.subtitle}>Track every life-form across the Central Finite Curve.</Text>
      <SearchBar
        disabled={loading}
        onChangeText={setQuery}
        onSubmit={() => loadCharacters()}
        placeholder="Search by character name"
        value={query}
      />
      <Pressable onPress={() => setFilterOpen((open) => !open)} style={styles.filterToggle}>
        <View style={styles.filterLabel}>
          <Ionicons color={colors.cyan} name="options-outline" size={19} />
          <Text style={styles.filterText}>Advanced filters</Text>
          {activeFilters ? <Text style={styles.filterCount}>{activeFilters}</Text> : null}
        </View>
        <Ionicons color={colors.muted} name={filterOpen ? 'chevron-up' : 'chevron-down'} size={19} />
      </Pressable>
      {filterOpen ? (
        <View style={styles.filterPanel}>
          <FilterChips label="Status" onChange={(value) => updateFilter('status', value)} options={statusOptions} value={filters.status} />
          <FilterChips label="Gender" onChange={(value) => updateFilter('gender', value)} options={genderOptions} value={filters.gender} />
          <FilterField label="Species" onChangeText={(value) => updateFilter('species', value)} placeholder="Human, Alien, Robot..." value={filters.species} />
          <FilterField label="Type / subspecies" onChangeText={(value) => updateFilter('type', value)} placeholder="Parasite, Clone, Mytholog..." value={filters.type} />
          <View style={styles.filterActions}>
            <Pressable onPress={clearFilters} style={styles.clearButton}><Text style={styles.clearText}>Clear</Text></Pressable>
            <Pressable onPress={() => loadCharacters()} style={styles.applyButton}><Text style={styles.applyText}>Apply filters</Text></Pressable>
          </View>
        </View>
      ) : null}
      <View style={styles.resultRow}>
        <Text style={styles.resultCount}>{total} matches</Text>
        <Text style={styles.resultHint}>Tap a specimen to inspect</Text>
      </View>
    </View>
  );

  if (loading && characters.length === 0) {
    return <View style={styles.screen}><View style={styles.loadingHeader}>{header}</View><LoadingState label="Scanning dimensions..." /></View>;
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={characters}
      keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={
        <MessageState actionLabel="Try again" message={error ?? 'No character matches these filters.'} onAction={() => loadCharacters()} title={error ? 'The portal is unstable' : 'No specimens found'} />
      }
      ListFooterComponent={nextPage ? (
        <Pressable disabled={loadingMore} onPress={() => loadCharacters({ page: nextPage, append: true })} style={styles.loadMore}>
          <Text style={styles.loadMoreText}>{loadingMore ? 'Opening portal...' : 'Load more characters'}</Text>
        </Pressable>
      ) : null}
      ListHeaderComponent={header}
      onRefresh={() => loadCharacters()}
      refreshing={loading && characters.length > 0}
      renderItem={({ item }) => (
        <CharacterCard character={item} onPress={() => navigation.navigate('CharacterDetail', { character: item })} />
      )}
      style={styles.screen}
    />
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  loadingHeader: { paddingHorizontal: 18, paddingTop: 18 },
  list: { padding: 18, paddingBottom: 38 },
  eyebrow: { color: colors.cyan, fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginTop: 4 },
  title: { color: colors.text, fontSize: 34, fontWeight: '900', marginTop: 5 },
  subtitle: { color: colors.muted, lineHeight: 21, marginBottom: 17, marginTop: 7 },
  filterToggle: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 13,
  },
  filterLabel: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  filterText: { color: colors.text, fontWeight: '800' },
  filterCount: {
    backgroundColor: colors.cyan,
    borderRadius: 10,
    color: colors.ink,
    fontSize: 11,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  filterPanel: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderColor: colors.border,
    borderTopWidth: 0,
    borderWidth: 1,
    padding: 14,
  },
  filterActions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  clearButton: { borderColor: colors.border, borderRadius: 10, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 11 },
  clearText: { color: colors.muted, fontWeight: '800' },
  applyButton: { backgroundColor: colors.portal, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 11 },
  applyText: { color: colors.ink, fontWeight: '900' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 18 },
  resultCount: { color: colors.text, fontSize: 13, fontWeight: '900' },
  resultHint: { color: colors.muted, fontSize: 11 },
  loadMore: { alignItems: 'center', borderColor: colors.portal, borderRadius: 14, borderWidth: 1, marginTop: 2, padding: 15 },
  loadMoreText: { color: colors.portal, fontWeight: '900' },
});
