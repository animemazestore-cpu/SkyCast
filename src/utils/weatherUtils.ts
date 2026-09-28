import { WeatherConditionType, WeatherstackCurrent, WeatherstackDayForecast, TemperatureUnit } from '../types/weather';

/**
 * Maps Weatherstack weather codes to general condition types.
 * Weatherstack codes:
 * 113: Sunny / Clear
 * 116: Partly Cloudy
 * 119: Cloudy
 * 122: Overcast
 * 143: Mist / Fog
 * 176, 263, 266, 281, 284: Patchy rain / Drizzle
 * 293, 296, 299, 302, 305, 308: Rain / Moderate / Heavy Rain
 * 311, 314, 317, 320, 323, 326, 329, 332, 335, 338, 350, 368, 371: Snow / Sleet / Blizzards
 * 386, 389, 392, 395, 200: Thundery outbreaks / Thunderstorm
 */
export function getConditionType(code: number, isDay: boolean = true): WeatherConditionType {
  // Thunderstorms
  if ([200, 386, 389, 392, 395].includes(code)) {
    return 'thunderstorm';
  }
  // Snow / Ice
  if ([179, 182, 227, 230, 311, 314, 317, 320, 323, 326, 329, 332, 335, 338, 350, 368, 371, 374, 377].includes(code)) {
    return 'snow';
  }
  // Heavy rain
  if ([302, 305, 308, 356, 359].includes(code)) {
    return 'heavy-rain';
  }
  // Moderate rain / showers
  if ([176, 263, 266, 281, 284, 293, 296, 299, 353].includes(code)) {
    return 'rain';
  }
  // Fog / Mist
  if ([143, 248, 260].includes(code)) {
    return 'fog';
  }
  // Overcast
  if (code === 122) {
    return 'overcast';
  }
  // Cloudy
  if (code === 119) {
    return 'cloudy';
  }
  // Partly cloudy
  if (code === 116) {
    return 'partly-cloudy';
  }
  // Clear / Sunny
  return isDay ? 'sunny' : 'sunny'; // Day or Clear Night
}

/**
 * Format hourly time string from Weatherstack (e.g. "0", "300", "1200", "1500") to "12 AM", "3 PM"
 */
export function formatHourlyTime(timeStr: string): string {
  const num = parseInt(timeStr, 10);
  if (isNaN(num)) return timeStr;
  
  const hour = Math.floor(num / 100);
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

/**
 * Format date string (e.g. "2026-09-28") to short day name like "Mon", "Tue"
 */
export function formatDayName(dateStr: string, isToday = false): string {
  if (isToday) return 'Today';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

/**
 * Format full date for current weather display: "Monday, September 28"
 */
export function formatFullDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format UV Index label
 */
export function getUvCategory(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: 'Low', color: 'text-emerald-500 dark:text-emerald-400' };
  if (uv <= 5) return { label: 'Moderate', color: 'text-amber-500 dark:text-amber-400' };
  if (uv <= 7) return { label: 'High', color: 'text-orange-500 dark:text-orange-400' };
  if (uv <= 10) return { label: 'Very High', color: 'text-rose-500 dark:text-rose-400' };
  return { label: 'Extreme', color: 'text-purple-500 dark:text-purple-400' };
}

/**
 * Format Humidity feeling
 */
export function getHumidityDescription(humidity: number): string {
  if (humidity < 30) return 'Dry and crisp air';
  if (humidity <= 60) return 'Comfortable humidity levels';
  if (humidity <= 80) return 'Slightly humid';
  return 'High humidity, feels sticky';
}

/**
 * Generates factual rule-based weather insights based on real data
 */
export function generateWeatherInsights(
  current: WeatherstackCurrent,
  forecastDay?: WeatherstackDayForecast,
  unit: TemperatureUnit = 'm'
): string[] {
  const insights: string[] = [];
  const tempUnit = unit === 'm' ? '°C' : '°F';
  const speedUnit = unit === 'm' ? 'km/h' : 'mph';

  // 1. Temperature feeling insight
  const diff = current.feelslike - current.temperature;
  if (Math.abs(diff) >= 3) {
    if (diff > 0) {
      insights.push(`Feels like ${current.feelslike}${tempUnit}, warmer than actual temperature due to humidity.`);
    } else {
      insights.push(`Feels like ${current.feelslike}${tempUnit}, cooler than actual temperature due to wind.`);
    }
  } else {
    insights.push(`Temperature will remain around ${current.temperature}${tempUnit} with comfortable conditions.`);
  }

  // 2. Humidity insight
  if (current.humidity >= 75) {
    insights.push(`Humidity is high at ${current.humidity}%, which may make warm conditions feel heavier.`);
  } else if (current.humidity <= 25) {
    insights.push(`Humidity is low at ${current.humidity}%. Stay hydrated throughout the day.`);
  } else {
    insights.push(`Humidity is currently ${current.humidity}%, maintaining pleasant outdoor air.`);
  }

  // 3. Wind insight
  if (current.wind_speed > 25) {
    insights.push(`Breezy conditions with winds at ${current.wind_speed} ${speedUnit} from the ${current.wind_dir}.`);
  } else if (current.wind_speed > 5) {
    insights.push(`Wind is currently coming from the ${current.wind_dir} at a gentle ${current.wind_speed} ${speedUnit}.`);
  } else {
    insights.push(`Calm winds observed at ${current.wind_speed} ${speedUnit}.`);
  }

  // 4. Precipitation / Clouds
  if (current.precip > 0) {
    insights.push(`Active precipitation observed (${current.precip} mm). Carrying an umbrella is advised.`);
  } else if (current.cloudcover > 70) {
    insights.push(`Substantial cloud cover at ${current.cloudcover}%, keeping direct sunlight reduced.`);
  } else if (current.cloudcover < 15) {
    insights.push(`Clear open skies with plenty of sunshine today.`);
  }

  // 5. UV Index
  if (current.uv_index >= 6) {
    insights.push(`UV index is ${current.uv_index} (High). Sunscreen and eye protection recommended during midday.`);
  }

  // 6. Forecast min/max if available
  if (forecastDay) {
    insights.push(`Today's projected range: High of ${forecastDay.maxtemp}${tempUnit} and low of ${forecastDay.mintemp}${tempUnit}.`);
  }

  return insights.slice(0, 4); // Keep concise and clean
}
