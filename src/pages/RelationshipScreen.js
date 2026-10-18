import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { fetchRelatedResources, fetchResourcesByIds } from '../api/rickAndMortyApi';
import AmbientBackground from '../components/AmbientBackground';
import CharacterPicker from '../components/CharacterPicker';
import CharacterTile from '../components/CharacterTile';
import RelationshipGraph from '../components/RelationshipGraph';
import { LoadingState, MessageState } from '../components/ScreenState';
import { tallyCoStars } from '../utils/analytics';
import { colors, fonts, layout } from '../theme';

export default function RelationshipScreen({ navigation }) {
  const [selected, setSelected] = useState([]);
  const [connections, setConnections] = useState([]);
  const [episodeCount, setEpisodeCount] = useState(0);
  const [totalConnections, setTotalConnections] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const character = selected[0];

  useEffect(() => {
    if (!character) {
      setConnections([]);
      return;
    }

    const loadNetwork = async () => {
      setLoading(true);
      setError(null);
      try {
        const episodes = await fetchRelatedResources('episode', character.episode);
        const ranked = tallyCoStars(episodes, character.id);
        const top = ranked.slice(0, 8);
        const characters = await fetchResourcesByIds('character', top.map((item) => item.id));
        const byId = new Map(characters.map((item) => [item.id, item]));
        setEpisodeCount(episodes.length);
        setTotalConnections(ranked.length);
        setConnections(top.map((item) => ({ ...item, character: byId.get(item.id) })).filter((item) => item.character));
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadNetwork();
  }, [character?.id]);

  const toggle = (item) => setSelected((current) => current[0]?.id === item.id ? [] : [item]);
  const openCharacter = (item) => navigation.navigate('CharacterDetail', { character: item });

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>MULTIVERSE LAB / MODULE 03</Text>
        <Text style={styles.title}>Relationship{`\n`}Explorer</Text>
        <Text style={styles.subtitle}>Trace a specimen’s strongest co-appearance links across every known episode.</Text>

        <CharacterPicker max={1} onToggle={toggle} selected={selected} />

        {!character ? (
          <View style={styles.promptCard}>
            <Ionicons color={colors.cyan} name="git-network-outline" size={42} />
            <Text style={styles.promptTitle}>Select a character</Text>
            <Text style={styles.promptText}>The lab will calculate frequent co-stars and visualize the strongest links.</Text>
          </View>
        ) : null}

        {loading ? <LoadingState label="Mapping shared timelines..." /> : null}
        {error ? <MessageState message={error} title="Network scan failed" /> : null}

        {!loading && !error && character ? (
          <View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}><Text style={styles.summaryValue}>{episodeCount}</Text><Text style={styles.summaryLabel}>Episodes scanned</Text></View>
              <View style={styles.summaryCard}><Text style={styles.summaryValue}>{totalConnections}</Text><Text style={styles.summaryLabel}>Unique co-stars</Text></View>
              <View style={styles.summaryCard}><Text style={styles.summaryValue}>{connections[0]?.appearances ?? 0}</Text><Text style={styles.summaryLabel}>Strongest link</Text></View>
            </View>

            {connections.length ? (
              <View style={styles.graphCard}>
                <View style={styles.graphHeader}>
                  <View>
                    <Text style={styles.graphEyebrow}>TOP CONNECTIONS</Text>
                    <Text style={styles.graphTitle}>{character.name}'s orbit</Text>
                  </View>
                  <Text style={styles.graphHint}>Line weight = shared episodes</Text>
                </View>
                <RelationshipGraph centerCharacter={character} connections={connections.slice(0, 6)} onPressCharacter={openCharacter} />
              </View>
            ) : <MessageState message="This character has no co-stars in the indexed episodes." title="A solitary timeline" />}

            <Text style={styles.sectionTitle}>Frequent companions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail}>
              {connections.map((connection) => (
                <View key={connection.character.id} style={styles.tileWrap}>
                  <CharacterTile character={connection.character} onPress={() => openCharacter(connection.character)} />
                  <Text style={styles.sharedLabel}>{connection.appearances} shared episodes</Text>
                </View>
              ))}
            </ScrollView>

            <Pressable onPress={() => openCharacter(character)} style={styles.profileButton}>
              <Text style={styles.profileText}>Open {character.name}'s full record</Text>
              <Ionicons color={colors.ink} name="arrow-forward" size={19} />
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: layout.maxContent, padding: 18, paddingBottom: 48, width: '100%' },
  eyebrow: { color: colors.cyan, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.7, marginTop: 6 },
  title: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 34, lineHeight: 41, marginTop: 9 },
  subtitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginTop: 9 },
  promptCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 22, borderStyle: 'dashed', borderWidth: 1, marginTop: 22, padding: 28 },
  promptTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 16, marginTop: 12 },
  promptText: { color: colors.muted, fontFamily: fonts.body, lineHeight: 21, marginTop: 7, maxWidth: 450, textAlign: 'center' },
  summaryRow: { flexDirection: 'row', gap: 9, marginTop: 22 },
  summaryCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, flex: 1, padding: 13 },
  summaryValue: { color: colors.portal, fontFamily: fonts.displayHeavy, fontSize: 21 },
  summaryLabel: { color: colors.muted, fontFamily: fonts.body, fontSize: 9, marginTop: 4, textAlign: 'center' },
  graphCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 22, borderWidth: 1, marginTop: 14, overflow: 'hidden', paddingTop: 17 },
  graphHeader: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 17 },
  graphEyebrow: { color: colors.portal, fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1.3 },
  graphTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 16, marginTop: 4 },
  graphHint: { color: colors.mutedDark, fontFamily: fonts.body, fontSize: 9 },
  sectionTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 18, marginBottom: 12, marginTop: 26 },
  rail: { marginHorizontal: -18, paddingHorizontal: 18 },
  tileWrap: { marginRight: 2 },
  sharedLabel: { color: colors.cyan, fontFamily: fonts.bodyBold, fontSize: 9, marginLeft: 8, marginTop: 7 },
  profileButton: { alignItems: 'center', backgroundColor: colors.portal, borderRadius: 14, flexDirection: 'row', justifyContent: 'space-between', marginTop: 22, padding: 15 },
  profileText: { color: colors.ink, flex: 1, fontFamily: fonts.bodyBold },
});
