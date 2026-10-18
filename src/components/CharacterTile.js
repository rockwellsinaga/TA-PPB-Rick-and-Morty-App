import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

export default function CharacterTile({ character, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image source={{ uri: character.image }} style={styles.image} />
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.name}>{character.name}</Text>
        <Text style={styles.meta}>{character.status} · {character.species}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 12,
    overflow: 'hidden',
    width: 154,
  },
  image: {
    height: 150,
    width: '100%',
  },
  content: {
    minHeight: 76,
    padding: 11,
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  meta: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 5,
  },
  pressed: {
    opacity: 0.76,
  },
});
