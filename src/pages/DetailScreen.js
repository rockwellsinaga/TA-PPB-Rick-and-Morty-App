import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { fetchRelatedResources } from '../api/rickAndMortyApi';
import { ApiRecordLink, DetailRow, formatDatabaseDate, LinkCard, SectionTitle } from '../components/DetailElements';
import FavoriteButton from '../components/FavoriteButton';
import { EpisodeCard } from '../components/ResourceCards';
import { LoadingState, MessageState } from '../components/ScreenState';
import ShareButton from '../components/ShareButton';
import { colors, fonts } from '../theme';

const statusColor = { Alive: colors.portal, Dead: colors.danger, unknown: colors.muted };

export default function DetailScreen({ route, navigation }) {
  const { character } = route.params;
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [episodeError, setEpisodeError] = useState(null);

  const loadEpisodes = async () => {
    setLoadingEpisodes(true);
    setEpisodeError(null);
    try {
      setEpisodes(await fetchRelatedResources('episode', character.episode));
    } catch (requestError) {
      setEpisodeError(requestError.message);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  useEffect(() => {
    loadEpisodes();
  }, [character.id]);

  const openLocation = (location, label) => {
    if (!location?.url) return;
    navigation.navigate('LocationDetail', { locationUrl: location.url, title: location.name, relationship: label });
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.imageShell}>
        <Image source={{ uri: character.image }} style={styles.image} />
        <View style={styles.idBadge}><Text style={styles.idText}>#{character.id}</Text></View>
      </View>
      <Text style={styles.name}>{character.name}</Text>
      <View style={styles.statusLine}>
        <View style={[styles.statusDot, { backgroundColor: statusColor[character.status] ?? colors.muted }]} />
        <Text style={styles.summary}>{character.status} · {character.species}{character.type ? ` · ${character.type}` : ''}</Text>
      </View>
      <View style={styles.actions}>
        <FavoriteButton item={character} resourceType="character" />
        <ShareButton item={character} resourceType="character" />
      </View>

      <SectionTitle eyebrow="IDENTITY FILE" title="Specimen details" />
      <View style={styles.panel}>
        <DetailRow label="Gender" value={character.gender} />
        <DetailRow label="Species" value={character.species} />
        <DetailRow label="Type / subspecies" value={character.type || 'Not specified'} />
        <DetailRow label="API record created" value={formatDatabaseDate(character.created)} last />
      </View>
      <ApiRecordLink url={character.url} />

      <SectionTitle eyebrow="SPATIAL TRACE" title="Known locations" />
      <LinkCard disabled={!character.origin?.url} icon="navigate-circle-outline" label="Origin" onPress={() => openLocation(character.origin, 'Origin')} value={character.origin?.name} />
      <LinkCard disabled={!character.location?.url} icon="location-outline" label="Last known location" onPress={() => openLocation(character.location, 'Last known location')} value={character.location?.name} />

      <SectionTitle count={character.episode?.length ?? 0} eyebrow="APPEARANCE LOG" title="Episodes" />
      {loadingEpisodes ? <LoadingState label="Loading appearances..." /> : null}
      {episodeError ? <MessageState actionLabel="Retry" message={episodeError} onAction={loadEpisodes} title="Unable to load episodes" /> : null}
      {!loadingEpisodes && !episodeError ? episodes.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} onPress={() => navigation.navigate('EpisodeDetail', { episode })} />
      )) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  content: { alignSelf: 'center', maxWidth: 720, padding: 20, paddingBottom: 44, width: '100%' },
  imageShell: { alignSelf: 'center', maxWidth: 390, position: 'relative', width: '100%' },
  image: { aspectRatio: 1, borderColor: colors.portal, borderRadius: 26, borderWidth: 3, width: '100%' },
  idBadge: { backgroundColor: colors.ink, borderColor: colors.portal, borderRadius: 999, borderWidth: 1, bottom: 14, paddingHorizontal: 12, paddingVertical: 7, position: 'absolute', right: 14 },
  idText: { color: colors.portal, fontFamily: fonts.bodyBold },
  name: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 28, marginTop: 20, textAlign: 'center' },
  statusLine: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 7 },
  statusDot: { borderRadius: 5, height: 9, marginRight: 8, width: 9 },
  summary: { color: colors.muted, fontFamily: fonts.body, fontSize: 15, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  panel: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, paddingHorizontal: 18 },
});
