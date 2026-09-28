import React from 'react';
import { WeatherConditionType } from '../types/weather';

interface DynamicBackgroundProps {
  condition?: WeatherConditionType;
  isDay?: boolean;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  condition = 'sunny',
  isDay = true,
}) => {
  // Determine background gradient strictly separating Light mode and Dark mode
  let bgClasses = 'from-slate-100/80 via-white to-sky-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950';

  if (!isDay) {
    // Night: soft cool indigo in light mode, deep dark navy in dark mode
    bgClasses = 'from-slate-100 via-indigo-50/40 to-slate-200/60 dark:from-[#060913] dark:via-[#0c1222] dark:to-[#070b16]';
  } else {
    switch (condition) {
      case 'sunny':
        bgClasses = 'from-amber-50/60 via-slate-50 to-sky-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950';
        break;
      case 'partly-cloudy':
        bgClasses = 'from-sky-50/70 via-slate-50 to-slate-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950';
        break;
      case 'cloudy':
      case 'overcast':
      case 'fog':
        bgClasses = 'from-slate-100 via-slate-50 to-zinc-100 dark:from-slate-950 dark:via-zinc-900/40 dark:to-slate-950';
        break;
      case 'drizzle':
      case 'rain':
      case 'heavy-rain':
        bgClasses = 'from-blue-50/70 via-slate-50 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950';
        break;
      case 'thunderstorm':
        bgClasses = 'from-slate-200/70 via-slate-100 to-zinc-200/50 dark:from-[#080b12] dark:via-[#111728] dark:to-[#080b12]';
        break;
      case 'snow':
        bgClasses = 'from-sky-50/80 via-slate-50 to-indigo-50/40 dark:from-slate-950 dark:via-sky-950/20 dark:to-slate-950';
        break;
      default:
        bgClasses = 'from-slate-100/80 via-white to-sky-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950';
    }
  }

  return (
    <div 
      className={`fixed inset-0 -z-10 bg-gradient-to-br ${bgClasses} transition-colors duration-700 ease-in-out pointer-events-none`}
      aria-hidden="true"
    >
      {/* Subtle radial glow accents for depth */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-400/5 dark:bg-brand-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-300/5 dark:bg-sky-300/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
