// Free weather API endpoints
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const WEATHER_APIS = [
  {
    name: 'Open-Meteo',
    url: (lat, lon) => `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`,
    parse: (data) => ({
      temp: Math.round(data.current_weather.temperature),
      code: data.current_weather.weathercode,
      source: 'Open-Meteo'
    })
  },
  {
    name: 'wttr.in',
    url: (lat, lon) => `https://wttr.in/${lat},${lon}?format=j1`,
    parse: (data) => ({
      temp: parseInt(data.current_condition[0].temp_C),
      code: parseInt(data.current_condition[0].weatherCode),
      source: 'wttr.in'
    })
  }
];

// Get location from IP
async function getLocationFromIP(ip) {
  try {
    // Try multiple free geolocation services
    const services = [
      `https://ipapi.co/${ip}/json/`,
      `https://ipapi.com/json/${ip}?key=free`,
    ];
    
    for (const url of services) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.latitude && data.longitude) {
            return { lat: data.latitude, lon: data.longitude };
          }
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  } catch (error) {
    console.error('Geo lookup failed:', error);
    return null;
  }
}

async function fetchWeather(lat, lon) {
  const errors = [];
  
  for (const api of WEATHER_APIS) {
    try {
      const res = await fetch(api.url(lat, lon));
      if (res.ok) {
        const data = await res.json();
        return api.parse(data);
      }
    } catch (error) {
      errors.push(`${api.name}: ${error.message}`);
      continue;
    }
  }
  
  throw new Error(`All weather APIs failed: ${errors.join(', ')}`);
}

// WMO Weather interpretation codes
const WEATHER_CODES = {
  0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Fog', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
  61: 'Rain', 63: 'Rain', 65: 'Rain', 71: 'Snow', 73: 'Snow', 75: 'Snow',
  80: 'Showers', 81: 'Showers', 82: 'Showers', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
};

// Map weather code to emoji
function getWeatherEmoji(code) {
  const codeMap = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌧️', 53: '🌧️', 55: '🌧️',
    61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '❄️', 73: '❄️', 75: '❄️',
    80: '🌦️', 81: '🌦️', 82: '🌦️',
    95: '⛈️', 96: '⛈️', 99: '⛈️'
  };
  return codeMap[code] || '🌡️';
}

export async function GET(request) {
  try {
    // Default fallback location (Paris)
    const DEFAULT_LOC = { lat: 48.8566, lon: 2.3522 };
    
    // Get user IP
    const headers = request.headers;
    const ip = headers.get('x-forwarded-for')?.split(',')[0] || 
               headers.get('x-real-ip') || 
               null;
    
    // Get location from IP
    let location = null;
    if (ip) {
      location = await getLocationFromIP(ip);
    }
    
    // Use default if IP lookup fails
    if (!location) {
      location = DEFAULT_LOC;
    }
    
    // Fetch weather
    const weather = await fetchWeather(location.lat, location.lon);
    
    return Response.json({
      temp: weather.temp,
      condition: WEATHER_CODES[weather.code] || 'Unknown',
      emoji: getWeatherEmoji(weather.code),
      source: weather.source,
      location: { lat: location.lat, lon: location.lon }
    });
  } catch (error) {
    console.error('Weather error:', error);
    return Response.json({ 
      error: error.message,
      temp: null,
      condition: 'Unavailable',
      emoji: '❓',
      source: 'error'
    });
  }
}
