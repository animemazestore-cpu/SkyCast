import React from 'react';
import { Star, ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { 
  WeatherstackLocation, 
  WeatherstackCurrent, 
  WeatherstackDayForecast,
  TemperatureUnit 
} from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatFullDate } from '../utils/weatherUtils';

interface CurrentWeatherProps {
  location: WeatherstackLocation;
  current: WeatherstackCurrent;
  todayForecast?: WeatherstackDayForecast;
  unit: TemperatureUnit;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  location,
  current,
  todayForecast,
  unit,
  isSaved,
  onToggleSave,
}) => {
  const tempUnit = unit === 'm' ? '°C' : '°F';
  const conditionDesc = current.weather_descriptions?.[0] || 'Clear';
  const isDay = current.is_day === 'yes';

  // Parse local date from location or fallback to current date
  let displayDate = formatFullDate();
  try {
    if (location.localtime) {
      const parts = location.localtime.split(' ')[0].split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        displayDate = formatFullDate(d);
      }
    }
  } catch {
    displayDate = formatFullDate();
  }

  // Air Quality assessment
  const aqiIndex = current.air_quality ? parseInt(current.air_quality['us-epa-index'] || '1', 10) : null;
  const getAqiLabel = (idx: number) => {
    switch (idx) {
      case 1: return { text: 'Air: Good', color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' };
      case 2: return { text: 'Air: Moderate', color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' };
      case 3: return { text: 'Air: Sensitive', color: 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800' };
      default: return { text: 'Air: Poor', color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800' };
    }
  };
  const aqiBadge = aqiIndex ? getAqiLabel(aqiIndex) : null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      <div className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-md rounded-3xl p-5 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
        
        {/* Top Header: Location, Date & Favorite Star */}
        <div className="flex items-start justify-between gap-3 mb-4 sm:mb-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                {location.name}
              </h1>
              {location.country && (
                <span className="text-sm sm:text-base font-semibold text-slate-400 dark:text-slate-500">
                  {location.country}
                </span>
              )}
              <button
                type="button"
                onClick={onToggleSave}
                title={isSaved ? 'Remove from saved locations' : 'Save location'}
                className="p-1 rounded-full text-slate-400 hover:text-amber-400 transition-colors focus:outline-none"
              >
                <Star
                  size={20}
                  className={isSaved ? 'fill-amber-400 text-amber-400' : 'hover:fill-amber-400/20'}
                />
              </button>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              {displayDate}
              {location.localtime ? (
                <span className="ml-2 text-slate-400 dark:text-slate-500">
                  • {location.localtime.split(' ')[1] || location.localtime}
                </span>
              ) : null}
            </p>
          </div>

          {/* Badges: Condition and AQI */}
          <div className="flex items-center gap-2 shrink-0">
            {aqiBadge && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${aqiBadge.color}`}>
                <Activity size={12} />
                <span className="hidden sm:inline">{aqiBadge.text}</span>
                <span className="sm:hidden">AQI {aqiIndex}</span>
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
              {conditionDesc}
            </span>
          </div>
        </div>

        {/* Center Primary Temperature & Icon Hero */}
        <div className="flex items-center justify-between gap-4 py-2 sm:py-4">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-8xl font-black tracking-tighter text-slate-900 dark:text-white">
                {current.temperature}°
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 flex-wrap">
              <span>
                Feels like <strong className="text-slate-700 dark:text-slate-200">{current.feelslike}{tempUnit}</strong>
              </span>

              {todayForecast && (
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="flex items-center text-slate-700 dark:text-slate-300">
                    <ArrowUp size={13} className="text-rose-500 mr-0.5" />
                    {todayForecast.maxtemp}°
                  </span>
                  <span className="flex items-center text-slate-700 dark:text-slate-300">
                    <ArrowDown size={13} className="text-sky-500 mr-0.5" />
                    {todayForecast.mintemp}°
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-inner">
              <WeatherIcon code={current.weather_code} isDay={isDay} size={54} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
