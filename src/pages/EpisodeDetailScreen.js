import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { fetchRelatedResources } from '../api/rickAndMortyApi';
import CharacterTile from '../components/CharacterTile';
import { ApiRecordLink, DetailRow, formatDatabaseDate, SectionTitle } from '../components/DetailElements';
import FavoriteButton from '../components/FavoriteButton';
import { LoadingState, MessageState } from '../components/ScreenState';
import useResolvedResource from '../hooks/useResolvedResource';
import { colors } from '../theme';

export default function EpisodeDetailScreen({ route, navigation }) {
  const { item: episode, loading, error } = useResolvedResource(route.params?.episode, route.params?.episodeUrl);
  const [cast, setCast] = useState([]);
  const [castLoading, setCastLoading] = useState(false);
  const [castError, setCastError] = useState(null);

  const loadCast = async () => {
    if (!episode) return;
    setCastLoading(true);
    setCastError(null);
    try {
      setCast(await fetchRelatedResources('character', episode.characters));
    } catch (requestError) {
      setCastError(requestError.message);
    } finally {
      setCastLoading(false);
    }
  };

  useEffect(() => {
    if (episode) loadCast();
  }, [episode?.id]);

  if (loading) return <View style={styles.screen}><LoadingState label="Receiving transmission..." /></View>;
  if (error || !episode) return <View style={styles.screen}><MessageState message={error ?? 'Episode unavailable.'} title="Transmission not found" /></View>;

  const [season, number] = episode.episode.split('E');

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.filmIcon}><Ionicons color={colors.portal} name="film" size={48} /></View>
        <Text style={styles.code}>{episode.episode}</Text>
        <Text style={styles.title}>{episode.name}</Text>
        <Text style={styles.subtitle}>{episode.air_date}</Text>
        <FavoriteButton item={episode} resourceType="episode" />
      </View>

      <View style={styles.quickStats}>
        <View style={styles.quickStat}><Text style={styles.quickNumber}>{season.replace('S', '')}</Text><Text style={styles.quickLabel}>Season</Text></View>
        <View style={styles.quickStat}><Text style={styles.quickNumber}>{number}</Text><Text style={styles.quickLabel}>Episode</Text></View>
        <View style={styles.quickStat}><Text style={styles.quickNumber}>{episode.characters?.length ?? 0}</Text><Text style={styles.quickLabel}>Characters</Text></View>
      </View>

      <SectionTitle eyebrow="BROADCAST RECORD" title="Episode details" />
      <View style={styles.panel}>
        <DetailRow label="Episode code" value={episode.episode} />
        <DetailRow label="Original air date" value={episode.air_date} />
        <DetailRow label="Cast size" value={String(episode.characters?.length ?? 0)} />
        <DetailRow label="API record created" value={formatDatabaseDate(episode.created)} last />
      </View>
      <ApiRecordLink url={episode.url} />

      <SectionTitle count={episode.characters?.length ?? 0} eyebrow="CAST MANIFEST" title="Characters" />
      {castLoading ? <LoadingState label="Assembling the cast..." /> : null}
      {castError ? <MessageState actionLabel="Retry" message={castError} onAction={loadCast} title="Cast unavailable" /> : null}
      {!castLoading && cast.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail}>
          {cast.map((character) => (
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
  hero: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 24, borderWidth: 1, padding: 24 },
  filmIcon: { alignItems: 'center', backgroundColor: '#b7f34a18', borderColor: colors.portal, borderRadius: 24, borderWidth: 1, height: 86, justifyContent: 'center', marginBottom: 15, width: 86 },
  code: { color: colors.portal, fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  title: { color: colors.text, fontSize: 29, fontWeight: '900', marginTop: 8, textAlign: 'center' },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 7 },
  quickStats: { flexDirection: 'row', gap: 10, marginTop: 14 },
  quickStat: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 15, borderWidth: 1, flex: 1, padding: 13 },
  quickNumber: { color: colors.text, fontSize: 20, fontWeight: '900' },
  quickLabel: { color: colors.muted, fontSize: 10, marginTop: 3 },
  panel: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, paddingHorizontal: 18 },
  rail: { marginHorizontal: -20, paddingHorizontal: 20 },
});
