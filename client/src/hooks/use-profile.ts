import { useState, useEffect } from "react";

const PROFILE_KEY = "mongol-dict-profile";
const VIEWED_KEY = "mongol-dict-viewed";

export interface UserProfile {
  name: string;
  createdAt: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [viewedIds, setViewedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(VIEWED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewedIds));
  }, [viewedIds]);

  const createProfile = (name: string) => {
    setProfile({ name, createdAt: new Date().toISOString() });
  };

  const markViewed = (id: string) => {
    setViewedIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const resetProgress = () => {
    setViewedIds([]);
  };

  const deleteProfile = () => {
    setProfile(null);
    setViewedIds([]);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(VIEWED_KEY);
  };

  return {
    profile,
    createProfile,
    deleteProfile,
    viewedIds,
    markViewed,
    resetProgress,
    wordsLearned: viewedIds.length,
  };
}
