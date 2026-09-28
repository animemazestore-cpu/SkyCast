import { TemperatureUnit, WeatherstackDayForecast, WeatherstackHourly } from '../types/weather';

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
  };
}

/**
 * Maps WMO code to condition text and approximate Weatherstack weather code
 */
export function mapWmoCode(wmo: number): { description: string; code: number } {
  switch (wmo) {
    case 0:
      return { description: 'Clear sky', code: 113 };
    case 1:
      return { description: 'Mainly clear', code: 113 };
    case 2:
      return { description: 'Partly cloudy', code: 116 };
    case 3:
      return { description: 'Overcast', code: 122 };
    case 45:
    case 48:
      return { description: 'Foggy', code: 143 };
    case 51:
      return { description: 'Light drizzle', code: 266 };
    case 53:
      return { description: 'Moderate drizzle', code: 266 };
    case 55:
      return { description: 'Dense drizzle', code: 284 };
    case 61:
      return { description: 'Slight rain', code: 296 };
    case 63:
      return { description: 'Moderate rain', code: 302 };
    case 65:
      return { description: 'Heavy rain', code: 308 };
    case 71:
    case 73:
    case 75:
      return { description: 'Snow', code: 332 };
    case 77:
      return { description: 'Snow grains', code: 326 };
    case 80:
    case 81:
    case 82:
      return { description: 'Rain showers', code: 353 };
    case 85:
    case 86:
      return { description: 'Snow showers', code: 368 };
    case 95:
      return { description: 'Thunderstorm', code: 389 };
    case 96:
    case 99:
      return { description: 'Thunderstorm with hail', code: 395 };
    default:
      return { description: 'Partly cloudy', code: 116 };
  }
}

/**
 * Format ISO datetime string (e.g. "2026-09-28T06:12") to "06:12 AM"
 */
function formatTimeFromIso(isoStr: string): string {
  try {
    const timePart = isoStr.split('T')[1];
    if (!timePart) return isoStr;
    const [h, m] = timePart.split(':');
    let hour = parseInt(h, 10);
    const minute = m || '00';
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
  } catch {
    return isoStr;
  }
}

/**
 * Fetches 7-day forecast and 24-hour hourly progression from Open-Meteo
 */
export async function fetchOpenMeteoForecast(
  lat: number,
  lon: number,
  unit: TemperatureUnit = 'm'
): Promise<Record<string, WeatherstackDayForecast>> {
  const tempParam = unit === 'f' ? '&temperature_unit=fahrenheit' : '';
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=auto&forecast_days=7${tempParam}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo error: ${res.status}`);
  }

  const json: OpenMeteoResponse = await res.json();
  const forecastMap: Record<string, WeatherstackDayForecast> = {};

  if (!json.daily || !json.daily.time) {
    return forecastMap;
  }

  // Find current hour index to start hourly timeline from now onwards (next 24 hours)
  const now = new Date();
  const currentIsoHour = now.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
  let startIndex = 0;
  if (json.hourly && json.hourly.time) {
    const idx = json.hourly.time.findIndex(t => t.startsWith(currentIsoHour));
    if (idx !== -1) {
      startIndex = idx;
    }
  }

  // Build 24-hour timeline
  const next24Hours: WeatherstackHourly[] = [];
  if (json.hourly && json.hourly.time) {
    const hoursSlice = json.hourly.time.slice(startIndex, startIndex + 24);
    hoursSlice.forEach((t, i) => {
      const globalIdx = startIndex + i;
      const hourStr = t.split('T')[1].split(':')[0]; // "00", "01", ... "23"
      const timeWeatherCode = json.hourly.weather_code[globalIdx];
      const mapped = mapWmoCode(timeWeatherCode);

      next24Hours.push({
        time: `${parseInt(hourStr, 10) * 100}`,
        temperature: Math.round(json.hourly.temperature_2m[globalIdx]),
        wind_speed: 10,
        wind_degree: 0,
        wind_dir: 'N',
        weather_code: mapped.code,
        weather_icons: [],
        weather_descriptions: [mapped.description],
        precip: 0,
        humidity: 60,
        visibility: 10,
        pressure: 1013,
        cloudcover: 20,
        heatindex: Math.round(json.hourly.temperature_2m[globalIdx]),
        dewpoint: 15,
        windchill: Math.round(json.hourly.temperature_2m[globalIdx]),
        windgust: 15,
        feelslike: Math.round(json.hourly.temperature_2m[globalIdx]),
        chanceofrain: `${json.hourly.precipitation_probability[globalIdx] || 0}`,
        uv_index: 3,
      });
    });
  }

  // Populate daily forecast items
  json.daily.time.forEach((dateStr, i) => {
    const wmo = json.daily.weather_code[i];
    const mapped = mapWmoCode(wmo);
    const sunrise = formatTimeFromIso(json.daily.sunrise[i]);
    const sunset = formatTimeFromIso(json.daily.sunset[i]);

    forecastMap[dateStr] = {
      date: dateStr,
      date_epoch: Math.floor(new Date(dateStr).getTime() / 1000),
      astro: {
        sunrise,
        sunset,
        moonrise: '07:15 PM',
        moonset: '07:30 AM',
        moon_phase: 'Waxing Gibbous',
        moon_illumination: 85,
      },
      mintemp: Math.round(json.daily.temperature_2m_min[i]),
      maxtemp: Math.round(json.daily.temperature_2m_max[i]),
      avgtemp: Math.round((json.daily.temperature_2m_min[i] + json.daily.temperature_2m_max[i]) / 2),
      totalsnow: 0,
      sunhour: 10,
      uv_index: 6,
      hourly: i === 0 
        ? next24Hours 
        : [{
            time: '1200',
            temperature: Math.round(json.daily.temperature_2m_max[i]),
            wind_speed: 10,
            wind_degree: 0,
            wind_dir: 'N',
            weather_code: mapped.code,
            weather_icons: [],
            weather_descriptions: [mapped.description],
            precip: json.daily.precipitation_sum[i] || 0,
            humidity: 60,
            visibility: 10,
            pressure: 1013,
            cloudcover: 20,
            heatindex: Math.round(json.daily.temperature_2m_max[i]),
            dewpoint: 15,
            windchill: Math.round(json.daily.temperature_2m_max[i]),
            windgust: 15,
            feelslike: Math.round(json.daily.temperature_2m_max[i]),
            chanceofrain: '0',
            uv_index: 6,
          }],
    };
  });

  return forecastMap;
}
