import { useState, useEffect } from 'react';
import { SavedLocation, RecentSearch } from '../types/weather';

const SAVED_LOCATIONS_KEY = 'skycast_saved_locations';
const RECENT_SEARCHES_KEY = 'skycast_recent_searches';

// Default initial saved locations if none in localStorage
const DEFAULT_SAVED_LOCATIONS: SavedLocation[] = [
  { id: 'delhi-in', name: 'Delhi', region: 'Delhi', country: 'India', savedAt: Date.now() - 4000 },
  { id: 'mumbai-in', name: 'Mumbai', region: 'Maharashtra', country: 'India', savedAt: Date.now() - 3000 },
  { id: 'london-uk', name: 'London', region: 'City of London', country: 'United Kingdom', savedAt: Date.now() - 2000 },
  { id: 'new-york-us', name: 'New York', region: 'New York', country: 'United States of America', savedAt: Date.now() - 1000 },
];

export function useSavedLocations() {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_LOCATIONS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SAVED_LOCATIONS;
    } catch {
      return DEFAULT_SAVED_LOCATIONS;
    }
  });

  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [
        { query: 'Delhi', displayName: 'Delhi, India', searchedAt: Date.now() - 5000 },
        { query: 'London', displayName: 'London, United Kingdom', searchedAt: Date.now() - 4000 },
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(savedLocations));
    } catch {
      // Ignore
    }
  }, [savedLocations]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
    } catch {
      // Ignore
    }
  }, [recentSearches]);

  const addSavedLocation = (loc: { name: string; region?: string; country: string; lat?: string; lon?: string }) => {
    const id = `${loc.name.toLowerCase()}-${loc.country.toLowerCase()}`.replace(/\s+/g, '-');
    setSavedLocations(prev => {
      if (prev.some(item => item.id === id || (item.name.toLowerCase() === loc.name.toLowerCase() && item.country.toLowerCase() === loc.country.toLowerCase()))) {
        return prev;
      }
      return [{ id, name: loc.name, region: loc.region, country: loc.country, lat: loc.lat, lon: loc.lon, savedAt: Date.now() }, ...prev];
    });
  };

  const removeSavedLocation = (id: string) => {
    setSavedLocations(prev => prev.filter(item => item.id !== id));
  };

  const isLocationSaved = (name: string, country: string) => {
    return savedLocations.some(
      item => item.name.toLowerCase() === name.toLowerCase() && item.country.toLowerCase() === country.toLowerCase()
    );
  };

  const addRecentSearch = (query: string, displayName?: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.query.toLowerCase() !== cleanQuery.toLowerCase());
      return [
        {
          query: cleanQuery,
          displayName: displayName || cleanQuery,
          searchedAt: Date.now(),
        },
        ...filtered,
      ].slice(0, 5); // Keep last 5 searches
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return {
    savedLocations,
    addSavedLocation,
    removeSavedLocation,
    isLocationSaved,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  };
}
