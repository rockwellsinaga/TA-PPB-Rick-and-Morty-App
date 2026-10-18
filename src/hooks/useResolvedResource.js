import { useEffect, useState } from 'react';

import { fetchResourceByUrl } from '../api/rickAndMortyApi';

export default function useResolvedResource(initialItem, resourceUrl) {
  const [item, setItem] = useState(initialItem ?? null);
  const [loading, setLoading] = useState(!initialItem && Boolean(resourceUrl));
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (initialItem) {
      setItem(initialItem);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    if (!resourceUrl) {
      setError('Resource URL is unavailable.');
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError(null);
    fetchResourceByUrl(resourceUrl)
      .then((payload) => {
        if (active) {
          setItem(payload);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [initialItem, resourceUrl]);

  return { error, item, loading };
}
