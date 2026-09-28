import React from 'react';
import { 
  Wind, 
  Droplets, 
  Eye, 
  Gauge, 
  Sun, 
  Cloud, 
  CloudRain, 
  Compass, 
  Activity,
  Layers
} from 'lucide-react';
import { WeatherstackCurrent, TemperatureUnit } from '../types/weather';
import { getUvCategory, getHumidityDescription } from '../utils/weatherUtils';

interface WeatherDetailsProps {
  current: WeatherstackCurrent;
  unit: TemperatureUnit;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ current, unit }) => {
  const speedUnit = unit === 'm' ? 'km/h' : 'mph';
  const visibilityUnit = unit === 'm' ? 'km' : 'mi';
  const precipUnit = unit === 'm' ? 'mm' : 'in';

  const uvInfo = getUvCategory(current.uv_index);
  const humidityDesc = getHumidityDescription(current.humidity);

  // Air Quality assessment
  const aqiIndex = current.air_quality ? parseInt(current.air_quality['us-epa-index'] || '1', 10) : null;
  const getAqiLabel = (idx: number) => {
    switch (idx) {
      case 1: return { text: 'Good', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' };
      case 2: return { text: 'Moderate', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' };
      case 3: return { text: 'Unhealthy (Sens.)', color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/50' };
      case 4: return { text: 'Unhealthy', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50' };
      case 5: return { text: 'Very Unhealthy', color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50' };
      default: return { text: 'Hazardous', color: 'text-red-600 bg-red-50 dark:bg-red-950/50' };
    }
  };

  const aqiInfo = aqiIndex ? getAqiLabel(aqiIndex) : null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-6">
      <div className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-brand-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Weather Details
            </h2>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Current atmospheric metrics
          </span>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Humidity */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-500 flex items-center justify-center shrink-0">
                <Droplets size={16} />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                Humidity
              </span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100">
                {current.humidity}%
              </span>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                {humidityDesc}
              </p>
            </div>
          </div>

          {/* Wind */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-500 flex items-center justify-center shrink-0">
                <Wind size={16} />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                Wind
              </span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100">
                {current.wind_speed} <span className="text-xs font-semibold text-slate-500">{speedUnit}</span>
              </span>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                <Compass size={11} className="inline text-slate-400" />
                <span>{current.wind_dir} ({current.wind_degree}°)</span>
              </p>
            </div>
          </div>

          {/* UV Index */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-500 flex items-center justify-center shrink-0">
                <Sun size={16} />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                UV Index
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100">
                  {current.uv_index}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${uvInfo.color}`}>
                  {uvInfo.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Scale 0-11+
              </p>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center shrink-0">
                <Eye size={16} />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                Visibility
              </span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100">
                {current.visibility} <span className="text-xs font-semibold text-slate-500">{visibilityUnit}</span>
              </span>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                {current.visibility >= 10 ? 'Clear distance view' : 'Reduced visibility'}
              </p>
            </div>
          </div>

          {/* Pressure */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center shrink-0">
                <Gauge size={16} />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                Pressure
              </span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100">
                {current.pressure} <span className="text-xs font-semibold text-slate-500">mb</span>
              </span>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                {current.pressure >= 1013 ? 'High pressure' : 'Low pressure'}
              </p>
            </div>
          </div>

          {/* Precipitation */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-500 flex items-center justify-center shrink-0">
                <CloudRain size={16} />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                Precipitation
              </span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100">
                {current.precip} <span className="text-xs font-semibold text-slate-500">{precipUnit}</span>
              </span>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                {current.precip > 0 ? 'Rain observed' : 'No rain recorded'}
              </p>
            </div>
          </div>

          {/* Cloud Cover */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                <Cloud size={16} />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                Cloud Cover
              </span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100">
                {current.cloudcover}%
              </span>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                {current.cloudcover >= 75 ? 'Overcast skies' : current.cloudcover >= 30 ? 'Partly cloudy' : 'Mostly clear'}
              </p>
            </div>
          </div>

          {/* Air Quality (when available) */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center shrink-0">
                <Activity size={16} />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                Air Quality
              </span>
            </div>
            <div>
              {aqiInfo ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                      AQI {aqiIndex}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${aqiInfo.color}`}>
                      {aqiInfo.text}
                    </span>
                  </div>
                  {current.air_quality?.pm2_5 ? (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      PM2.5: {current.air_quality.pm2_5} µg/m³
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Standard
                  </span>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Normal air quality
                  </p>
                </>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
