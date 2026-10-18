import { buildUniverseStatistics, compareCharacters, tallyCoStars } from '../analytics';

describe('multiverse analytics', () => {
  test('builds distributions and ranks records without changing the source', () => {
    const snapshot = {
      characters: [
        { id: 1, name: 'Rick', status: 'Alive', gender: 'Male', species: 'Human', episodeCount: 4 },
        { id: 2, name: 'Morty', status: 'Alive', gender: 'Male', species: 'Human', episodeCount: 5 },
        { id: 3, name: 'Ghost', status: 'Dead', gender: 'unknown', species: 'Alien', episodeCount: 1 },
      ],
      episodes: [{ id: 1, name: 'Pilot', castCount: 3 }],
      locations: [{ id: 1, name: 'Earth', residentCount: 2 }],
    };

    const statistics = buildUniverseStatistics(snapshot);

    expect(statistics.counts).toEqual({ characters: 3, episodes: 1, locations: 1 });
    expect(statistics.statuses[0]).toEqual({ label: 'Alive', value: 2 });
    expect(statistics.topCharacters[0].name).toBe('Morty');
    expect(snapshot.characters[0].name).toBe('Rick');
  });

  test('compares shared traits and episodes', () => {
    const left = {
      episode: ['episode/1', 'episode/2'],
      location: { url: 'location/1' },
      origin: { url: 'location/1' },
      species: 'Human',
    };
    const right = {
      episode: ['episode/2', 'episode/3'],
      location: { url: 'location/2' },
      origin: { url: 'location/1' },
      species: 'Human',
    };

    expect(compareCharacters(left, right)).toEqual({
      sameLocation: false,
      sameOrigin: true,
      sameSpecies: true,
      score: 35,
      sharedEpisodes: ['episode/2'],
    });
  });

  test('ranks co-stars by shared appearances and excludes the selected character', () => {
    const episodes = [
      { characters: ['character/1', 'character/2', 'character/3'] },
      { characters: ['character/1', 'character/2'] },
    ];

    expect(tallyCoStars(episodes, 1)).toEqual([
      { appearances: 2, id: 2 },
      { appearances: 1, id: 3 },
    ]);
  });
});
