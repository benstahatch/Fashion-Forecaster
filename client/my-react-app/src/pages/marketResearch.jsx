import React,  {useState, useEffect, use} from 'react';
import "./marketResearch.css";

function MarketResearch() {
  const reports = [
    {
      title: "Weekly Trend Summary",
      content: "A weekly overview of the latest fashion trends and consumer insights.",
      // source: "Inspired by Business of Fashion & McKinsey State of Fashion",
      link: "https://www.vogue.com/fashion/trends"
    },
    {
      title: "Consumer Behavior Insights",
      content: "An analysis of how consumer behavior is evolving in the fashion industry.",
      link: "https://www.vogue.com/business/consumers/consumer-behavior"
    },
    {
      title: "Retail Forecasts",
      content: "Predictions for retail performance and emerging market opportunities.",
      link: "https://www.wgsn.com/en/blog"
    }
  ];
  
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCity, setActiveCity] = useState(null);
  const [images, setImages] = useState({});
  const [loadingCity, setLoadingCity] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredCity, setHoveredCity] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [hoveringIcon, setHoveringIcon] = useState(false);
  const intervalRef = React.useRef({});

  const fetchCityImages = async (city) => {
    setLoadingCity(city);

    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${city} street style&per_page=1000000`,
        {
          headers: {
            Authorization: import.meta.env.VITE_PEXELS_API_KEY
          }
        }
      );

      const data = await res.json();
      const newPhotos = data.photos;

      const shownImageIds = new Set(images[city]?.shownImageIds || []);
      const availablePhotos = newPhotos.filter(p => !shownImageIds.has(p.id));

      if (availablePhotos.length === 0) {
        console.log("All images have been shown for", city, "resetting...");
        shownImageIds.clear();
        availablePhotos.push(...newPhotos);
      }
      
      const randomIndex = Math.floor(Math.random() * availablePhotos.length);
      const selectedImage = availablePhotos[randomIndex];

      setImages(prev => ({
        ...prev,
        [city]: {
          photos: newPhotos,
          photo: selectedImage,
          shownImageIds: new Set([...shownImageIds, selectedImage.id])
        }
      }));
    } catch (err) {
      console.error("Error fetching images for", city, err);
    }
    
    setLoadingCity(null);
    };

    const startAutoShuffle = (city) => {
      if (intervalRef.current[city]) return;

      intervalRef.current[city] = setInterval(() => {
        shuffleCityImage(city);
      }, 15000);
    };

    const stopAutoShuffle = (city) => {
      if (intervalRef.current[city]) {
        clearInterval(intervalRef.current[city]);
        delete intervalRef.current[city];
      }
    };

    const shuffleCityImage = (city) => {
      setImages(prev => {
        const cityData = prev[city];
        if (!cityData?.photos) return prev;

        let shown = new Set(cityData.shownImageIds || []);
        let available = cityData.photos.filter(p => !shown.has(p.id));

        if (available.length === 0) {
          shown = new Set();
          available = cityData.photos;
        }

        const random = available[Math.floor(Math.random() * available.length)];

        shown.add(random.id);

        return {
          ...prev,
          [city]: {
            ...cityData,
            photo: random,
            shownImageIds: shown
          }
        };
      });
    }

    useEffect(() => {
      const cities = ["New York", "Los Angeles", "London", "Milan", "Paris", "Tokyo", "Seoul"];
      cities.forEach(city => fetchCityImages(city));
    }, []);

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setExpandedImage(null);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
      if(expandedImage) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }, [expandedImage]);

    useEffect(() => {
      return () => {
        Object.values(intervalRef.current).forEach(clearInterval);
      };
    }, []);

    useEffect(() => {
      const cities = ["New York", "Los Angeles", "London", "Milan", "Paris", "Tokyo", "Seoul"];

      cities.forEach(city => {
        startAutoShuffle(city);
      });

      return () => {
        cities.forEach(city => stopAutoShuffle(city));
      };
    }, []);

  return(
    <div className="market-research-container">
      <h1>Market Research</h1>

      <section className="section">
        <h2>Zeitgeist</h2>
        <div className="zeitgeist-grid">
          {/* <div className="zeitgeist-card">
            <span role="img" aria-label="leaf">🍃</span>
            <h3>Sustainability</h3>
            <p>The zeigeist movement represents a shift towards redefining normalcy and ethical consumption.
              Consumers are increasingly prioritizing eco-friendly products and brands. 
            </p>
          </div> */}

          <div className="zeitgeist-card">
            <span>🍃</span>
            <h3>Sustainability</h3>

            <div className="hidden-text">
              <p>
                The Zeitgeist Movement represents a shift towards redefining normalcy and ethical production.
                Advocates of the movement and consumers are increasingly prioritizing eco-friendly products and brands. 
              </p>
            </div>
          </div>

          {/* <div className="zeitgeist-card">
            <span role="img" aria-label="digital">📱</span>
            <h3>Digital Culture</h3>
            <p>Social media and online communities are shaping consumer preferences and trends.</p>
          </div> */}

          <div className="zeitgeist-card">
            <span>📱</span>
            <h3>Digital Culture</h3>
            
            <div className="hidden-text">
              <p>
                Social media has accelerated the rise of microtrends, contributing to digital fatigue. 
                As a result, younger generations are shifting away from rapid trend cycles and 
                seeking brands that prioritize authenticity and transparency.
              </p>
            </div>
          </div>

          {/* <div className="zeitgeist-card">
            <span role="img" aria-label="streetwear">🧢</span>
            <h3>Streetwear Influence</h3>
            <p>Streetwear continues to dominate fashion, blending casual and high-end styles.</p>
          </div> */}

          <div className="zeitgeist-card">
            <span>🎭</span>
            <h3>Individualism & Identity Expression</h3>

            <div className="hidden-text">
              <p>
                Fashion is increasingly used as a tool for self-expression and identity exploration.
                Consumers are blending styles, cultures, and eras to communicate their personality and values 
                through their clothing.
              </p>
            </div>
          </div>


          {/* <div className="zeitgeist-card">
            <span role="img" aria-label="minimalism">🎨</span>
            <h3>Minimalism</h3>
            <p>Consumers are gravitating towards simple, timeless designs and quality over quantity.</p>
          </div> */}

          <div className="zeitgeist-card">
            <span>🎨</span>
            <h3>Minimalism</h3>

            <div className="hidden-text">
              <p>
                Minimalism reflects a cultural response to digital overload and rapid microtrend cycles.
                It emphasizes timeless, versatile pieces that prioritize quality and sustainability over 
                quantity and fast fashion.
              </p>
            </div>
          </div>

          <div className="zeitgeist-card">
            <span>🕰️</span>
            <h3>Nostalgia and Escapism</h3>

            <div className="hidden-text">
              <p>
                Contemporary fashion is heavily influenced by nostalgia, with consumers seeking comfort 
                and emotional familiarity in styles from past decades. Revivals of Y2K, 90s, and 80s fashion 
                reflect a desire for escapism and connection to simpler times amid ongoing global uncertainties.
              </p>
            </div>
          </div>

        </div>
      </section>

      <section className="section">
        <h2>Street Style Monitoring</h2>
        <div className="city-grid">
          {["New York", "Los Angeles", "London", "Milan", "Paris", "Tokyo", "Seoul"].map((city, index) => (
            <div
              className="city-item"
              key={index}
              onClick={() => {
                setActiveCity(city);
                fetchCityImages(city);
              }}
              >
                <div className="city-card"
                  onMouseEnter={() => {
                    setHoveredCity(city)
                    stopAutoShuffle(city);
                  }}
                  onMouseLeave={() => {
                    setHoveredCity(null);
                    startAutoShuffle(city);
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();

                    setCursorPos({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top
                    });
                  }}
                  style={{
                    backgroundImage: images[city]?.photo?.src
                    ? `url(${images[city].photo.src.medium})` 
                    : "none"
                  }}
                >

                  {hoveredCity === city && images[city]?.photo && (
                    <div
                    className="expand-icon"
                    onMouseEnter={() => setHoveringIcon(true)}
                    onMouseLeave={() => setHoveringIcon(false)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedImage(images[city].photo.src.large ||
                        images[city].photo.src.original ||
                        images[city].photo.src.medium
                      );
                    }}
                    >
                      ⛶
                    </div>
                  )}

                  {loadingCity === city && (
                    <div className="loading-overlay">Loading images...</div>
                  )}

                  {hoveredCity === city && images[city] && !hoveringIcon && (
                    <div
                      className="cursor-hint"
                      style={{
                        left: cursorPos.x,
                        top: cursorPos.y,
                      }}
                    >
                      {images[city].caption || " Click to refresh"}
                    </div>
                  )}
                </div>


              <div className="city-label">
                <h3>{city}</h3>
              </div>
            </div>
          ))}

              {/* <div className="image-grid">
                {cityImages[city]?.map((img) => (
                  <img
                    key={img.id}
                    src={img.src.medium}
                    alt={city}
                  />
                ))}
              </div> */}
            {/* </div> */}
          {/* ))} */}

          {/* {[  {name: "New York", link: "https://theimpression.com/street-style/new-york-fashion-week/"},
              {name: "Los Angeles", link: "https://www.whowhatwear.com/tag/los-angeles"},
              {name: "London", link: "https://theimpression.com/street-style/london-fashion-week/"},
              {name: "Milan", link: "https://www.whowhatwear.com/fashion/street-style/milan-street-style-trends"},
              {name: "Paris", link: "https://www.whowhatwear.com/fashion/street-style/paris-street-style-shopping"},
              {name: "Tokyo", link: "https://www.vogue.com/slideshow/the-best-street-style-photos-from-the-fall-2026-shows-in-tokyo"},
              {name: "Seoul", link: "https://www.vogue.com/slideshow/the-best-street-style-photos-from-the-fall-2026-shows-in-seoul"},
          ].map((city, index) => (
            <div className= "city-card" key={index} onClick={() => window.open(city.link, "_blank")}>
              <h3>{city.name}</h3>
              <p>Emerging street style trends in {city.name}.</p>
            </div>
          ))} */}
        </div>
      </section>

      <section className="section">
        <h2>Consumer Trend Reports</h2>
        {reports.map((report, index) => (
          <div className="report-card" key={index} onClick={() => setActiveIndex(index === activeIndex ? null : index)}>    
            <h3>{report.title}</h3>
            {activeIndex === index && (
              <>
              <p>{report.content}</p>
              {report.source && <p className='report-source'>{report.source}</p>}

              <button className="visit-btn" 
              onClick={(e) => {
                e.stopPropagation();
                window.open(report.link, "_blank");
              }}>
                View Report
              </button>
              </>
            )}
          </div>
        ))}
      </section>

      {expandedImage && (
        <div
        className="image-modal-overlay"
        onClick={() => setExpandedImage(null)}
        >
          <div
          className="image-modal-content"
          onClick={(e) => e.stopPropagation()}
          >
            <img src={expandedImage} alt="expanded Street Style" />

            <button
            className="close-modal"
            onClick={() => setExpandedImage(null)}
            >
              ✕
              </button>
          </div>
        </div>
      )}

      <div className="pexels-credit">
        <a href="https://www.pexels.com" target="_blank" rel="noreferrer">
          Photos provided by Pexels
        </a>
      </div>
    </div>
  );
}

export default MarketResearch;