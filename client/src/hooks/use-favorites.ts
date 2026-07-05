import { useState, useEffect } from "react";

const FAVORITES_KEY = "mongol-dict-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(fid => fid !== id));
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite, count: favorites.length };
}
