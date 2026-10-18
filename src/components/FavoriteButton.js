import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useFavorites } from '../context/FavoritesContext';
import { colors } from '../theme';

export default function FavoriteButton({ resourceType, item }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(resourceType, item.id);

  return (
    <Pressable
      accessibilityLabel={saved ? 'Remove from favorites' : 'Add to favorites'}
      accessibilityRole="button"
      onPress={() => toggleFavorite(resourceType, item)}
      style={({ pressed }) => [styles.button, saved && styles.saved, pressed && styles.pressed]}
    >
      <Ionicons
        color={saved ? colors.ink : colors.portal}
        name={saved ? 'bookmark' : 'bookmark-outline'}
        size={19}
      />
      <Text style={[styles.label, saved && styles.savedLabel]}>
        {saved ? 'Saved' : 'Save'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: colors.portal,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  saved: {
    backgroundColor: colors.portal,
  },
  label: {
    color: colors.portal,
    fontWeight: '900',
  },
  savedLabel: {
    color: colors.ink,
  },
  pressed: {
    opacity: 0.75,
  },
});
