export type TemperatureUnit = 'm' | 'f'; // 'm' for Metric (°C), 'f' for Fahrenheit (°F)

export interface WeatherstackRequest {
  type: string;
  query: string;
  language: string;
  unit: TemperatureUnit;
}

export interface WeatherstackLocation {
  name: string;
  country: string;
  region: string;
  lat: string;
  lon: string;
  timezone_id: string;
  localtime: string;
  localtime_epoch: number;
  utc_offset: string;
}

export interface WeatherstackCurrent {
  observation_time: string;
  temperature: number;
  weather_code: number;
  weather_icons: string[];
  weather_descriptions: string[];
  wind_speed: number;
  wind_degree: number;
  wind_dir: string;
  pressure: number;
  precip: number;
  humidity: number;
  cloudcover: number;
  feelslike: number;
  uv_index: number;
  visibility: number;
  is_day: string; // "yes" or "no"
  astro?: WeatherstackAstro;
  air_quality?: {
    co?: string;
    no2?: string;
    o3?: string;
    so2?: string;
    pm2_5?: string;
    pm10?: string;
    'us-epa-index'?: string;
    'gb-defra-index'?: string;
  };
}

export interface WeatherstackAstro {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: number;
}

export interface WeatherstackHourly {
  time: string; // e.g. "0", "300", "600", "1200", "1500"
  temperature: number;
  wind_speed: number;
  wind_degree: number;
  wind_dir: string;
  weather_code: number;
  weather_icons: string[];
  weather_descriptions: string[];
  precip: number;
  humidity: number;
  visibility: number;
  pressure: number;
  cloudcover: number;
  heatindex: number;
  dewpoint: number;
  windchill: number;
  windgust: number;
  feelslike: number;
  chanceofrain: string;
  chanceofremdry?: string;
  chanceofwindy?: string;
  chanceofovercast?: string;
  chanceofsunshine?: string;
  chanceoffrost?: string;
  chanceofhightemp?: string;
  uv_index: number;
}

export interface WeatherstackDayForecast {
  date: string;
  date_epoch: number;
  astro: WeatherstackAstro;
  mintemp: number;
  maxtemp: number;
  avgtemp: number;
  totalsnow: number;
  sunhour: number;
  uv_index: number;
  hourly?: WeatherstackHourly[];
}

export interface WeatherstackResponse {
  request: WeatherstackRequest;
  location: WeatherstackLocation;
  current: WeatherstackCurrent;
  forecast?: Record<string, WeatherstackDayForecast>;
  success?: boolean;
  error?: {
    code: number;
    type: string;
    info: string;
  };
}

export interface WeatherstackAutocompleteItem {
  name: string;
  country: string;
  region: string;
  lat: string;
  lon: string;
}

export interface SavedLocation {
  id: string;
  name: string;
  region?: string;
  country: string;
  lat?: string;
  lon?: string;
  savedAt: number;
}

export interface RecentSearch {
  query: string;
  displayName: string;
  searchedAt: number;
}

export type WeatherConditionType = 
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'snow'
  | 'windy';
