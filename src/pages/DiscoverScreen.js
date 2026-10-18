import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { fetchCharacters, fetchEpisodes, fetchLocations, fetchResource } from '../api/rickAndMortyApi';
import AmbientBackground from '../components/AmbientBackground';
import CharacterCard from '../components/CharacterCard';
import { LoadingState, MessageState } from '../components/ScreenState';
import { selectionFeedback } from '../utils/feedback';
import { colors, fonts, gradients, layout } from '../theme';

const archives = [
  { key: 'Characters', icon: 'people', label: 'Characters', color: colors.portal },
  { key: 'Locations', icon: 'planet', label: 'Locations', color: colors.cyan },
  { key: 'Episodes', icon: 'film', label: 'Episodes', color: colors.violet },
];

const modules = [
  { route: 'Search', icon: 'search', label: 'Universal Search', copy: 'Scan every record at once.' },
  { route: 'Lab', icon: 'flask', label: 'Multiverse Lab', copy: 'Compare, analyze, connect.' },
  { route: 'Quiz', icon: 'game-controller', label: 'Brainalyzer', copy: 'Test your knowledge.' },
];

function PortalVisual() {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spin, { duration: 16000, toValue: 1, useNativeDriver: Platform.OS !== 'web' }),
    );
    animation.start();
    return () => animation.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const reverse = spin.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });

  return (
    <View style={styles.portalWrap}>
      <Animated.View style={[styles.portalRing, styles.portalRingOuter, { transform: [{ rotate }] }]} />
      <Animated.View style={[styles.portalRing, styles.portalRingInner, { transform: [{ rotate: reverse }] }]} />
      <LinearGradient colors={gradients.portal} style={styles.portalCore}>
        <Ionicons color={colors.ink} name="planet" size={37} />
      </LinearGradient>
    </View>
  );
}

export default function DiscoverScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [randomizing, setRandomizing] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [characters, locations, episodes] = await Promise.all([
        fetchCharacters(), fetchLocations(), fetchEpisodes(),
      ]);
      setStats({ Characters: characters.info.count, Locations: locations.info.count, Episodes: episodes.info.count });
      setFeatured(characters.results[Math.floor(Math.random() * characters.results.length)]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const open = (route) => {
    selectionFeedback();
    navigation.navigate(route);
  };

  const surpriseMe = async () => {
    if (!stats?.Characters || randomizing) return;
    selectionFeedback();
    setRandomizing(true);
    try {
      setFeatured(await fetchResource('character', Math.floor(Math.random() * stats.Characters) + 1));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setRandomizing(false);
    }
  };

  if (loading && !stats) return <View style={styles.screen}><AmbientBackground /><LoadingState label="Synchronizing realities..." /></View>;
  if (error && !stats) return <View style={styles.screen}><AmbientBackground /><MessageState actionLabel="Try again" message={error} onAction={loadDashboard} title="Portal connection lost" /></View>;

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <LinearGradient colors={['#162226', '#0b1315']} style={StyleSheet.absoluteFill} />
          <View style={styles.heroCopy}>
            <View style={styles.liveBadge}><View style={styles.liveDot} /><Text style={styles.liveText}>API LINK ONLINE</Text></View>
            <Text style={styles.kicker}>CENTRAL FINITE CURVE DATABASE</Text>
            <Text style={styles.title}>THE ULTIMATE{`\n`}RICK & MORTY{`\n`}EXPLORER</Text>
            <Text style={styles.subtitle}>Characters. Dimensions. Episodes. One connected multiverse.</Text>
          </View>
          <PortalVisual />
        </View>

        <View style={styles.archives}>
          {archives.map((archive) => (
            <Pressable key={archive.key} onPress={() => open(archive.key)} style={({ pressed }) => [styles.archiveCard, pressed && styles.pressed]}>
              <Ionicons color={archive.color} name={archive.icon} size={21} />
              <Text style={styles.archiveNumber}>{stats?.[archive.key] ?? '—'}</Text>
              <Text style={styles.archiveLabel}>{archive.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View><Text style={styles.sectionEyebrow}>EXPLORATION MODULES</Text><Text style={styles.sectionTitle}>Go beyond browsing</Text></View>
          <Ionicons color={colors.mutedDark} name="apps-outline" size={21} />
        </View>
        <View style={styles.modules}>
          {modules.map((module, index) => (
            <Pressable key={module.route} onPress={() => open(module.route)} style={({ pressed }) => [styles.moduleCard, pressed && styles.pressed]}>
              <Text style={styles.moduleIndex}>0{index + 1}</Text>
              <View style={styles.moduleIcon}><Ionicons color={index === 1 ? colors.violet : index === 2 ? colors.warning : colors.cyan} name={module.icon} size={22} /></View>
              <View style={styles.moduleCopy}><Text style={styles.moduleTitle}>{module.label}</Text><Text style={styles.moduleText}>{module.copy}</Text></View>
              <Ionicons color={colors.mutedDark} name="arrow-forward" size={18} />
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View><Text style={styles.sectionEyebrow}>PORTAL ROULETTE</Text><Text style={styles.sectionTitle}>Random specimen</Text></View>
          <Pressable disabled={randomizing} onPress={surpriseMe} style={styles.randomButton}><Ionicons color={colors.ink} name="shuffle" size={17} /><Text style={styles.randomText}>{randomizing ? 'Opening' : 'Reroll'}</Text></Pressable>
        </View>
        {featured ? <CharacterCard character={featured} onPress={() => navigation.navigate('CharacterDetail', { character: featured })} /> : null}

        <View style={styles.footerActions}>
          <Pressable onPress={() => open('About')} style={styles.footerLink}><Text style={styles.footerText}>About the project</Text><Ionicons color={colors.muted} name="arrow-forward" size={17} /></Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: layout.maxContent, padding: 18, paddingBottom: 110, width: '100%' },
  hero: { borderColor: colors.border, borderRadius: 28, borderWidth: 1, minHeight: 330, overflow: 'hidden', padding: 23, position: 'relative' },
  heroCopy: { maxWidth: 610, zIndex: 2 },
  liveBadge: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#c7ff4a10', borderColor: '#c7ff4a35', borderRadius: 999, borderWidth: 1, flexDirection: 'row', gap: 7, paddingHorizontal: 10, paddingVertical: 6 },
  liveDot: { backgroundColor: colors.portal, borderRadius: 5, height: 7, width: 7 },
  liveText: { color: colors.portal, fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1.2 },
  kicker: { color: colors.cyan, fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1.6, marginTop: 25 },
  title: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 31, lineHeight: 38, marginTop: 10 },
  subtitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 14, lineHeight: 21, marginTop: 13, maxWidth: 360 },
  portalWrap: { height: 190, opacity: 0.9, position: 'absolute', right: -28, top: 54, width: 190 },
  portalRing: { borderRadius: 999, position: 'absolute' },
  portalRingOuter: { borderColor: colors.portal, borderStyle: 'dashed', borderWidth: 3, height: 190, width: 190 },
  portalRingInner: { borderColor: colors.cyan, borderStyle: 'dotted', borderWidth: 3, height: 142, left: 24, top: 24, width: 142 },
  portalCore: { alignItems: 'center', borderRadius: 48, height: 96, justifyContent: 'center', left: 47, position: 'absolute', top: 47, width: 96 },
  archives: { flexDirection: 'row', gap: 9, marginTop: 12 },
  archiveCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, flex: 1, paddingHorizontal: 4, paddingVertical: 15 },
  archiveNumber: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 21, marginTop: 7 },
  archiveLabel: { color: colors.muted, fontFamily: fonts.body, fontSize: 9, marginTop: 3 },
  sectionHeader: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 28 },
  sectionEyebrow: { color: colors.cyan, fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1.5 },
  sectionTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 18, marginTop: 4 },
  modules: { gap: 9 },
  moduleCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 17, borderWidth: 1, flexDirection: 'row', gap: 12, padding: 14 },
  moduleIndex: { color: colors.mutedDark, fontFamily: fonts.display, fontSize: 10 },
  moduleIcon: { alignItems: 'center', backgroundColor: colors.surfaceRaised, borderRadius: 13, height: 44, justifyContent: 'center', width: 44 },
  moduleCopy: { flex: 1 },
  moduleTitle: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 14 },
  moduleText: { color: colors.muted, fontFamily: fonts.body, fontSize: 11, marginTop: 2 },
  randomButton: { alignItems: 'center', backgroundColor: colors.portal, borderRadius: 999, flexDirection: 'row', gap: 6, paddingHorizontal: 13, paddingVertical: 9 },
  randomText: { color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 11 },
  footerActions: { borderTopColor: colors.border, borderTopWidth: 1, marginTop: 24, paddingTop: 15 },
  footerLink: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  footerText: { color: colors.muted, fontFamily: fonts.bodyMedium, fontSize: 12 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.99 }] },
});
