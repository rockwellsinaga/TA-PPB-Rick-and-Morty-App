import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

const features = [
  ['people-outline', 'Characters', 'Complete identity files, filters, origins, locations, and appearances.'],
  ['planet-outline', 'Locations', 'Dimensions, location types, and full resident manifests.'],
  ['film-outline', 'Episodes', 'Season browsing, air dates, and complete cast manifests.'],
  ['bookmark-outline', 'Local archive', 'Favorites are stored privately on your device.'],
];

export default function AboutScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.heroIcon}><Ionicons color={colors.portal} name="planet" size={58} /></View>
      <Text style={styles.eyebrow}>UNOFFICIAL MULTIVERSE DATABASE</Text>
      <Text style={styles.title}>Every known corner of Rick and Morty, connected.</Text>
      <Text style={styles.paragraph}>
        The Ultimate Rick and Morty Explorer turns the public API into a connected field guide. Jump from a character to their origin, from a location to its residents, or from an episode to its entire cast.
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
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  content: { alignSelf: 'center', maxWidth: 760, padding: 22, paddingBottom: 48, width: '100%' },
  heroIcon: { alignItems: 'center', alignSelf: 'center', backgroundColor: '#b7f34a18', borderColor: colors.portal, borderRadius: 55, borderWidth: 1, height: 110, justifyContent: 'center', marginBottom: 19, width: 110 },
  eyebrow: { color: colors.portal, fontSize: 10, fontWeight: '900', letterSpacing: 1.5, textAlign: 'center' },
  title: { color: colors.text, fontSize: 31, fontWeight: '900', lineHeight: 37, marginBottom: 16, marginTop: 8, textAlign: 'center' },
  paragraph: { color: colors.muted, fontSize: 15, lineHeight: 24 },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 24 },
  featureCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, minWidth: 150, padding: 16, width: '48%' },
  featureTitle: { color: colors.text, fontSize: 15, fontWeight: '900', marginTop: 9 },
  featureCopy: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 5 },
  panel: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, marginTop: 22, padding: 18 },
  panelTitle: { color: colors.text, fontSize: 19, fontWeight: '900', marginBottom: 8 },
  textLink: { alignItems: 'center', flexDirection: 'row', gap: 7, marginTop: 15 },
  linkText: { color: colors.cyan, fontWeight: '900' },
  profileButton: { alignItems: 'center', backgroundColor: colors.portal, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, paddingHorizontal: 18, paddingVertical: 15 },
  profileEyebrow: { color: colors.portalDark, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  profileButtonText: { color: colors.ink, fontSize: 16, fontWeight: '900', marginTop: 2 },
});
