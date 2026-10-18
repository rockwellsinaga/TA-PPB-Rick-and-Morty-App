import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AmbientBackground from '../components/AmbientBackground';
import { colors, fonts } from '../theme';

const features = [
  ['search-outline', 'Universal search', 'Find characters, locations, and episodes through one portal.'],
  ['git-compare-outline', 'Comparison Lab', 'Place two specimens side by side and measure what connects them.'],
  ['stats-chart-outline', 'Galactic statistics', 'Explore live distributions and record-breaking entities.'],
  ['share-social-outline', 'Relationship map', 'Trace a character through episodes and their closest co-stars.'],
  ['help-circle-outline', 'Quiz mode', 'Test your multiverse knowledge with generated challenges.'],
  ['bookmark-outline', 'Personal archive', 'Save and share any discovery directly from its record.'],
];

export default function AboutScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroIcon}><Ionicons color={colors.portal} name="planet" size={58} /></View>
        <Text style={styles.eyebrow}>UNOFFICIAL MULTIVERSE DATABASE</Text>
        <Text style={styles.title}>Every known corner of Rick and Morty, connected.</Text>
        <Text style={styles.paragraph}>
          The Ultimate Rick and Morty Explorer turns the public API into an interactive field guide. Search the whole universe, compare specimens, reveal relationships, inspect live statistics, and test what you know.
        </Text>

        <View style={styles.featureGrid}>
          {features.map(([icon, title, copy]) => (
            <View key={title} style={styles.featureCard}>
              <Ionicons color={colors.cyan} name={icon} size={23} />
              <Text style={styles.featureTitle}>{title}</Text>
              <Text style={styles.featureCopy}>{copy}</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Data & attribution</Text>
          <Text style={styles.paragraph}>
            Character, location, and episode records are provided by the community-built Rick and Morty API. Rick and Morty and all related properties belong to their respective rights holders. This learning and portfolio project is not affiliated with Adult Swim.
          </Text>
          <Pressable onPress={() => Linking.openURL('https://rickandmortyapi.com/documentation')} style={styles.textLink}>
            <Text style={styles.linkText}>Read the API documentation</Text>
            <Ionicons color={colors.cyan} name="open-outline" size={16} />
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate('Profile')} style={styles.profileButton}>
          <View>
            <Text style={styles.profileEyebrow}>BUILT BY</Text>
            <Text style={styles.profileButtonText}>Meet the developer</Text>
          </View>
          <Ionicons color={colors.ink} name="arrow-forward" size={21} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 760, padding: 22, paddingBottom: 48, width: '100%' },
  heroIcon: { alignItems: 'center', alignSelf: 'center', backgroundColor: '#b7f34a18', borderColor: colors.portal, borderRadius: 55, borderWidth: 1, height: 110, justifyContent: 'center', marginBottom: 19, width: 110 },
  eyebrow: { color: colors.portal, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, textAlign: 'center' },
  title: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 31, lineHeight: 39, marginBottom: 16, marginTop: 8, textAlign: 'center' },
  paragraph: { color: colors.muted, fontFamily: fonts.body, fontSize: 15, lineHeight: 24 },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 24 },
  featureCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, minWidth: 150, padding: 16, width: '48%' },
  featureTitle: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 15, marginTop: 9 },
  featureCopy: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, lineHeight: 18, marginTop: 5 },
  panel: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, marginTop: 22, padding: 18 },
  panelTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 17, marginBottom: 8 },
  textLink: { alignItems: 'center', flexDirection: 'row', gap: 7, marginTop: 15 },
  linkText: { color: colors.cyan, fontFamily: fonts.bodyBold },
  profileButton: { alignItems: 'center', backgroundColor: colors.portal, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, paddingHorizontal: 18, paddingVertical: 15 },
  profileEyebrow: { color: colors.portalDark, fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1.2 },
  profileButtonText: { color: colors.ink, fontFamily: fonts.bodyBold, fontSize: 16, marginTop: 2 },
});
