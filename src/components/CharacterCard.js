import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

const statusColor = {
  Alive: colors.portal,
  Dead: colors.danger,
  unknown: colors.muted,
};

export default function CharacterCard({ character, onPress }) {
  return (
    <Pressable
      accessibilityHint="Opens character details"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image source={{ uri: character.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.id}>SPECIMEN #{character.id}</Text>
        <Text numberOfLines={2} style={styles.name}>{character.name}</Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: statusColor[character.status] ?? colors.muted },
            ]}
          />
          <Text style={styles.meta}>{character.status} · {character.species}</Text>
        </View>
        <Text numberOfLines={1} style={styles.label}>Last known location</Text>
        <Text numberOfLines={1} style={styles.meta}>
          {character.location?.name ?? 'Unknown'}
        </Text>
      </View>
      <Ionicons color={colors.muted} name="chevron-forward" size={20} style={styles.chevron} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 14,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.82,
  },
  image: {
    height: 142,
    width: 132,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 14,
  },
  id: {
    color: colors.cyan,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 5,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 11,
    marginTop: 7,
  },
  statusDot: {
    borderRadius: 5,
    height: 9,
    marginRight: 7,
    width: 9,
  },
  label: {
    color: colors.muted,
    fontSize: 11,
    marginBottom: 2,
  },
  meta: {
    color: colors.text,
    fontSize: 12,
  },
  chevron: {
    alignSelf: 'center',
    marginRight: 10,
  },
});
