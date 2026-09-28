import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, ShieldAlert } from 'lucide-react';
import { useWeather } from './hooks/useWeather';
import { useSavedLocations } from './hooks/useSavedLocations';
import { getConditionType } from './utils/weatherUtils';

import { Navbar } from './components/Navbar';
import { DynamicBackground } from './components/DynamicBackground';
import { SavedLocations } from './components/SavedLocations';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherInsights } from './components/WeatherInsights';
import { WeatherDetails } from './components/WeatherDetails';
import { SunMoonCard } from './components/SunMoonCard';
import { SkeletonLoader } from './components/SkeletonLoader';

const THEME_STORAGE_KEY = 'skycast_theme';

export const App: React.FC = () => {
  // Theme state: defaults to saved preference or clean light mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) return saved === 'dark';
    return false; // Default to clean light mode
  });

  // Sync dark mode class with root html element and localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Weather Hook
  const {
    query,
    unit,
    toggleUnit,
    data,
    hasForecast,
    isLoading,
    error,
    isApiKeyMissing,
    geolocationError,
    loadWeather,
    requestCurrentLocation,
  } = useWeather();

  // Saved Locations Hook
  const {
    savedLocations,
    addSavedLocation,
    removeSavedLocation,
    isLocationSaved,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useSavedLocations();

  const handleSearch = (newQuery: string, displayName?: string) => {
    addRecentSearch(newQuery, displayName);
    loadWeather(newQuery);
  };

  const handleToggleSaveCurrent = () => {
    if (!data?.location) return;
    const { name, region, country, lat, lon } = data.location;
    if (isLocationSaved(name, country)) {
      const targetId = `${name.toLowerCase()}-${country.toLowerCase()}`.replace(/\s+/g, '-');
      removeSavedLocation(targetId);
    } else {
      addSavedLocation({ name, region, country, lat, lon });
    }
  };

  const activeCondition = data?.current 
    ? getConditionType(data.current.weather_code, data.current.is_day === 'yes') 
    : 'sunny';
  const isDay = data?.current ? data.current.is_day === 'yes' : true;
  const isCurrentSaved = data?.location 
    ? isLocationSaved(data.location.name, data.location.country) 
    : false;

  // Primary forecast day (first day) for insights and astronomy
  const firstForecastDate = data?.forecast ? Object.keys(data.forecast)[0] : undefined;
  const primaryForecastDay = firstForecastDate && data?.forecast ? data.forecast[firstForecastDate] : undefined;

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors">
      {/* Weather Adaptive Background */}
      <DynamicBackground condition={activeCondition} isDay={isDay} />

      {/* Top Navbar */}
      <Navbar
        onSearch={handleSearch}
        onUseCurrentLocation={requestCurrentLocation}
        unit={unit}
        onToggleUnit={toggleUnit}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        recentSearches={recentSearches}
        onClearRecentSearches={clearRecentSearches}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-6 sm:py-8 max-w-7xl w-full mx-auto">
        
        {/* Geolocation Notice Banner */}
        {geolocationError && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-4 animate-fade-in">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between gap-3 text-xs text-amber-800 dark:text-amber-200">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <span>{geolocationError}</span>
              </div>
            </div>
          </div>
        )}

        {/* General Error Banner */}
        {error && !isApiKeyMissing && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-6 animate-fade-in">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start justify-between gap-3 text-sm text-rose-800 dark:text-rose-200">
              <div className="flex items-start gap-2.5">
                <ShieldAlert size={18} className="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wide">Weather Query Notice</h4>
                  <p className="text-xs sm:text-sm mt-0.5 text-rose-700 dark:text-rose-300">{error}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => loadWeather(query, true)}
                className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/60 dark:hover:bg-rose-900 rounded-lg text-xs font-bold text-rose-800 dark:text-rose-200 flex items-center gap-1 shrink-0 transition-colors"
              >
                <RefreshCw size={13} />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* Saved Locations Strip */}
        <SavedLocations
          locations={savedLocations}
          activeQuery={query}
          onSelectLocation={handleSearch}
          onRemoveLocation={removeSavedLocation}
        />

        {/* Loading State or Render Data */}
        {isLoading ? (
          <SkeletonLoader />
        ) : data?.current && data?.location ? (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            {/* 1. Visual Focus: Current Weather Hero Card */}
            <CurrentWeather
              location={data.location}
              current={data.current}
              todayForecast={primaryForecastDay}
              unit={unit}
              isSaved={isCurrentSaved}
              onToggleSave={handleToggleSaveCurrent}
            />

            {/* 2. Hourly Forecast: Horizontally scrollable timeline */}
            <HourlyForecast
              forecastDay={primaryForecastDay}
              unit={unit}
              hasForecast={hasForecast}
              currentTemp={data.current.temperature}
              currentCode={data.current.weather_code}
            />

            {/* 3. 7-Day Forecast: Weekly outlook with visual range bars */}
            <DailyForecast
              forecast={data.forecast}
              unit={unit}
              hasForecast={hasForecast}
            />

            {/* 4. Weather Details: 8 Atmospheric metrics & Air Quality */}
            <WeatherDetails
              current={data.current}
              unit={unit}
            />

            {/* 5. Weather Insights Section: Smart rule-based highlights */}
            <WeatherInsights
              current={data.current}
              forecastDay={primaryForecastDay}
              unit={unit}
            />

            {/* 6. Sun & Moon Astronomical Card */}
            <SunMoonCard
              astro={data.current.astro || primaryForecastDay?.astro}
            />
          </div>
        ) : !isApiKeyMissing && !error ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm">Search for a location above to view weather conditions.</p>
          </div>
        ) : null}

      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-slate-200/80 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          {/* Copyright & API Attribution */}
          <div className="space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              © {new Date().getFullYear()} SkyCast • Weather Forecast
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Powered by{' '}
              <a 
                href="https://weatherstack.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
              >
                Weatherstack
              </a>{' '}
              &{' '}
              <a 
                href="https://open-meteo.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
              >
                Open-Meteo
              </a>
            </p>
          </div>

          {/* Team Credits */}
          <div className="flex flex-col md:items-end space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Built by
            </span>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-2 gap-y-1 text-slate-700 dark:text-slate-200 font-medium">
              <span>Dev Sharma</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Madhavi Sharma</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Sarthak Dhingra</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Siddhi Sehgal</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default App;
