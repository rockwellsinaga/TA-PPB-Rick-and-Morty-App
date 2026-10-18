import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchAllResources } from './rickAndMortyApi';

const CACHE_KEY = '@ultimate-rick-and-morty/universe-snapshot-v1';
const CACHE_TTL = 12 * 60 * 60 * 1000;
let memorySnapshot = null;

const createSnapshot = async () => {
  const [characters, locations, episodes] = await Promise.all([
    fetchAllResources('character'),
    fetchAllResources('location'),
    fetchAllResources('episode'),
  ]);

  return {
    cachedAt: Date.now(),
    characters: characters.map((character) => ({
      episodeCount: character.episode.length,
      gender: character.gender,
      id: character.id,
      image: character.image,
      location: character.location?.name,
      name: character.name,
      origin: character.origin?.name,
      species: character.species,
      status: character.status,
    })),
    episodes: episodes.map((episode) => ({
      airDate: episode.air_date,
      castCount: episode.characters.length,
      code: episode.episode,
      id: episode.id,
      name: episode.name,
    })),
    locations: locations.map((location) => ({
      dimension: location.dimension,
      id: location.id,
      name: location.name,
      residentCount: location.residents.length,
      type: location.type,
    })),
  };
};

export const loadUniverseSnapshot = async ({ forceRefresh = false } = {}) => {
  if (!forceRefresh && memorySnapshot) return memorySnapshot;

  if (!forceRefresh) {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.cachedAt < CACHE_TTL) {
          memorySnapshot = parsed;
          return parsed;
        }
      }
    } catch {
      // A cache failure should never prevent live data from loading.
    }
  }

  const snapshot = await createSnapshot();
  memorySnapshot = snapshot;
  AsyncStorage.setItem(CACHE_KEY, JSON.stringify(snapshot)).catch(() => {});
  return snapshot;
};
