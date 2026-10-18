import {
  fetchCharacters,
  fetchEpisodes,
  fetchFilteredCharacters,
  fetchLocations,
  fetchRelatedResources,
  getNextPage,
} from '../rickAndMortyApi';

const jsonResponse = (body, overrides = {}) => ({
  ok: true,
  status: 200,
  json: jest.fn().mockResolvedValue(body),
  ...overrides,
});

describe('Rick and Morty API client', () => {
  test('encodes character search text and page number', async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      jsonResponse({
        info: { next: null },
        results: [{ id: 1, name: 'Rick Sanchez' }],
      }),
    );

    const result = await fetchCharacters(
      { name: 'Rick Sanchez', page: 2 },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character?name=Rick%20Sanchez&page=2',
    );
    expect(result.results).toHaveLength(1);
  });

  test('returns an empty collection for a 404 search result', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(jsonResponse({}, { ok: false, status: 404 }));

    const result = await fetchEpisodes({ name: 'missing' }, fetchMock);

    expect(result.results).toEqual([]);
    expect(result.info.count).toBe(0);
  });

  test('passes every supported character filter to the API', async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      jsonResponse({ info: { next: null }, results: [] }),
    );

    await fetchFilteredCharacters(
      {
        name: 'Rick',
        status: 'alive',
        species: 'Human',
        type: 'Clone',
        gender: 'male',
        page: 2,
      },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character?name=Rick&status=alive&species=Human&type=Clone&gender=male&page=2',
    );
  });

  test('encodes location type and dimension filters', async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      jsonResponse({ info: { next: null }, results: [] }),
    );

    await fetchLocations(
      { name: 'Earth', type: 'Planet', dimension: 'Dimension C-137' },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/location?name=Earth&type=Planet&dimension=Dimension%20C-137&page=1',
    );
  });

  test('batches related resources in groups of twenty', async () => {
    const urls = Array.from(
      { length: 21 },
      (_, index) => `https://rickandmortyapi.com/api/character/${index + 1}`,
    );
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse([{ id: 1 }, { id: 20 }]))
      .mockResolvedValueOnce(jsonResponse({ id: 21 }));

    const result = await fetchRelatedResources('character', urls, fetchMock);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://rickandmortyapi.com/api/character/21',
    );
    expect(result).toEqual([{ id: 1 }, { id: 20 }, { id: 21 }]);
  });

  test('throws a useful error for another failed response', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(jsonResponse({}, { ok: false, status: 503 }));

    await expect(fetchCharacters({}, fetchMock)).rejects.toThrow(
      'Rick and Morty API request failed (503)',
    );
  });

  test('extracts the next page from an API link', () => {
    expect(
      getNextPage('https://rickandmortyapi.com/api/character?page=3'),
    ).toBe(3);
    expect(getNextPage(null)).toBeNull();
  });
});
