import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@ultimate-rick-and-morty/favorites';
const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        }
      } catch {
        setFavorites([]);
      } finally {
        setReady(true);
      }
    };

    hydrate();
  }, []);

  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch(() => {});
    }
  }, [favorites, ready]);

  const isFavorite = useCallback(
    (resourceType, id) =>
      favorites.some(
        (favorite) => favorite.resourceType === resourceType && favorite.item.id === id,
      ),
    [favorites],
  );

  const toggleFavorite = useCallback((resourceType, item) => {
    setFavorites((current) => {
      const exists = current.some(
        (favorite) =>
          favorite.resourceType === resourceType && favorite.item.id === item.id,
      );

      if (exists) {
        return current.filter(
          (favorite) =>
            !(favorite.resourceType === resourceType && favorite.item.id === item.id),
        );
      }

      return [{ resourceType, item }, ...current];
    });
  }, []);

  const value = useMemo(
    () => ({ favorites, isFavorite, ready, toggleFavorite }),
    [favorites, isFavorite, ready, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider');
  }

  return context;
}
