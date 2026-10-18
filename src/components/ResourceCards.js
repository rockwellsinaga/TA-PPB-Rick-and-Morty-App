import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

function ResourceCard({ eyebrow, icon, meta, name, onPress, tone = colors.cyan }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.icon, { backgroundColor: `${tone}22` }]}>
        <Ionicons color={tone} name={icon} size={23} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.eyebrow, { color: tone }]}>{eyebrow}</Text>
        <Text numberOfLines={2} style={styles.name}>{name}</Text>
        <Text numberOfLines={1} style={styles.meta}>{meta}</Text>
      </View>
      <Ionicons color={colors.muted} name="chevron-forward" size={20} />
    </Pressable>
  );
}

export function LocationCard({ location, onPress }) {
  return (
    <ResourceCard
      eyebrow={`LOCATION #${location.id}`}
      icon="planet-outline"
      meta={`${location.dimension || 'Unknown dimension'} · ${location.residents?.length ?? 0} residents`}
      name={location.name}
      onPress={onPress}
      tone={colors.cyan}
    />
  );
}

export function EpisodeCard({ episode, onPress }) {
  return (
    <ResourceCard
      eyebrow={episode.episode}
      icon="film-outline"
      meta={`${episode.air_date} · ${episode.characters?.length ?? 0} characters`}
      name={episode.name}
      onPress={onPress}
      tone={colors.portal}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 13,
    marginBottom: 12,
    padding: 15,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  content: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 5,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
});
