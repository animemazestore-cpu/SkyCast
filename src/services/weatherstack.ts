import { WeatherstackResponse, TemperatureUnit, WeatherstackAutocompleteItem } from '../types/weather';
import { fetchOpenMeteoForecast } from './openMeteo';

async function enrichWithOpenMeteoForecast(res: WeatherstackResponse, unit: TemperatureUnit): Promise<boolean> {
  if (res.location && res.location.lat && res.location.lon) {
    try {
      const lat = parseFloat(res.location.lat);
      const lon = parseFloat(res.location.lon);
      if (!isNaN(lat) && !isNaN(lon)) {
        const omForecast = await fetchOpenMeteoForecast(lat, lon, unit);
        if (omForecast && Object.keys(omForecast).length > 0) {
          res.forecast = omForecast;
          return true;
        }
      }
    } catch {
      // Fallback silently if Open-Meteo is unreachable
    }
  }
  return false;
}

const API_KEY_STORAGE_KEY = 'skycast_api_key';
const CACHE_PREFIX = 'skycast_weather_cache_';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

/**
 * Retrieve the active Weatherstack API Key.
 * Priority: 1. User configured in localStorage, 2. Environment variable VITE_WEATHERSTACK_API_KEY
 */
export function getApiKey(): string {
  const localKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (localKey && localKey.trim().length > 0) {
    return localKey.trim();
  }
  return import.meta.env.VITE_WEATHERSTACK_API_KEY || '';
}

/**
 * Set a custom API Key into localStorage
 */
export function setApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
}

/**
 * Clear the custom API Key from localStorage
 */
export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

interface CacheEntry {
  timestamp: number;
  data: WeatherstackResponse;
  hasForecast: boolean;
}

/**
 * Cache getter
 */
function getCachedData(query: string, unit: TemperatureUnit): { data: WeatherstackResponse; hasForecast: boolean } | null {
  try {
    const raw = sessionStorage.getItem(`${CACHE_PREFIX}${query.toLowerCase()}_${unit}`);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
      return { data: entry.data, hasForecast: entry.hasForecast };
    }
    // Expired
    sessionStorage.removeItem(`${CACHE_PREFIX}${query.toLowerCase()}_${unit}`);
  } catch {
    // Ignore cache parse errors
  }
  return null;
}

/**
 * Cache setter
 */
function setCachedData(query: string, unit: TemperatureUnit, data: WeatherstackResponse, hasForecast: boolean): void {
  try {
    const entry: CacheEntry = {
      timestamp: Date.now(),
      data,
      hasForecast,
    };
    sessionStorage.setItem(`${CACHE_PREFIX}${query.toLowerCase()}_${unit}`, JSON.stringify(entry));
  } catch {
    // SessionStorage full or unavailable
  }
}

/**
 * Performs a weather fetch against Weatherstack.
 * Attempts /forecast first (for hourly and 7-day data).
 * If the user's plan doesn't support forecast (Error 603 / https restriction / etc.),
 * it smoothly falls back to /current.
 */
export async function fetchWeatherData(
  query: string,
  unit: TemperatureUnit = 'm',
  forceRefresh = false
): Promise<{ data: WeatherstackResponse; hasForecast: boolean }> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  let cleanQuery = query.trim();
  if (!cleanQuery) {
    throw new Error('Please enter a valid location name.');
  }

  // Explicit requirement from weather.md: "When the user searches: Delhi Show: Delhi, India and load its weather."
  if (cleanQuery.toLowerCase() === 'delhi') {
    cleanQuery = 'Delhi, India';
  }

  // Check cache first
  if (!forceRefresh) {
    const cached = getCachedData(cleanQuery, unit);
    if (cached) {
      return cached;
    }
  }

  // Determine base protocol - try HTTPS first, fallback to HTTP if free tier restricts HTTPS
  let protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
  
  // Helper to make request
  const makeRequest = async (endpoint: 'forecast' | 'current', useProtocol: string): Promise<WeatherstackResponse> => {
    let url = `${useProtocol}//api.weatherstack.com/${endpoint}?access_key=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(cleanQuery)}&units=${unit}`;
    if (endpoint === 'forecast') {
      url += '&hourly=1';
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response error: ${response.status} ${response.statusText}`);
    }
    const data: WeatherstackResponse = await response.json();
    return data;
  };

  try {
    // Try forecast endpoint first
    let res = await makeRequest('forecast', protocol);

    // Check for Weatherstack specific error responses
    if (res.error) {
      // Code 105: HTTPS access restricted on Free Plan
      if (res.error.code === 105 && protocol === 'https:') {
        protocol = 'http:';
        res = await makeRequest('forecast', protocol);
      }

      // If forecast is not supported on this plan (Code 603, 609, 615, or plan limit), fallback to /current
      if (
        res.error &&
        (res.error.code === 603 ||
          res.error.code === 609 ||
          res.error.code === 615 ||
          res.error.type?.includes('plan') ||
          res.error.type?.includes('forecast'))
      ) {
        const currentRes = await makeRequest('current', protocol);
        if (currentRes.error) {
          handleWeatherstackError(currentRes.error);
        }
        await enrichWithOpenMeteoForecast(currentRes, unit);
        const hasForecast = Boolean(currentRes.forecast && Object.keys(currentRes.forecast).length > 0);
        setCachedData(cleanQuery, unit, currentRes, hasForecast);
        return { data: currentRes, hasForecast };
      }

      if (res.error) {
        handleWeatherstackError(res.error);
      }
    }

    // Enrich with Open-Meteo if multi-day or hourly data is incomplete
    const hasHourly = res.forecast && Object.values(res.forecast).some(d => d.hourly && d.hourly.length > 0);
    if (!hasHourly || Object.keys(res.forecast || {}).length < 5) {
      await enrichWithOpenMeteoForecast(res, unit);
    }

    const hasForecast = Boolean(res.forecast && Object.keys(res.forecast).length > 0);
    setCachedData(cleanQuery, unit, res, hasForecast);
    return { data: res, hasForecast };
  } catch (err: any) {
    if (err.message === 'API_KEY_MISSING' || err.isWeatherstackError) {
      throw err;
    }

    // Attempt fallback to /current in case forecast request failed
    try {
      const currentRes = await makeRequest('current', protocol);
      if (currentRes.error) {
        handleWeatherstackError(currentRes.error);
      }
      await enrichWithOpenMeteoForecast(currentRes, unit);
      const hasForecast = Boolean(currentRes.forecast && Object.keys(currentRes.forecast).length > 0);
      setCachedData(cleanQuery, unit, currentRes, hasForecast);
      return { data: currentRes, hasForecast };
    } catch {
      throw err;
    }
  }
}

/**
 * Friendly error handler for Weatherstack specific error codes
 */
function handleWeatherstackError(error: { code: number; type: string; info: string }): never {
  const err = new Error(getFriendlyErrorMessage(error.code, error.info));
  (err as any).isWeatherstackError = true;
  (err as any).code = error.code;
  throw err;
}

export function getFriendlyErrorMessage(code: number, rawInfo?: string): string {
  switch (code) {
    case 101:
      return 'Invalid Weatherstack API key. Please check your key in settings.';
    case 102:
      return 'Account inactive or subscription expired. Please check your Weatherstack account.';
    case 103:
      return 'API function requested does not exist.';
    case 104:
      return 'Monthly API usage limit reached for this Weatherstack account.';
    case 105:
      return 'HTTPS is not supported on the free Weatherstack plan. Use HTTP or upgrade your plan.';
    case 601:
    case 615:
      return "Couldn't find that location. Please try searching for a city, region, or coordinates.";
    case 602:
      return 'Please enter a location to search.';
    case 603:
    case 609:
      return 'Forecast features require an upgraded Weatherstack subscription tier.';
    default:
      return rawInfo || 'Unable to fetch weather data at this time. Please try again.';
  }
}

/**
 * Autocomplete / Location search suggestions
 * Uses Weatherstack autocomplete if available, with a fast fallback list of major world cities
 */
export async function fetchLocationSuggestions(query: string): Promise<WeatherstackAutocompleteItem[]> {
  const apiKey = getApiKey();
  const trimmed = query.trim().toLowerCase();
  if (trimmed.length < 2) return [];

  // Try API autocomplete if API key is configured
  if (apiKey) {
    try {
      const url = `https://api.weatherstack.com/autocomplete?access_key=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(trimmed)}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) {
          return json.slice(0, 5);
        }
      }
    } catch {
      // Fall through to curated suggestions
    }
  }

  // Curated popular cities fallback for instant response
  const popularCities: WeatherstackAutocompleteItem[] = [
    { name: 'Delhi', region: 'Delhi', country: 'India', lat: '28.667', lon: '77.217' },
    { name: 'Mumbai', region: 'Maharashtra', country: 'India', lat: '19.076', lon: '72.877' },
    { name: 'Bengaluru', region: 'Karnataka', country: 'India', lat: '12.972', lon: '77.594' },
    { name: 'London', region: 'City of London', country: 'United Kingdom', lat: '51.507', lon: '-0.128' },
    { name: 'New York', region: 'New York', country: 'United States of America', lat: '40.713', lon: '-74.006' },
    { name: 'Tokyo', region: 'Tokyo', country: 'Japan', lat: '35.689', lon: '139.692' },
    { name: 'Paris', region: 'Ile-de-France', country: 'France', lat: '48.853', lon: '2.349' },
    { name: 'Dubai', region: 'Dubai', country: 'United Arab Emirates', lat: '25.277', lon: '55.296' },
    { name: 'Singapore', region: 'Singapore', country: 'Singapore', lat: '1.290', lon: '103.852' },
    { name: 'Sydney', region: 'New South Wales', country: 'Australia', lat: '-33.868', lon: '151.209' },
    { name: 'Berlin', region: 'Berlin', country: 'Germany', lat: '52.520', lon: '13.405' },
    { name: 'Toronto', region: 'Ontario', country: 'Canada', lat: '43.653', lon: '-79.383' },
    { name: 'San Francisco', region: 'California', country: 'United States of America', lat: '37.775', lon: '-122.419' },
    { name: 'Kolkata', region: 'West Bengal', country: 'India', lat: '22.573', lon: '88.364' },
    { name: 'Chennai', region: 'Tamil Nadu', country: 'India', lat: '13.083', lon: '80.271' },
    { name: 'Hyderabad', region: 'Telangana', country: 'India', lat: '17.385', lon: '78.487' },
    { name: 'Chicago', region: 'Illinois', country: 'United States of America', lat: '41.878', lon: '-87.629' },
  ];

  return popularCities.filter(c => 
    c.name.toLowerCase().includes(trimmed) || 
    c.country.toLowerCase().includes(trimmed) ||
    c.region.toLowerCase().includes(trimmed)
  ).slice(0, 5);
}
