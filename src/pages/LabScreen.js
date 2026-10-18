import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AmbientBackground from '../components/AmbientBackground';
import { selectionFeedback } from '../utils/feedback';
import { colors, fonts, layout } from '../theme';

const modules = [
  {
    accent: colors.violet,
    description: 'Place two specimens side by side and calculate their shared timeline.',
    icon: 'git-compare-outline',
    index: '01',
    route: 'Compare',
    title: 'Comparison Lab',
  },
  {
    accent: colors.portal,
    description: 'Analyze every character, location, and episode in the public database.',
    icon: 'bar-chart-outline',
    index: '02',
    route: 'Statistics',
    title: 'Galactic Statistics',
  },
  {
    accent: colors.cyan,
    description: 'Reveal the strongest co-appearance network around any character.',
    icon: 'git-network-outline',
    index: '03',
    route: 'Relationships',
    title: 'Relationship Explorer',
  },
];

export default function LabScreen({ navigation }) {
  const openModule = (route) => {
    selectionFeedback();
    navigation.navigate(route);
  };

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <LinearGradient colors={['#a98cff20', '#46e6e608']} style={StyleSheet.absoluteFill} />
          <View style={styles.flask}><Ionicons color={colors.violet} name="flask" size={41} /></View>
          <Text style={styles.eyebrow}>CITADEL RESEARCH DIVISION</Text>
          <Text style={styles.title}>Multiverse{`\n`}Lab</Text>
          <Text style={styles.subtitle}>Turn raw API records into comparisons, census data, and relationship intelligence.</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Research modules</Text>
          <Text style={styles.sectionCount}>03 ACTIVE</Text>
        </View>

        <View style={styles.modules}>
          {modules.map((module) => (
            <Pressable key={module.route} onPress={() => openModule(module.route)} style={({ pressed }) => [styles.moduleCard, pressed && styles.pressed]}>
              <Text style={styles.moduleIndex}>{module.index}</Text>
              <View style={[styles.moduleIcon, { backgroundColor: `${module.accent}14`, borderColor: `${module.accent}66` }]}>
                <Ionicons color={module.accent} name={module.icon} size={28} />
              </View>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleDescription}>{module.description}</Text>
              <View style={styles.openRow}><Text style={[styles.openText, { color: module.accent }]}>Open module</Text><Ionicons color={module.accent} name="arrow-forward" size={18} /></View>
            </Pressable>
          ))}
        </View>

        <View style={styles.noteCard}>
          <Ionicons color={colors.warning} name="information-circle-outline" size={22} />
          <Text style={styles.noteText}>Lab results are derived from public API relationships. Connection scores are exploratory—not canon.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: layout.maxContent, padding: 18, paddingBottom: 110, width: '100%' },
  hero: { alignItems: 'center', borderColor: colors.border, borderRadius: 26, borderWidth: 1, overflow: 'hidden', padding: 24 },
  flask: { alignItems: 'center', backgroundColor: '#a98cff14', borderColor: '#a98cff55', borderRadius: 40, borderWidth: 1, height: 80, justifyContent: 'center', width: 80 },
  eyebrow: { color: colors.violet, fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.8, marginTop: 18 },
  title: { color: colors.text, fontFamily: fonts.displayHeavy, fontSize: 36, lineHeight: 43, marginTop: 8, textAlign: 'center' },
  subtitle: { color: colors.muted, fontFamily: fonts.body, fontSize: 15, lineHeight: 22, marginTop: 10, maxWidth: 520, textAlign: 'center' },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 26 },
  sectionTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 18 },
  sectionCount: { color: colors.muted, fontFamily: fonts.bodyBold, fontSize: 9, letterSpacing: 1.3 },
  modules: { gap: 12 },
  moduleCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 21, borderWidth: 1, overflow: 'hidden', padding: 18, position: 'relative' },
  moduleIndex: { color: colors.surfaceBright, fontFamily: fonts.displayHeavy, fontSize: 66, position: 'absolute', right: 10, top: -7 },
  moduleIcon: { alignItems: 'center', borderRadius: 15, borderWidth: 1, height: 52, justifyContent: 'center', width: 52 },
  moduleTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 17, marginTop: 15 },
  moduleDescription: { color: colors.muted, fontFamily: fonts.body, fontSize: 13, lineHeight: 20, marginTop: 7, maxWidth: 560 },
  openRow: { alignItems: 'center', flexDirection: 'row', gap: 7, marginTop: 15 },
  openText: { fontFamily: fonts.bodyBold, fontSize: 12 },
  noteCard: { alignItems: 'flex-start', backgroundColor: '#ffc8570d', borderColor: '#ffc85742', borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 11, marginTop: 16, padding: 14 },
  noteText: { color: colors.muted, flex: 1, fontFamily: fonts.body, fontSize: 11, lineHeight: 17 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.99 }] },
});
