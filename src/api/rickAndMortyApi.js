const API_BASE_URL = 'https://rickandmortyapi.com/api';

const emptyCollection = () => ({
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
});

const buildQuery = (params) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

const requestJson = async (url, fetchImpl = fetch) => {
  const response = await fetchImpl(url);

  if (!response.ok) {
    throw new Error(`Rick and Morty API request failed (${response.status})`);
  }

  return response.json();
};

const fetchCollection = async (resource, params, fetchImpl = fetch) => {
  const query = buildQuery(params);
  const response = await fetchImpl(
    `${API_BASE_URL}/${resource}${query ? `?${query}` : ''}`,
  );

  if (response.status === 404) {
    return emptyCollection();
  }

  if (!response.ok) {
    throw new Error(`Rick and Morty API request failed (${response.status})`);
  }

  return response.json();
};

export const fetchCharacters = ({ name = '', page = 1 } = {}, fetchImpl) =>
  fetchCollection('character', { name: name.trim(), page }, fetchImpl);

export const fetchFilteredCharacters = (
  {
    name = '',
    status = '',
    species = '',
    type = '',
    gender = '',
    page = 1,
  } = {},
  fetchImpl,
) =>
  fetchCollection(
    'character',
    {
      name: name.trim(),
      status,
      species: species.trim(),
      type: type.trim(),
      gender,
      page,
    },
    fetchImpl,
  );

export const fetchLocations = (
  { name = '', type = '', dimension = '', page = 1 } = {},
  fetchImpl,
) =>
  fetchCollection(
    'location',
    { name: name.trim(), type: type.trim(), dimension: dimension.trim(), page },
    fetchImpl,
  );

export const fetchEpisodes = (
  { name = '', episode = '', page = 1 } = {},
  fetchImpl,
) =>
  fetchCollection(
    'episode',
    { name: name.trim(), episode: episode.trim(), page },
    fetchImpl,
  );

export const fetchResource = (resource, id, fetchImpl) =>
  requestJson(`${API_BASE_URL}/${resource}/${id}`, fetchImpl);

export const fetchResourceByUrl = (url, fetchImpl) =>
  requestJson(url, fetchImpl);

export const fetchResourcesByIds = async (resource, ids = [], fetchImpl) => {
  if (ids.length === 0) {
    return [];
  }

  const chunks = [];
  for (let index = 0; index < ids.length; index += 20) {
    chunks.push(ids.slice(index, index + 20));
  }

  const payloads = await Promise.all(
    chunks.map((chunk) =>
      requestJson(`${API_BASE_URL}/${resource}/${chunk.join(',')}`, fetchImpl),
    ),
  );

  return payloads.flatMap((payload) => (Array.isArray(payload) ? payload : [payload]));
};

export const fetchRelatedResources = (resource, urls = [], fetchImpl) => {
  const ids = urls
    .map((url) => url.split('/').filter(Boolean).pop())
    .filter(Boolean);

  return fetchResourcesByIds(resource, ids, fetchImpl);
};

export const fetchAllResources = async (resource, fetchImpl) => {
  const firstPage = await fetchCollection(resource, { page: 1 }, fetchImpl);
  const results = [...firstPage.results];
  const pageNumbers = Array.from(
    { length: Math.max(0, firstPage.info.pages - 1) },
    (_, index) => index + 2,
  );

  for (let index = 0; index < pageNumbers.length; index += 6) {
    const batch = pageNumbers.slice(index, index + 6);
    const pages = await Promise.all(
      batch.map((page) => fetchCollection(resource, { page }, fetchImpl)),
    );
    pages.forEach((page) => results.push(...page.results));
  }

  return results;
};

export const searchAllResources = async (query, fetchImpl) => {
  const name = query.trim();
  const [characters, locations, episodes] = await Promise.all([
    fetchCharacters({ name }, fetchImpl),
    fetchLocations({ name }, fetchImpl),
    fetchEpisodes({ name }, fetchImpl),
  ]);

  return { characters, locations, episodes };
};

export const getNextPage = (nextUrl) => {
  if (!nextUrl) {
    return null;
  }

  const match = nextUrl.match(/[?&]page=(\d+)/);
  return match ? Number(match[1]) : null;
};
