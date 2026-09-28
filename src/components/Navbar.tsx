import React, { useState, useEffect, useRef } from 'react';
import { 
  CloudSun, 
  Search, 
  MapPin, 
  Moon, 
  Sun, 
  Clock, 
  X, 
  Loader2 
} from 'lucide-react';
import { TemperatureUnit, WeatherstackAutocompleteItem, RecentSearch } from '../types/weather';
import { fetchLocationSuggestions } from '../services/weatherstack';

interface NavbarProps {
  onSearch: (query: string, displayName?: string) => void;
  onUseCurrentLocation: () => void;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  recentSearches: RecentSearch[];
  onClearRecentSearches: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  onUseCurrentLocation,
  unit,
  onToggleUnit,
  isDarkMode,
  onToggleDarkMode,
  recentSearches,
  onClearRecentSearches,
  isLoading,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<WeatherstackAutocompleteItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced suggestion fetch
  useEffect(() => {
    if (!searchInput.trim() || searchInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const results = await fetchLocationSuggestions(searchInput);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onSearch(searchInput.trim());
    setIsFocused(false);
  };

  const handleSelectSuggestion = (item: WeatherstackAutocompleteItem) => {
    const query = `${item.name}, ${item.country}`;
    setSearchInput(item.name);
    onSearch(item.name, query);
    setIsFocused(false);
  };

  const handleSelectRecent = (recent: RecentSearch) => {
    setSearchInput(recent.query);
    onSearch(recent.query, recent.displayName);
    setIsFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo & Website Title */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none group"
          onClick={() => onSearch('Delhi', 'Delhi, India')}
          title="SkyCast Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-sm shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <CloudSun size={20} className="stroke-[2.2]" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-slate-700 dark:from-white dark:via-sky-200 dark:to-slate-300 bg-clip-text text-transparent">
              SkyCast
            </span>
          </div>
        </div>

        {/* Search Bar & Autocomplete Dropdown */}
        <div ref={containerRef} className="relative flex-1 max-w-lg mx-auto">
          <form onSubmit={handleFormSubmit} className="relative">
            <div className="relative flex items-center">
              <Search 
                size={18} 
                className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" 
              />
              <input
                id="search-location-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Search city, region, postal code, or coords..."
                className="w-full pl-10 pr-10 py-2 text-sm bg-slate-100/80 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-full border border-slate-200/80 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-xs"
              />
              {isSearchingSuggestions ? (
                <Loader2 size={16} className="absolute right-3.5 text-slate-400 animate-spin" />
              ) : searchInput ? (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
                >
                  <X size={15} />
                </button>
              ) : null}
            </div>
          </form>

          {/* Autocomplete & Recent Searches Flyout */}
          {isFocused && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 py-2 overflow-hidden z-50 text-sm animate-fade-in">
              {/* Autocomplete Suggestions */}
              {suggestions.length > 0 ? (
                <div className="py-1">
                  <div className="px-3.5 pb-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Suggestions
                  </div>
                  {suggestions.map((item, idx) => (
                    <button
                      key={`${item.name}-${item.country}-${idx}`}
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between gap-2 group transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <MapPin size={16} className="text-slate-400 group-hover:text-brand-500 shrink-0" />
                        <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate">
                          {item.name}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
                          {item.region ? `${item.region}, ` : ''}{item.country}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="py-1 border-t border-slate-100 dark:border-slate-800/60 mt-1">
                  <div className="px-3.5 py-1.5 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500">
                    <span className="uppercase tracking-wider">Recent Searches</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearRecentSearches();
                      }}
                      className="text-xs text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((recent, idx) => (
                    <button
                      key={`${recent.query}-${idx}`}
                      type="button"
                      onClick={() => handleSelectRecent(recent)}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between gap-2 group transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Clock size={15} className="text-slate-400 group-hover:text-brand-500 shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate">
                          {recent.displayName || recent.query}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {suggestions.length === 0 && (!recentSearches || recentSearches.length === 0) && (
                <div className="px-4 py-3 text-center text-xs text-slate-400 dark:text-slate-500">
                  Type a city or region name and press Enter
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Current Location Button */}
          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLoading}
            title="Use my current location"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 text-xs font-medium border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all disabled:opacity-50"
          >
            <MapPin size={17} className="text-brand-500 shrink-0" />
            <span className="hidden md:inline">My Location</span>
          </button>

          {/* Unit Toggle (°C / °F) */}
          <button
            type="button"
            onClick={onToggleUnit}
            title={`Switch to ${unit === 'm' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}`}
            className="px-2.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
          >
            <span className={unit === 'm' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}>°C</span>
            <span className="text-slate-400 mx-0.5">/</span>
            <span className={unit === 'f' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}>°F</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
          >
            {isDarkMode ? (
              <Sun size={18} className="text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon size={18} className="text-slate-700 hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
