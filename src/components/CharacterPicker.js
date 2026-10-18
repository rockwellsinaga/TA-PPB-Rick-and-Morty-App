import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { fetchCharacters } from '../api/rickAndMortyApi';
import { selectionFeedback } from '../utils/feedback';
import { colors, fonts } from '../theme';
import SearchBar from './SearchBar';
import { LoadingState, MessageState } from './ScreenState';

export default function CharacterPicker({ selected = [], onToggle, max = 1 }) {
  const [query, setQuery] = useState('');
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async (name = query) => {
    setLoading(true);
    setError(null);
    try {
      const payload = await fetchCharacters({ name });
      setCharacters(payload.results);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => load(query), query ? 400 : 0);
    return () => clearTimeout(timeout);
  }, [query]);

  const choose = (character) => {
    selectionFeedback();
    onToggle(character);
  };

  return (
    <View style={styles.container}>
      <SearchBar onChangeText={setQuery} onSubmit={() => load()} placeholder="Find a character" value={query} />
      <View style={styles.hintRow}>
        <Text style={styles.hint}>Choose {max === 1 ? 'a specimen' : `up to ${max} specimens`}</Text>
        <Text style={styles.selectedCount}>{selected.length}/{max} selected</Text>
      </View>
      {loading ? <LoadingState label="Searching specimens..." /> : null}
      {error ? <MessageState actionLabel="Retry" message={error} onAction={() => load()} title="Search failed" /> : null}
      {!loading && !error ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {characters.map((character) => {
            const active = selected.some((item) => item.id === character.id);
            const disabled = !active && selected.length >= max;
            return (
              <Pressable
                disabled={disabled}
                key={character.id}
                onPress={() => choose(character)}
                style={({ pressed }) => [styles.card, active && styles.cardActive, disabled && styles.cardDisabled, pressed && styles.pressed]}
              >
                <Image source={{ uri: character.image }} style={styles.image} />
                <View style={styles.cardBody}>
                  <Text numberOfLines={2} style={styles.name}>{character.name}</Text>
                  <Text style={styles.meta}>{character.status} · {character.species}</Text>
                </View>
                <View style={[styles.check, active && styles.checkActive]}>
                  <Ionicons color={active ? colors.ink : colors.muted} name={active ? 'checkmark' : 'add'} size={17} />
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 18 },
  hintRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  hint: { color: colors.muted, fontFamily: fonts.body, fontSize: 12 },
  selectedCount: { color: colors.portal, fontFamily: fonts.bodyBold, fontSize: 12 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, marginRight: 12, overflow: 'hidden', position: 'relative', width: 150 },
  cardActive: { borderColor: colors.portal, borderWidth: 2 },
  cardDisabled: { opacity: 0.38 },
  image: { height: 142, width: '100%' },
  cardBody: { minHeight: 78, padding: 11 },
  name: { color: colors.text, fontFamily: fonts.bodyBold, fontSize: 14 },
  meta: { color: colors.muted, fontFamily: fonts.body, fontSize: 10, marginTop: 5 },
  check: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, height: 30, justifyContent: 'center', position: 'absolute', right: 8, top: 8, width: 30 },
  checkActive: { backgroundColor: colors.portal, borderColor: colors.portal },
  pressed: { opacity: 0.75 },
});
