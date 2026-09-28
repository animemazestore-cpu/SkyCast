Build a modern, production-quality weather forecast website using the Weatherstack API.

API PROVIDER:
https://weatherstack.com/

Use Weatherstack as the primary and only weather data provider.

The website should be inspired by the simplicity and usability of Google Weather, but DO NOT copy Google's exact UI, branding, icons, or design. Create an original, premium interface.

━━━━━━━━━━━━━━━━━━━━━━
TECH STACK
━━━━━━━━━━━━━━━━━━━━━━

Use:

- React
- Vite
- TypeScript
- Tailwind CSS
- Lucide React icons
- Weatherstack REST API
- Responsive design
- Modern component architecture

Keep the code clean, modular, reusable, and production-ready.

━━━━━━━━━━━━━━━━━━━━━━
CORE EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━

The main goal is:

User opens website → weather for their location is shown → they immediately understand the current weather and upcoming forecast.

The interface should feel extremely fast, clean, minimal and intuitive.

No unnecessary dashboards or complicated controls.

━━━━━━━━━━━━━━━━━━━━━━
HOME PAGE
━━━━━━━━━━━━━━━━━━━━━━

Create a clean weather homepage.

Top navigation:

- Minimal logo / weather icon
- Website name: "SkyCast" (use this as a temporary name)
- Search location field
- Current location button
- °C / °F toggle
- Optional theme toggle

Search should support:

- City
- Town
- Region
- Country
- ZIP/postal code
- Coordinates

Use Weatherstack's location/search capabilities where available.

When the user searches:

"Delhi"

Show:

Delhi, India

and load its weather.

Add search suggestions/autocomplete with a small debounce so API requests aren't fired on every keystroke.

━━━━━━━━━━━━━━━━━━━━━━
CURRENT WEATHER CARD
━━━━━━━━━━━━━━━━━━━━━━

Make this the visual focus of the page.

Example structure:

Delhi, India
Monday, September 28

31°
Feels like 34°

Partly cloudy

[weather icon]

Then display:

- Feels like
- Humidity
- Wind speed
- Wind direction
- Visibility
- UV index if available
- Pressure
- Precipitation
- Cloud cover

Keep the information visually organized.

Do NOT make every metric into a huge card.

Use small elegant information rows/cards similar to a modern weather application.

━━━━━━━━━━━━━━━━━━━━━━
HOURLY FORECAST
━━━━━━━━━━━━━━━━━━━━━━

Create a horizontally scrollable hourly forecast.

Example:

NOW     12 PM    1 PM    2 PM    3 PM    4 PM
31°     32°      33°     34°     33°     32°
☀️      🌤️       ☀️      🌤️      🌧️      🌧️

Each hourly item should show:

- Time
- Weather icon
- Temperature
- Precipitation/rain information when available

Make it smooth on mobile.

On desktop, display a larger horizontal timeline.

━━━━━━━━━━━━━━━━━━━━━━
7-DAY FORECAST
━━━━━━━━━━━━━━━━━━━━━━

Create a clean weekly forecast section.

Example:

Today
31° / 25°
Partly cloudy

Tue
32° / 26°
Sunny

Wed
30° / 24°
Rain

Thu
29° / 23°
Cloudy

etc.

Each day should contain:

- Day name
- Date
- Weather icon
- Condition
- Maximum temperature
- Minimum temperature
- Rain/precipitation information if available

Use Weatherstack forecast data rather than hardcoded values.

━━━━━━━━━━━━━━━━━━━━━━
WEATHER INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━

Add a small "Weather Insights" section.

Generate simple factual descriptions from the API data.

Examples:

"Temperatures will remain around 31°C today."

"Humidity is currently 68%."

"Rain is possible during the afternoon."

"Wind is currently coming from the northwest."

Do NOT use AI or an external AI API for this.

Generate these descriptions locally using simple conditional logic based on the weather data.

━━━━━━━━━━━━━━━━━━━━━━
SUN & MOON
━━━━━━━━━━━━━━━━━━━━━━

If the Weatherstack response provides astronomy information, display:

Sunrise
☀️ 6:05 AM

Sunset
🌇 6:12 PM

Moonrise
🌙 ...

Moonset
...

Moon phase if available.

Keep this section compact.

━━━━━━━━━━━━━━━━━━━━━━
LOCATION FEATURES
━━━━━━━━━━━━━━━━━━━━━━

Add:

"Use my location"

button.

Use browser Geolocation API.

If permission is granted:

latitude + longitude
↓
Weatherstack
↓
current location weather

If permission is denied:

Show a friendly message and keep the search functionality available.

Do not repeatedly request location permission.

━━━━━━━━━━━━━━━━━━━━━━
SAVED LOCATIONS
━━━━━━━━━━━━━━━━━━━━━━

Allow users to save locations locally.

Example:

★ Delhi
★ Mumbai
★ London
★ New York

Use localStorage.

No authentication/database should be required.

Users should be able to:

- Add location
- Remove location
- Quickly switch between locations

━━━━━━━━━━━━━━━━━━━━━━
RECENT SEARCHES
━━━━━━━━━━━━━━━━━━━━━━

Store the last few searched locations in localStorage.

Show them when the search field is focused.

Example:

Recent searches

Delhi
Mumbai
Meerut
London

Allow clearing recent searches.

━━━━━━━━━━━━━━━━━━━━━━
DYNAMIC WEATHER BACKGROUND
━━━━━━━━━━━━━━━━━━━━━━

The background should subtly adapt to the current weather condition.

Examples:

Sunny → warm/light background

Cloudy → soft gray/blue

Rain → cool blue

Thunderstorm → darker atmosphere

Night → dark navy

Snow → cool white/blue

Keep the effect extremely subtle.

Do NOT create an overly flashy animated background.

━━━━━━━━━━━━━━━━━━━━━━
WEATHER ICONS
━━━━━━━━━━━━━━━━━━━━━━

Use clean modern icons.

Prefer:

Lucide icons where appropriate.

For weather-specific conditions, create a consistent icon mapping based on Weatherstack's weather descriptions / weather codes.

Do not use random emoji as the primary visual system.

The icon style must remain consistent throughout the application.

━━━━━━━━━━━━━━━━━━━━━━
RESPONSIVE DESIGN
━━━━━━━━━━━━━━━━━━━━━━

Desktop:

Large centered weather dashboard.

Mobile:

App-like layout.

Prioritize:

1. Location
2. Temperature
3. Condition
4. Hourly forecast
5. Daily forecast
6. Weather details

The mobile version should feel especially polished.

Avoid horizontal page overflow.

Hourly forecast can horizontally scroll.

━━━━━━━━━━━━━━━━━━━━━━
LOADING EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━

Never show a blank screen while fetching weather.

Use skeleton loaders.

Example:

Location skeleton
Temperature skeleton
Hourly forecast skeleton
Daily forecast skeleton

Add subtle transitions.

━━━━━━━━━━━━━━━━━━━━━━
ERROR HANDLING
━━━━━━━━━━━━━━━━━━━━━━

Handle:

- Invalid location
- API errors
- Network failure
- Empty search
- Geolocation failure
- Weatherstack API quota/error responses

Show friendly messages.

Example:

"Couldn't find that location. Try searching for a city or country."

Never expose raw API errors to the user.

━━━━━━━━━━━━━━━━━━━━━━
API ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━

Create a dedicated weather service.

Example structure:

src/
components/
pages/
services/
weatherstack.ts
hooks/
useWeather.ts
utils/
weatherUtils.ts
types/
weather.ts
lib/
App.tsx

Do NOT put API calls directly inside UI components.

Create TypeScript interfaces/types for Weatherstack responses.

Use reusable functions such as:

getCurrentWeather()
getForecast()
searchLocation()

━━━━━━━━━━━━━━━━━━━━━━
API KEY SECURITY
━━━━━━━━━━━━━━━━━━━━━━

Never hardcode the API key directly inside React components.

Use environment variables.

Example:

VITE_WEATHERSTACK_API_KEY=your_api_key

Create:

.env.example

with:

VITE_WEATHERSTACK_API_KEY=

If the API plan/environment creates browser-side security limitations, structure the project so the API layer can later be moved behind a serverless/Vercel function without rewriting the UI.

━━━━━━━━━━━━━━━━━━━━━━
PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━

Optimize API usage.

Implement:

- Search debounce
- Request cancellation where appropriate
- Local caching
- Avoid duplicate requests
- Lazy loading where useful
- Efficient React rendering

Cache weather results locally for a short period so refreshing the page does not immediately create unnecessary API requests.

Do not continuously poll the API.

━━━━━━━━━━━━━━━━━━━━━━
DESIGN SYSTEM
━━━━━━━━━━━━━━━━━━━━━━

Visual style:

Minimal
Premium
Clean
Modern
Soft
Professional

Avoid:

- Excessive gradients
- Glassmorphism everywhere
- Huge shadows
- Excessive rounded cards
- Neon colors
- AI-generated-looking UI
- Unnecessary animations
- Fake weather data
- Fake testimonials
- Fake statistics

Use:

- White/light neutral base
- Soft blue accents
- Dark navy text
- Subtle borders
- Very light shadows
- Large readable typography
- Generous spacing

Dark mode should also be supported.

━━━━━━━━━━━━━━━━━━━━━━
ANIMATIONS
━━━━━━━━━━━━━━━━━━━━━━

Use subtle animations only.

Examples:

- Search results fade in
- Weather card transitions when location changes
- Forecast cards gently appear
- Temperature changes smoothly
- Buttons have subtle hover states

Do not over-animate the application.

━━━━━━━━━━━━━━━━━━━━━━
ACCESSIBILITY
━━━━━━━━━━━━━━━━━━━━━━

Implement:

- Semantic HTML
- Keyboard navigation
- Proper button labels
- ARIA labels where required
- Good contrast
- Visible focus states
- Alt text for meaningful images
- Screen-reader-friendly weather information

━━━━━━━━━━━━━━━━━━━━━━
SEO
━━━━━━━━━━━━━━━━━━━━━━

Add:

Title:

"SkyCast — Weather Forecast"

Meta description:

"Check current weather, hourly forecasts and upcoming weather conditions for locations around the world."

Use semantic headings.

━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT API REQUIREMENT
━━━━━━━━━━━━━━━━━━━━━━

Do not invent API fields.

Before implementing the API integration, inspect the Weatherstack API documentation and build the data mapping according to the actual response structure.

Weatherstack supports current weather and forecast endpoints, including hourly and daily forecast data depending on the subscription plan.

If a requested feature is not available on the user's current Weatherstack plan:

1. Do not fake the data.
2. Gracefully hide that feature or show an appropriate unavailable state.
3. Keep the architecture ready for the feature if the API plan is upgraded later.

━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT DEVELOPMENT RULE
━━━━━━━━━━━━━━━━━━━━━━

First inspect the existing project structure.

If this is an empty project, initialize the React + Vite + TypeScript + Tailwind setup.

If a project already exists, do NOT unnecessarily rewrite the entire project.

Build the application incrementally.

First implement:

1. API integration
2. Search
3. Current weather
4. Hourly forecast
5. 7-day forecast
6. Responsive UI
7. Location detection
8. Saved/recent locations
9. Error/loading states
10. Final visual polish

After implementation, test the complete flow.

Make sure:

Search → API request → response parsing → UI rendering

works correctly.

Do not use mock weather data once the Weatherstack integration is implemented.

The final result should feel like a polished real-world weather product, not a tutorial/demo weather app.