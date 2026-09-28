import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { WeatherstackCurrent, WeatherstackDayForecast, TemperatureUnit } from '../types/weather';
import { generateWeatherInsights } from '../utils/weatherUtils';

interface WeatherInsightsProps {
  current: WeatherstackCurrent;
  forecastDay?: WeatherstackDayForecast;
  unit: TemperatureUnit;
}

export const WeatherInsights: React.FC<WeatherInsightsProps> = ({
  current,
  forecastDay,
  unit,
}) => {
  const insights = generateWeatherInsights(current, forecastDay, unit);

  if (insights.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-6">
      <div className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
            <Sparkles size={14} />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Weather Insights
          </h2>
        </div>

        {/* Insight list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {insights.map((text, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 flex items-start gap-3"
            >
              <CheckCircle2 size={16} className="text-brand-500 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug">
                {text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
