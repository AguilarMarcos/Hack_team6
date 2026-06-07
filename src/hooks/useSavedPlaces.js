import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { getSessionKey } from '../context/sessionKey';

const load = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
};

const persist = (key, list) => {
  try { localStorage.setItem(key, JSON.stringify(list)); } catch { /* silent */ }
};

export const useSavedPlaces = () => {
  const { user } = useAuth();
  const storageKey = `durango_saved_places_${getSessionKey(user)}`;
  const [savedPlaces, setSavedPlaces] = useState(() => load(storageKey));

  const addPlace = (place) => {
    setSavedPlaces((prev) => {
      if (prev.find((p) => p.id === place.id)) return prev;
      const next = [...prev, place];
      persist(storageKey, next);
      return next;
    });
  };

  const removePlace = (id) => {
    setSavedPlaces((prev) => {
      const next = prev.filter((p) => p.id !== id);
      persist(storageKey, next);
      return next;
    });
  };

  const clearAll = () => {
    setSavedPlaces([]);
    persist(storageKey, []);
  };

  return { savedPlaces, addPlace, removePlace, clearAll };
};
