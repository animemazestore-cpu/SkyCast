import React from 'react';
import { Calendar } from 'lucide-react';
import { WeatherstackDayForecast, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatDayName } from '../utils/weatherUtils';

interface DailyForecastProps {
  forecast?: Record<string, WeatherstackDayForecast>;
  unit: TemperatureUnit;
  hasForecast: boolean;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  forecast,
  unit,
  hasForecast,
}) => {
  const tempUnit = unit === 'm' ? '°' : '°';
  const forecastList = forecast ? Object.values(forecast) : [];

  // Calculate week-wide min and max to render proportional horizontal temperature range bars
  let weekMin = 100;
  let weekMax = -100;
  forecastList.forEach(day => {
    if (day.mintemp < weekMin) weekMin = day.mintemp;
    if (day.maxtemp > weekMax) weekMax = day.maxtemp;
  });
  if (weekMin === 100) weekMin = 0;
  if (weekMax === -100) weekMax = 35;
  const tempRange = Math.max(weekMax - weekMin, 1);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-6">
      <div className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-brand-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              7-Day Forecast
            </h2>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Weekly outlook
          </span>
        </div>

        {/* Days List */}
        {hasForecast && forecastList.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {forecastList.map((day, idx) => {
              const dayName = formatDayName(day.date, idx === 0);
              const representativeHourly = day.hourly?.[4] || day.hourly?.[0];
              const weatherCode = representativeHourly?.weather_code || 113;
              const condition = representativeHourly?.weather_descriptions?.[0] || 'Clear';

              // Bar calculations
              const leftPercent = Math.max(0, Math.min(100, ((day.mintemp - weekMin) / tempRange) * 100));
              const widthPercent = Math.max(10, Math.min(100 - leftPercent, ((day.maxtemp - day.mintemp) / tempRange) * 100));

              return (
                <div 
                  key={day.date}
                  className="py-3 flex items-center justify-between gap-3 first:pt-1 last:pb-1 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-2xl transition-colors"
                >
                  {/* Day Name */}
                  <div className="w-16 sm:w-28 shrink-0">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">
                      {dayName}
                    </span>
                    <span className="hidden sm:block text-[11px] text-slate-400 dark:text-slate-500">
                      {day.date.slice(5)}
                    </span>
                  </div>

                  {/* Weather Icon & Condition */}
                  <div className="flex items-center gap-2 sm:gap-3 w-10 sm:w-44 shrink-0">
                    <WeatherIcon code={weatherCode} size={22} />
                    <span className="hidden sm:block text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                      {condition}
                    </span>
                  </div>

                  {/* Visual Temperature Bar with Min & Max (Mobile-friendly) */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
                    {/* Min Temp */}
                    <span className="w-8 text-right text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-500">
                      {day.mintemp}{tempUnit}
                    </span>

                    {/* Proportional Temperature Bar */}
                    <div className="relative flex-1 max-w-[120px] sm:max-w-[180px] h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                        style={{
                          left: `${leftPercent}%`,
                          width: `${widthPercent}%`,
                        }}
                      />
                    </div>

                    {/* Max Temp */}
                    <span className="w-8 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {day.maxtemp}{tempUnit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            Forecast data is currently loading...
          </div>
        )}

      </div>
    </div>
  );
};
