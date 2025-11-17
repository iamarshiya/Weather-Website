import React, { useState, useEffect } from 'react';

// --- 1. IMPORT FONTS (Clean & Modern) ---
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Orbitron:wght@500;700&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

const API_KEY = "67b92f0af5416edbfe58458f502b0a31";

// --- LOGIC SECTION (Normal Weather Names) ---
const determineWeatherType = (temp, conditions) => {
  const filteredTemp = Math.round(temp); 
  let type = '';
  let imageClass = ''; 

  // We map normal weather conditions to your existing background images
  if (conditions === 'Rain' || conditions === 'Thunderstorm') {
    type = 'Stormy';
    imageClass = 'kamino-bg';
  } else if (conditions === 'Mist' || conditions === 'Fog') {
    type = 'Foggy';
    imageClass = 'endor-bg';
  } else {
    if (filteredTemp <= 2) { 
      type = 'Freezing';
      imageClass = 'Hoth-bg';
    } else if (filteredTemp <= 13) { 
      type = 'Chilly';
      imageClass = 'naboo-bg-warmer';
    } else if (filteredTemp <= 18) { 
      type = 'Moderate';
      imageClass = 'coruscant-bg';
    } else if (filteredTemp <= 22) { 
      type = 'Warm';
      imageClass = 'scariff-bg';
    } else if (filteredTemp <= 26) { 
      type = 'Hot';
      imageClass = 'tattoine-bg';
    } else if (filteredTemp <= 32) { 
      type = 'Very Hot';
      imageClass = 'bespin-bg';
    } else { 
      type = 'Scorching';
      imageClass = 'kashyyk-bg';
    }
  }
  return { type, imageClass };
};

const determineTempMessage = (temp, conditions) => {
  return `It's ${Math.round(temp)}°C, ${conditions}.`;
};

const determineDescription = (type) => {
  const currType = type.toLowerCase();
  
  if (currType === 'stormy') return 'Heavy rain expected. Keep an umbrella handy.';
  if (currType === 'foggy') return 'Low visibility due to fog. Drive carefully.';
  if (currType === 'freezing') return 'Freezing temperatures. Wear thermal clothing.';
  if (currType === 'chilly') return 'A bit cold outside. A jacket is recommended.';
  if (currType === 'moderate') return 'Pleasant weather. Great for a walk.';
  if (currType === 'warm') return 'Warm and clear. Enjoy the sunshine.';
  if (currType === 'hot') return 'Hot weather today. Stay hydrated.';
  if (currType === 'very hot') return 'Very hot conditions. Avoid direct sun.';
  return 'Extreme heat advisory. Stay indoors if possible.';
};

const WeatherUI = () => {
  const [city, setCity] = useState('Jammu');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weatherInfo, setWeatherInfo] = useState({
    type: '', description: '', tempMessage: '', imageClass: 'default-bg',
  });

  const fetchWeather = async (cityToFetch) => {
    if (!cityToFetch) return;
    setIsLoading(true);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityToFetch}&units=metric&appid=${API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      setWeatherData(data);

    } catch (error) {
      console.error("Failed to fetch weather:", error);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []); 

  useEffect(() => {
    if (weatherData) {
      const temp = weatherData.main.temp;
      const conditions = weatherData.weather[0].main;

      const { type, imageClass } = determineWeatherType(temp, conditions);
      const tempMessage = determineTempMessage(temp, conditions);
      const description = determineDescription(type);

      setWeatherInfo({ type, description, tempMessage, imageClass });
    } else {
        setWeatherInfo({ type: '', description: '', tempMessage: '', imageClass: 'default-bg' });
    }
  }, [weatherData]); 

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  return (
    <div 
      id="image-container" 
      style={{ 
        ...styles.imageContainer, 
        ...styles[weatherInfo.imageClass] 
      }}
    >
      <div style={styles.page}>
        
        {/* --- THE CLEAN CARD UI --- */}
        <form style={styles.card} onSubmit={handleSearch}>
          
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search city..."
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton}>🔍</button>
          </div>

          {isLoading ? (
            <div style={styles.loadingText}>Loading...</div>
          ) : weatherData ? (
            <div style={styles.infoContainer}>
              
              {/* Main Weather Type (e.g. "Hot", "Stormy") */}
              <h2 style={styles.mainTitle}>
                {weatherInfo.type}
              </h2>

              {/* Temperature Line */}
              <p style={styles.tempText}>
                {weatherInfo.tempMessage}
              </p>

              {/* Description Line */}
              <p style={styles.descText}>
                {weatherInfo.description}
              </p>

              {/* Stats Row (Humidity/Wind) */}
              <div style={styles.statsRow}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Humidity</span>
                  <span style={styles.statValue}>{weatherData.main.humidity}%</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Wind</span>
                  <span style={styles.statValue}>{weatherData.wind.speed} km/h</span>
                </div>
              </div>

            </div>
          ) : (
            <div style={styles.errorText}>City not found.</div>
          )}
        </form>

      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  imageContainer: {
    width: '100vw',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden', 
    position: 'relative',
    transition: 'background-image 0.5s ease-in-out', // Smooth image change
  },
  
  page: {
    height: '100%', 
    width: '100%', 
    fontFamily: "'Inter', sans-serif",
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Simple static overlay
  },

  // --- CARD STYLES ---
  card: {
    position: 'relative',
    width: '360px',
    padding: '35px',
    borderRadius: '24px', 
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background
    backdropFilter: 'blur(15px)', // Glass blur
    WebkitBackdropFilter: 'blur(15px)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)', 
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  },

  searchContainer: {
    display: 'flex',
    marginBottom: '25px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: '30px',
    padding: '4px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    padding: '10px 15px',
    fontSize: '0.95rem',
    color: 'white',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  searchButton: {
    border: 'none',
    background: 'transparent',
    color: '#00d4ff', 
    cursor: 'pointer',
    padding: '0 15px',
    fontSize: '1.1rem',
  },

  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  mainTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#ffffff',
    fontFamily: "'Orbitron', sans-serif", // Keeping this for a modern header look
  },
  tempText: {
    fontSize: '1.3rem',
    fontWeight: '400',
    margin: '0 0 15px 0',
    color: '#eeeeee',
  },
  descText: {
    fontSize: '0.95rem',
    margin: '0 0 25px 0',
    color: '#cccccc',
    lineHeight: '1.4',
  },

  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    paddingTop: '15px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#aaaaaa',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  statValue: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
  },

  loadingText: { textAlign: 'center', color: '#aaa', padding: '20px' },
  errorText: { textAlign: 'center', color: '#ff6b6b', padding: '20px' },

  // --- IMAGE PATHS ---
  'default-bg': {
    backgroundImage: "url('/images/loading.png')"
  },
  'kamino-bg': { backgroundImage: "url('/images/kamino.png')" }, 
  'endor-bg': { backgroundImage: "url('/images/endor1.jpg')" },
  'Hoth-bg': { backgroundImage: "url('/images/hoth.jpg')" },
  'naboo-bg-warmer': { backgroundImage: "url('/images/Naboo-warmer.jpg')" },
  'coruscant-bg': { backgroundImage: "url('/images/coruscant-night.jpg')" },
  'scariff-bg': { backgroundImage: "url('/images/Scariff.jpg')" },
  'tattoine-bg': { backgroundImage: "url('/images/tatooine.jpg')" },
  'bespin-bg': { backgroundImage: "url('/images/bespin.jpg')" },
  'kashyyk-bg': { backgroundImage: "url('/images/kashyyk.jpg')" }
};

export default WeatherUI;