import React from 'react';
import { Star, X } from 'lucide-react';
import { SavedLocation } from '../types/weather';

interface SavedLocationsProps {
  locations: SavedLocation[];
  activeQuery: string;
  onSelectLocation: (query: string, displayName: string) => void;
  onRemoveLocation: (id: string) => void;
}

export const SavedLocations: React.FC<SavedLocationsProps> = ({
  locations,
  activeQuery,
  onSelectLocation,
  onRemoveLocation,
}) => {
  if (locations.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 hide-scrollbar">
        <div className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          <Star size={14} className="text-amber-500 fill-amber-500" />
          <span>Saved:</span>
        </div>

        {locations.map((loc) => {
          const isActive = 
            activeQuery.toLowerCase().includes(loc.name.toLowerCase());

          return (
            <div
              key={loc.id}
              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-brand-500 text-white border-brand-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectLocation(loc.name, `${loc.name}, ${loc.country}`)}
                className="flex items-center gap-1 focus:outline-none"
              >
                <span>{loc.name}</span>
                <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>
                  {loc.country}
                </span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveLocation(loc.id);
                }}
                title={`Remove ${loc.name} from saved`}
                className={`p-0.5 rounded-full transition-opacity opacity-40 group-hover:opacity-100 ${
                  isActive ? 'hover:bg-brand-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500'
                }`}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
