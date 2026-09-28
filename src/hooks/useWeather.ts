import { useState, useEffect, useCallback } from 'react';
import { WeatherstackResponse, TemperatureUnit } from '../types/weather';
import { fetchWeatherData, getApiKey } from '../services/weatherstack';

const UNIT_STORAGE_KEY = 'skycast_temp_unit';
const LAST_LOCATION_KEY = 'skycast_last_location';

export function useWeather() {
  const [query, setQuery] = useState<string>(() => {
    return localStorage.getItem(LAST_LOCATION_KEY) || '';
  });
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    return (localStorage.getItem(UNIT_STORAGE_KEY) as TemperatureUnit) || 'm';
  });
  const [data, setData] = useState<WeatherstackResponse | null>(null);
  const [hasForecast, setHasForecast] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState<boolean>(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  // Toggle or change temperature unit
  const toggleUnit = useCallback(() => {
    setUnit(prev => {
      const next = prev === 'm' ? 'f' : 'm';
      try {
        localStorage.setItem(UNIT_STORAGE_KEY, next);
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  // Fetch weather for specific location query
  const loadWeather = useCallback(async (targetQuery: string, force = false) => {
    const key = getApiKey();
    if (!key) {
      setIsApiKeyMissing(true);
      setIsLoading(false);
      return;
    }
    setIsApiKeyMissing(false);
    setIsLoading(true);
    setError(null);
    setGeolocationError(null);

    try {
      const result = await fetchWeatherData(targetQuery, unit, force);
      setData(result.data);
      setHasForecast(result.hasForecast);
      setQuery(targetQuery);
      try {
        localStorage.setItem(LAST_LOCATION_KEY, targetQuery);
      } catch {
        // Ignore storage errors
      }
    } catch (err: any) {
      if (err.message === 'API_KEY_MISSING') {
        setIsApiKeyMissing(true);
      } else {
        setError(err.message || 'An unexpected error occurred while fetching weather data.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [unit]);

  // Initial load: on first visit, automatically request precise user location
  useEffect(() => {
    const saved = localStorage.getItem(LAST_LOCATION_KEY);
    if (saved && saved.trim()) {
      loadWeather(saved);
      return;
    }

    // First visit: try browser Geolocation API for precise coordinates
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude.toFixed(4)},${position.coords.longitude.toFixed(4)}`;
          loadWeather(coords);
        },
        () => {
          // If permission is denied or unavailable on first load, fallback to Delhi
          loadWeather('Delhi');
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    } else {
      loadWeather('Delhi');
    }
  }, []); // Run once on initial mount

  // Refetch when temperature unit changes
  useEffect(() => {
    if (query) {
      loadWeather(query);
    }
  }, [unit]);

  // Manual "Use my location" button click
  const requestCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeolocationError('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLoading(true);
    setGeolocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude.toFixed(4)},${position.coords.longitude.toFixed(4)}`;
        loadWeather(coords);
      },
      (geoErr) => {
        setIsLoading(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setGeolocationError('Location access was denied. You can search for your city in the search bar.');
        } else if (geoErr.code === geoErr.POSITION_UNAVAILABLE) {
          setGeolocationError('Current location information is unavailable.');
        } else {
          setGeolocationError('Unable to retrieve location within the timeout limit.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [loadWeather]);

  return {
    query,
    setQuery,
    unit,
    toggleUnit,
    data,
    hasForecast,
    isLoading,
    error,
    isApiKeyMissing,
    geolocationError,
    setGeolocationError,
    loadWeather,
    requestCurrentLocation,
  };
}
