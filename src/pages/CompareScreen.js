import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { fetchRelatedResources } from '../api/rickAndMortyApi';
import AmbientBackground from '../components/AmbientBackground';
import CharacterPicker from '../components/CharacterPicker';
import { EpisodeCard } from '../components/ResourceCards';
import { LoadingState, MessageState } from '../components/ScreenState';
import { compareCharacters } from '../utils/analytics';
import { selectionFeedback } from '../utils/feedback';
import { colors, fonts, gradients, layout } from '../theme';

function Specimen({ character }) {
  return (
    <LinearGradient colors={gradients.card} style={styles.specimen}>
      <Image source={{ uri: character.image }} style={styles.specimenImage} />
      <Text style={styles.specimenId}>SPECIMEN #{character.id}</Text>
      <Text style={styles.specimenName}>{character.name}</Text>
      <Text style={styles.specimenMeta}>{character.status} · {character.species}</Text>
      <View style={styles.specimenData}>
        <Text style={styles.dataLabel}>Origin</Text><Text numberOfLines={1} style={styles.dataValue}>{character.origin?.name}</Text>
        <Text style={styles.dataLabel}>Last location</Text><Text numberOfLines={1} style={styles.dataValue}>{character.location?.name}</Text>
        <Text style={styles.dataLabel}>Appearances</Text><Text style={styles.dataValue}>{character.episode.length} episodes</Text>
      </View>
    </LinearGradient>
  );
}

function MatchRow({ label, match, detail }) {
  return (
    <View style={styles.matchRow}>
      <View style={[styles.matchIcon, match ? styles.matchYes : styles.matchNo]}>
        <Ionicons color={match ? colors.ink : colors.muted} name={match ? 'checkmark' : 'close'} size={16} />
      </View>
      <View style={styles.matchCopy}>
        <Text style={styles.matchLabel}>{label}</Text>
        <Text style={styles.matchDetail}>{detail}</Text>
      </View>
    </View>
  );
}

export default function CompareScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [selected, setSelected] = useState([]);
  const [sharedEpisodes, setSharedEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [error, setError] = useState(null);
  const comparison = useMemo(
    () => selected.length === 2 ? compareCharacters(selected[0], selected[1]) : null,
    [selected],
  );

  useEffect(() => {
    if (!comparison?.sharedEpisodes.length) {
      setSharedEpisodes([]);
      return;
    }
    setLoadingEpisodes(true);
    setError(null);
    fetchRelatedResources('episode', comparison.sharedEpisodes)
      .then(setSharedEpisodes)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoadingEpisodes(false));
  }, [comparison]);

  const toggle = (character) => {
    setSelected((current) => {
      const exists = current.some((item) => item.id === character.id);
      if (exists) return current.filter((item) => item.id !== character.id);
      return current.length < 2 ? [...current, character] : current;
    });
  };

  const clear = () => {
    selectionFeedback();
    setSelected([]);
  };

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>MULTIVERSE LAB / MODULE 01</Text>
        <Text style={styles.title}>Character{`\n`}Comparison</Text>
        <Text style={styles.subtitle}>Select two specimens and analyze where their timelines overlap.</Text>

        <CharacterPicker max={2} onToggle={toggle} selected={selected} />

        {selected.length ? (
          <View style={[styles.specimens, { flexDirection: width >= 720 ? 'row' : 'column' }]}>
            {selected.map((character) => <Specimen character={character} key={character.id} />)}
          </View>
        ) : null}

        {selected.length === 1 ? (
          <View style={styles.waitingCard}>
            <Ionicons color={colors.violet} name="git-compare-outline" size={30} />
            <Text style={styles.waitingTitle}>One more specimen needed</Text>
            <Text style={styles.waitingText}>Search above and select a second character to begin the comparison.</Text>
          </View>
        ) : null}

        {comparison ? (
          <View>
            <LinearGradient colors={gradients.portal} style={styles.scoreCard}>
              <View>
                <Text style={styles.scoreEyebrow}>DERIVED CONNECTION SCORE</Text>
                <Text style={styles.scoreTitle}>Timeline compatibility</Text>
              </View>
              <Text style={styles.score}>{comparison.score}%</Text>
            </LinearGradient>

            <View style={styles.matchPanel}>
              <MatchRow detail={comparison.sameSpecies ? selected[0].species : `${selected[0].species} / ${selected[1].species}`} label="Same species" match={comparison.sameSpecies} />
              <MatchRow detail={comparison.sameOrigin ? selected[0].origin.name : 'Different origin points'} label="Same origin" match={comparison.sameOrigin} />
              <MatchRow detail={comparison.sameLocation ? selected[0].location.name : 'Different last signals'} label="Same last location" match={comparison.sameLocation} />
              <MatchRow detail={`${comparison.sharedEpisodes.length} shared adventures`} label="Shared episodes" match={comparison.sharedEpisodes.length > 0} />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Shared timeline</Text>
              <Text style={styles.sectionCount}>{comparison.sharedEpisodes.length}</Text>
            </View>
            {loadingEpisodes ? <LoadingState label="Cross-referencing timelines..." /> : null}
            {error ? <MessageState message={error} title="Timeline unavailable" /> : null}
            {!loadingEpisodes && !error && sharedEpisodes.length === 0 ? <MessageState message="These characters never appear in the same episode." title="No shared timeline" /> : null}
            {sharedEpisodes.map((episode) => <EpisodeCard episode={episode} key={episode.id} onPress={() => navigation.navigate('EpisodeDetail', { episode })} />)}

            <Pressable onPress={clear} style={styles.clearButton}><Text style={styles.clearText}>Compare another pair</Text></Pressable>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: layout.maxContent, padding: 18, paddingBottom: 48, width: '100%' },
  eyebrow: { color: colors.violet, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.7, marginTop: 6 },
  title: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 34, lineHeight: 41, marginTop: 9 },
  subtitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginTop: 9 },
  specimens: { gap: 12, marginTop: 22 },
  specimen: { borderColor: colors.border, borderRadius: 22, borderWidth: 1, flex: 1, overflow: 'hidden', padding: 16 },
  specimenImage: { aspectRatio: 1.35, borderRadius: 15, width: '100%' },
  specimenId: { color: colors.cyan, fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1.3, marginTop: 13 },
  specimenName: { color: colors.text, fontFamily: fonts.display, fontSize: 17, marginTop: 5 },
  specimenMeta: { color: colors.portal, fontFamily: fonts.bodyMedium, fontSize: 12, marginTop: 6 },
  specimenData: { borderTopColor: colors.border, borderTopWidth: 1, marginTop: 14, paddingTop: 10 },
  dataLabel: { color: colors.muted, fontFamily: fonts.body, fontSize: 10, marginTop: 7 },
  dataValue: { color: colors.text, fontFamily: fonts.bodySemiBold, fontSize: 12, marginTop: 1 },
  waitingCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, marginTop: 18, padding: 25 },
  waitingTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 15, marginTop: 10 },
  waitingText: { color: colors.muted, fontFamily: fonts.body, lineHeight: 20, marginTop: 7, textAlign: 'center' },
  scoreCard: { alignItems: 'center', borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', marginTop: 22, padding: 18 },
  scoreEyebrow: { color: colors.portalDark, fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1.2 },
  scoreTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 15, marginTop: 4 },
  score: { color: colors.ink, fontFamily: fonts.displayHeavy, fontSize: 32 },
  matchPanel: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, marginTop: 12, padding: 10 },
  matchRow: { alignItems: 'center', flexDirection: 'row', gap: 12, padding: 10 },
  matchIcon: { alignItems: 'center', borderRadius: 15, height: 30, justifyContent: 'center', width: 30 },
  matchYes: { backgroundColor: colors.portal },
  matchNo: { backgroundColor: colors.surfaceBright },
  matchCopy: { flex: 1 },
  matchLabel: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 13 },
  matchDetail: { color: colors.muted, fontFamily: fonts.body, fontSize: 11, marginTop: 2 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 26 },
  sectionTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 17 },
  sectionCount: { color: colors.portal, fontFamily: fonts.bodyBold },
  clearButton: { alignItems: 'center', borderColor: colors.borderBright, borderRadius: 14, borderWidth: 1, marginTop: 14, padding: 14 },
  clearText: { color: colors.text, fontFamily: fonts.bodyBold },
});
