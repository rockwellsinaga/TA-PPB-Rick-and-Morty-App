import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { fetchLocations, getNextPage } from '../api/rickAndMortyApi';
import AmbientBackground from '../components/AmbientBackground';
import { FilterField } from '../components/FilterControls';
import { LocationCard } from '../components/ResourceCards';
import SearchBar from '../components/SearchBar';
import { LoadingState, MessageState } from '../components/ScreenState';
import { colors, fonts, layout } from '../theme';

export default function LocationScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 2 : 1;
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [dimension, setDimension] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [total, setTotal] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const loadLocations = useCallback(async ({ page = 1, append = false } = {}) => {
    append ? setLoadingMore(true) : setLoading(true);
    setError(null);
    try {
      const payload = await fetchLocations({ name: query, type, dimension, page });
      setLocations((current) => append ? [...current, ...payload.results] : payload.results);
      setTotal(payload.info.count);
      setNextPage(getNextPage(payload.info.next));
    } catch (requestError) {
      setError(requestError.message);
      if (!append) setLocations([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [dimension, query, type]);

  useEffect(() => {
    loadLocations();
  }, []);

  const header = (
    <View>
      <Text style={styles.eyebrow}>MULTIVERSE CARTOGRAPHY</Text>
      <Text style={styles.title}>Locations</Text>
      <Text style={styles.subtitle}>Planets, dimensions, stations, and realities catalogued by the Citadel.</Text>
      <SearchBar disabled={loading} onChangeText={setQuery} onSubmit={() => loadLocations()} placeholder="Search by location name" value={query} />
      <Pressable onPress={() => setFilterOpen((open) => !open)} style={styles.filterToggle}>
        <View style={styles.filterLabel}>
          <Ionicons color={colors.cyan} name="options-outline" size={19} />
          <Text style={styles.filterText}>Type & dimension</Text>
        </View>
        <Ionicons color={colors.muted} name={filterOpen ? 'chevron-up' : 'chevron-down'} size={19} />
      </Pressable>
      {filterOpen ? (
        <View style={styles.filterPanel}>
          <FilterField label="Location type" onChangeText={setType} placeholder="Planet, Dimension, Space station..." value={type} />
          <FilterField label="Dimension" onChangeText={setDimension} placeholder="Dimension C-137..." value={dimension} />
          <View style={styles.filterActions}>
            <Pressable onPress={() => { setType(''); setDimension(''); setQuery(''); }} style={styles.clearButton}><Text style={styles.clearText}>Clear</Text></Pressable>
            <Pressable onPress={() => loadLocations()} style={styles.applyButton}><Text style={styles.applyText}>Apply filters</Text></Pressable>
          </View>
        </View>
      ) : null}
      <View style={styles.resultRow}>
        <Text style={styles.resultCount}>{total} mapped locations</Text>
        <Text style={styles.resultHint}>Resident manifests included</Text>
      </View>
    </View>
  );

  if (loading && locations.length === 0) {
    return <View style={styles.screen}><AmbientBackground /><View style={styles.loadingHeader}>{header}</View><LoadingState label="Charting dimensions..." /></View>;
  }

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <FlatList
        columnWrapperStyle={columns > 1 ? styles.columns : undefined}
        contentContainerStyle={styles.list}
        data={locations}
        key={`locations-${columns}`}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<MessageState actionLabel="Try again" message={error ?? 'No location matches these filters.'} onAction={() => loadLocations()} title={error ? 'Map signal lost' : 'No locations found'} />}
        ListFooterComponent={nextPage ? (
          <Pressable disabled={loadingMore} onPress={() => loadLocations({ page: nextPage, append: true })} style={styles.loadMore}>
            <Text style={styles.loadMoreText}>{loadingMore ? 'Mapping...' : 'Load more locations'}</Text>
          </Pressable>
        ) : null}
        ListHeaderComponent={header}
        numColumns={columns}
        onRefresh={() => loadLocations()}
        refreshing={loading && locations.length > 0}
        renderItem={({ item }) => <View style={styles.gridItem}><LocationCard location={item} onPress={() => navigation.navigate('LocationDetail', { location: item })} /></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  loadingHeader: { alignSelf: 'center', maxWidth: layout.maxContent, paddingHorizontal: 18, paddingTop: 18, width: '100%' },
  list: { alignSelf: 'center', maxWidth: layout.maxContent, padding: 18, paddingBottom: 120, width: '100%' },
  columns: { gap: 14 },
  gridItem: { flex: 1 },
  eyebrow: { color: colors.cyan, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, marginTop: 4 },
  title: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 34, marginTop: 5 },
  subtitle: { color: colors.muted, fontFamily: fonts.body, lineHeight: 21, marginBottom: 17, marginTop: 7 },
  filterToggle: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 13, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 13 },
  filterLabel: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  filterText: { color: colors.text, fontFamily: fonts.bodyBold },
  filterPanel: { backgroundColor: colors.surface, borderBottomLeftRadius: 14, borderBottomRightRadius: 14, borderColor: colors.border, borderTopWidth: 0, borderWidth: 1, padding: 14 },
  filterActions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  clearButton: { borderColor: colors.border, borderRadius: 10, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 11 },
  clearText: { color: colors.muted, fontFamily: fonts.bodyBold },
  applyButton: { backgroundColor: colors.portal, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 11 },
  applyText: { color: colors.ink, fontFamily: fonts.bodyBold },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 18 },
  resultCount: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 13 },
  resultHint: { color: colors.muted, fontFamily: fonts.body, fontSize: 11 },
  loadMore: { alignItems: 'center', borderColor: colors.portal, borderRadius: 14, borderWidth: 1, marginTop: 2, padding: 15 },
  loadMoreText: { color: colors.portal, fontFamily: fonts.bodyBold },
});
