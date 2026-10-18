const countBy = (items, select) => {
  const counts = new Map();
  items.forEach((item) => {
    const key = select(item) || 'Unknown';
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
};

const topBy = (items, select, limit = 5) =>
  [...items]
    .sort((a, b) => select(b) - select(a))
    .slice(0, limit);

export const buildUniverseStatistics = (snapshot) => ({
  counts: {
    characters: snapshot.characters.length,
    episodes: snapshot.episodes.length,
    locations: snapshot.locations.length,
  },
  genders: countBy(snapshot.characters, (character) => character.gender),
  species: countBy(snapshot.characters, (character) => character.species).slice(0, 8),
  statuses: countBy(snapshot.characters, (character) => character.status),
  topCharacters: topBy(snapshot.characters, (character) => character.episodeCount),
  topEpisodes: topBy(snapshot.episodes, (episode) => episode.castCount),
  topLocations: topBy(snapshot.locations, (location) => location.residentCount),
});

export const compareCharacters = (left, right) => {
  const rightEpisodes = new Set(right.episode);
  const sharedEpisodes = left.episode.filter((url) => rightEpisodes.has(url));
  const sameOrigin = Boolean(left.origin?.url && left.origin.url === right.origin?.url);
  const sameLocation = Boolean(left.location?.url && left.location.url === right.location?.url);
  const sameSpecies = left.species === right.species;
  const score = Math.min(
    100,
    sharedEpisodes.length * 5 + (sameOrigin ? 20 : 0) + (sameLocation ? 15 : 0) + (sameSpecies ? 10 : 0),
  );

  return { sameLocation, sameOrigin, sameSpecies, score, sharedEpisodes };
};

export const tallyCoStars = (episodes, characterId) => {
  const counts = new Map();
  episodes.forEach((episode) => {
    episode.characters.forEach((url) => {
      const id = Number(url.split('/').filter(Boolean).pop());
      if (id !== characterId) counts.set(id, (counts.get(id) ?? 0) + 1);
    });
  });
  return [...counts.entries()]
    .map(([id, appearances]) => ({ appearances, id }))
    .sort((a, b) => b.appearances - a.appearances || a.id - b.id);
};
