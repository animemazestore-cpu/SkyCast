import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind,
} from 'lucide-react';
import { getConditionType } from '../utils/weatherUtils';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = true,
  className = '',
  size = 28,
}) => {
  const condition = getConditionType(code, isDay);

  switch (condition) {
    case 'sunny':
      return isDay ? (
        <Sun size={size} className={`text-amber-500 animate-spin-slow ${className}`} />
      ) : (
        <Moon size={size} className={`text-indigo-400 ${className}`} />
      );

    case 'partly-cloudy':
      return isDay ? (
        <CloudSun size={size} className={`text-amber-500 dark:text-amber-400 ${className}`} />
      ) : (
        <CloudMoon size={size} className={`text-indigo-300 ${className}`} />
      );

    case 'cloudy':
      return <Cloud size={size} className={`text-slate-400 dark:text-slate-300 ${className}`} />;

    case 'overcast':
      return <Cloud size={size} className={`text-slate-500 dark:text-slate-400 ${className}`} />;

    case 'fog':
      return <CloudFog size={size} className={`text-slate-400 dark:text-slate-300 ${className}`} />;

    case 'drizzle':
      return <CloudDrizzle size={size} className={`text-sky-400 ${className}`} />;

    case 'rain':
    case 'heavy-rain':
      return <CloudRain size={size} className={`text-blue-500 dark:text-blue-400 ${className}`} />;

    case 'thunderstorm':
      return <CloudLightning size={size} className={`text-amber-500 dark:text-amber-400 ${className}`} />;

    case 'snow':
      return <CloudSnow size={size} className={`text-sky-300 dark:text-sky-200 ${className}`} />;

    case 'windy':
      return <Wind size={size} className={`text-teal-500 ${className}`} />;

    default:
      return isDay ? (
        <Sun size={size} className={`text-amber-500 ${className}`} />
      ) : (
        <Moon size={size} className={`text-indigo-400 ${className}`} />
      );
  }
};
