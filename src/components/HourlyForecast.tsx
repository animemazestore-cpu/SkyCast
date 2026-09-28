import React from 'react';
import { Clock, Droplets, Info } from 'lucide-react';
import { WeatherstackDayForecast, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatHourlyTime } from '../utils/weatherUtils';

interface HourlyForecastProps {
  forecastDay?: WeatherstackDayForecast;
  unit: TemperatureUnit;
  hasForecast: boolean;
  currentTemp?: number;
  currentCode?: number;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  forecastDay,
  unit,
  hasForecast,
  currentTemp,
  currentCode,
}) => {
  const tempUnit = unit === 'm' ? '°' : '°';
  const hourlyData = forecastDay?.hourly;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-6">
      <div className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-brand-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Hourly Forecast
            </h2>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            24-hour progression
          </span>
        </div>

        {/* Hourly items timeline */}
        {hasForecast && hourlyData && hourlyData.length > 0 ? (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 custom-scrollbar scroll-smooth">
            {/* "Now" slot */}
            {currentTemp !== undefined && (
              <div className="flex flex-col items-center justify-between min-w-[76px] py-3 px-2 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-800/60 shrink-0 select-none">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                  Now
                </span>
                <div className="my-2.5">
                  <WeatherIcon code={currentCode || 113} size={28} />
                </div>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {currentTemp}{tempUnit}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  Live
                </span>
              </div>
            )}

            {hourlyData.map((item, index) => {
              const formattedTime = formatHourlyTime(item.time);
              const rainChance = parseInt(item.chanceofrain, 10);
              const hourNumber = Math.floor(parseInt(item.time, 10) / 100);
              const isItemDay = hourNumber >= 6 && hourNumber < 19;

              return (
                <div
                  key={`${item.time}-${index}`}
                  className="flex flex-col items-center justify-between min-w-[76px] py-3 px-2 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shrink-0 select-none"
                >
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {formattedTime}
                  </span>

                  <div className="my-2.5">
                    <WeatherIcon code={item.weather_code} isDay={isItemDay} size={28} />
                  </div>

                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {item.temperature}{tempUnit}
                  </span>

                  {/* Rain probability */}
                  <div className="flex items-center gap-0.5 mt-1 h-3.5">
                    {rainChance > 0 ? (
                      <span className="flex items-center text-[10px] font-semibold text-sky-500">
                        <Droplets size={10} className="mr-0.5" />
                        {rainChance}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        0%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Graceful Tier Notice when user is on Weatherstack Free Plan (which does not provide forecast endpoint) */
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <Info size={20} className="text-slate-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Weatherstack Hourly Forecast
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Hourly forecast data requires a Weatherstack Standard or Professional subscription tier. 
                Your current active observation and real-time conditions are live.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
