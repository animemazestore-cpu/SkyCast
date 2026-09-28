import React from 'react';
import { Sunrise, Sunset, Moon, Sparkles } from 'lucide-react';
import { WeatherstackAstro } from '../types/weather';

interface SunMoonCardProps {
  astro?: WeatherstackAstro;
}

export const SunMoonCard: React.FC<SunMoonCardProps> = ({ astro }) => {
  // If astro data is provided by Weatherstack
  const sunrise = astro?.sunrise || '06:12 AM';
  const sunset = astro?.sunset || '06:34 PM';
  const moonrise = astro?.moonrise || '07:20 PM';
  const moonset = astro?.moonset || '06:45 AM';
  const moonPhase = astro?.moon_phase || 'Waxing Gibbous';

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-6">
      <div className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sunrise size={18} className="text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Sun & Moon
            </h2>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Sparkles size={12} />
            Astronomical data
          </span>
        </div>

        {/* 4 compact items */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Sunrise */}
          <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/80 dark:border-amber-900/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sunrise size={18} />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Sunrise
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {sunrise}
              </span>
            </div>
          </div>

          {/* Sunset */}
          <div className="p-3.5 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100/80 dark:border-orange-900/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Sunset size={18} />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Sunset
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {sunset}
              </span>
            </div>
          </div>

          {/* Moonrise */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/80 dark:border-indigo-900/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Moon size={18} />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Moonrise
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {moonrise}
              </span>
            </div>
          </div>

          {/* Moonset */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/80 dark:border-indigo-900/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Moon size={18} />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Moonset
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {moonset}
              </span>
            </div>
          </div>

          {/* Moon Phase */}
          <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Moon Phase
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate block">
                {moonPhase}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
