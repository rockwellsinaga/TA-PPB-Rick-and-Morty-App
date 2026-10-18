import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import AmbientBackground from '../components/AmbientBackground';
import CharacterCard from '../components/CharacterCard';
import { FilterChip } from '../components/FilterControls';
import { EpisodeCard, LocationCard } from '../components/ResourceCards';
import { LoadingState, MessageState } from '../components/ScreenState';
import { useFavorites } from '../context/FavoritesContext';
import { colors, fonts, layout } from '../theme';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Characters', value: 'character' },
  { label: 'Locations', value: 'location' },
  { label: 'Episodes', value: 'episode' },
];

export default function FavoritesScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 2 : 1;
  const { favorites, ready } = useFavorites();
  const [category, setCategory] = useState('all');
  const visibleFavorites = useMemo(
    () => category === 'all' ? favorites : favorites.filter((favorite) => favorite.resourceType === category),
    [category, favorites],
  );

  const openFavorite = (favorite) => {
    const routes = { character: 'CharacterDetail', location: 'LocationDetail', episode: 'EpisodeDetail' };
    navigation.navigate(routes[favorite.resourceType], { [favorite.resourceType]: favorite.item });
  };

  const renderFavorite = ({ item: favorite }) => {
    if (favorite.resourceType === 'character') {
      return <CharacterCard character={favorite.item} onPress={() => openFavorite(favorite)} />;
    }
    if (favorite.resourceType === 'location') {
      return <LocationCard location={favorite.item} onPress={() => openFavorite(favorite)} />;
    }
    return <EpisodeCard episode={favorite.item} onPress={() => openFavorite(favorite)} />;
  };

  if (!ready) return <View style={styles.screen}><AmbientBackground /><LoadingState label="Opening your archive..." /></View>;

  const header = (
    <View>
      <Text style={styles.eyebrow}>PERSONAL ARCHIVE</Text>
      <Text style={styles.title}>Saved</Text>
      <Text style={styles.subtitle}>Your favorite specimens, coordinates, and transmissions stay on this device.</Text>
      <View style={styles.chips}>
        {categories.map((option) => (
          <FilterChip key={option.value} label={option.label} onPress={() => setCategory(option.value)} selected={category === option.value} />
        ))}
      </View>
      <Text style={styles.count}>{visibleFavorites.length} saved records</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <FlatList
        columnWrapperStyle={columns > 1 ? styles.columns : undefined}
        contentContainerStyle={styles.content}
        data={visibleFavorites}
        key={`favorites-${columns}`}
        keyExtractor={(favorite) => `${favorite.resourceType}-${favorite.item.id}`}
        ListEmptyComponent={<MessageState message={favorites.length ? 'Nothing is saved in this category yet.' : 'Use the Save button on any character, location, or episode detail.'} title="Your archive is empty" />}
        ListHeaderComponent={header}
        numColumns={columns}
        renderItem={(item) => <View style={styles.gridItem}>{renderFavorite(item)}</View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: layout.maxContent, padding: 18, paddingBottom: 120, width: '100%' },
  columns: { gap: 14 },
  gridItem: { flex: 1 },
  eyebrow: { color: colors.portal, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, marginTop: 4 },
  title: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 34, marginTop: 5 },
  subtitle: { color: colors.muted, fontFamily: fonts.body, lineHeight: 21, marginTop: 7 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 },
  count: { color: colors.muted, fontFamily: fonts.bodyBold, fontSize: 12, marginBottom: 14, marginTop: 18 },
});
