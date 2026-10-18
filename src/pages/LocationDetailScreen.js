import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { fetchRelatedResources } from '../api/rickAndMortyApi';
import CharacterTile from '../components/CharacterTile';
import { ApiRecordLink, DetailRow, formatDatabaseDate, SectionTitle } from '../components/DetailElements';
import FavoriteButton from '../components/FavoriteButton';
import { LoadingState, MessageState } from '../components/ScreenState';
import ShareButton from '../components/ShareButton';
import useResolvedResource from '../hooks/useResolvedResource';
import { colors, fonts } from '../theme';

export default function LocationDetailScreen({ route, navigation }) {
  const { item: location, loading, error } = useResolvedResource(route.params?.location, route.params?.locationUrl);
  const [residents, setResidents] = useState([]);
  const [residentsLoading, setResidentsLoading] = useState(false);
  const [residentsError, setResidentsError] = useState(null);

  const loadResidents = async () => {
    if (!location) return;
    setResidentsLoading(true);
    setResidentsError(null);
    try {
      setResidents(await fetchRelatedResources('character', location.residents));
    } catch (requestError) {
      setResidentsError(requestError.message);
    } finally {
      setResidentsLoading(false);
    }
  };

  useEffect(() => {
    if (location) loadResidents();
  }, [location?.id]);

  if (loading) return <View style={styles.screen}><LoadingState label="Resolving coordinates..." /></View>;
  if (error || !location) return <View style={styles.screen}><MessageState message={error ?? 'Location unavailable.'} title="Coordinates not found" /></View>;

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.planet}><Ionicons color={colors.cyan} name="planet" size={62} /></View>
        <Text style={styles.eyebrow}>LOCATION #{location.id}</Text>
        <Text style={styles.title}>{location.name}</Text>
        <Text style={styles.subtitle}>{location.type || 'Unknown type'} · {location.dimension || 'Unknown dimension'}</Text>
        <View style={styles.actions}>
          <FavoriteButton item={location} resourceType="location" />
          <ShareButton item={location} resourceType="location" />
        </View>
      </View>

      <SectionTitle eyebrow="CITADEL CARTOGRAPHY" title="Location record" />
      <View style={styles.panel}>
        <DetailRow label="Type" value={location.type} />
        <DetailRow label="Dimension" value={location.dimension} />
        <DetailRow label="Known residents" value={String(location.residents?.length ?? 0)} />
        <DetailRow label="API record created" value={formatDatabaseDate(location.created)} last />
      </View>
      <ApiRecordLink url={location.url} />

      <SectionTitle count={location.residents?.length ?? 0} eyebrow="LAST KNOWN SIGNALS" title="Residents" />
      {residentsLoading ? <LoadingState label="Reading resident manifest..." /> : null}
      {residentsError ? <MessageState actionLabel="Retry" message={residentsError} onAction={loadResidents} title="Manifest unavailable" /> : null}
      {!residentsLoading && !residentsError && residents.length === 0 ? <MessageState message="No known residents are registered here." title="Uninhabited" /> : null}
      {!residentsLoading && residents.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail}>
          {residents.map((character) => (
            <CharacterTile key={character.id} character={character} onPress={() => navigation.navigate('CharacterDetail', { character })} />
          ))}
        </ScrollView>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 760, padding: 20, paddingBottom: 48, width: '100%' },
  hero: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 24, borderWidth: 1, overflow: 'hidden', padding: 24 },
  planet: { alignItems: 'center', backgroundColor: '#45d7df18', borderColor: colors.cyan, borderRadius: 54, borderWidth: 1, height: 108, justifyContent: 'center', marginBottom: 17, width: 108 },
  eyebrow: { color: colors.cyan, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.4 },
  title: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 27, marginTop: 7, textAlign: 'center' },
  subtitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 14, marginTop: 7, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  panel: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, paddingHorizontal: 18 },
  rail: { marginHorizontal: -20, paddingHorizontal: 20 },
});
