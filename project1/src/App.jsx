import './App.css';
import './Page1.css';
import './components/Post.css';

import React, { useState, useEffect, useRef } from 'react';
import { Marker, MapContainer, TileLayer } from 'react-leaflet';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Page1 from './Page1';
import PostCard from './components/Post';
import Popup from './components/Popup';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';



function App() {





  // Control the visibility of Popup with button
  const [showPopup, setShowPopup] = useState(false);
  const [allPhotos, setAllPhotos] = useState([]);
  // array with all countries coordinates
  const [markers, setMarkers] = useState([]);
  const [hoveredPhotoUrl, setHoveredPhotoUrl] = useState(null);
  const postCardRefs = useRef({});

  // Fetch photos from server
  const fetchPhotos = () => {
    console.log(`Fetching photos for page: MainPage...`);
    fetch('http://localhost:5000/photos?page=MainPage') // starts request and returns promise
      .then((res) => { // when request done, run this function (res => {...}) res stores result of fetch
        console.log('Response status:', res.status);
        if (!res.ok) {
          throw new Error('Failed to fetch photos');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched photos:', data);
        setAllPhotos(data);
      })
      .catch((err) => console.error('Error fetching photos:', err));
  };

  // useEffect runs after UI update
  useEffect(() => {
    fetchPhotos();
  }, []); // [] run when new component appears

  // fetch coordinates of all photos
  useEffect(() => {
    async function fetchCoordinates() {
      const resolvedMarkers = await Promise.all(
        allPhotos.map(async (photo) => {
          const [lat, lon] = await getCoordinatesFromLocation(photo.location); // or photo.name
          return {
            position: [lat, lon],
            label: photo.location,
            url: photo.url,
          };
        })
      );
      setMarkers(resolvedMarkers);
    }

    fetchCoordinates();
  }, [allPhotos]);

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden'; // prevents being able to scroll if popup open
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showPopup]); // rerun when showPopup changes

  const handleClosePopup = () => {
    setShowPopup(false);
    fetchPhotos();
  };

  // get coordinates of location
  async function getCoordinatesFromLocation(location) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } else {
      throw new Error("Location not found");
    }
  }

  const handleHover = (photoUrl) => {
    const el = postCardRefs.current[photoUrl];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div className="App">
                {/* Left Side */}
                <div className="topBarStyles">
                  <h1>ALBUMS</h1>

                  <button
                    style={{
                        position: 'absolute',
                        left: '90%',
                        marginTop: '0px',
                        display: 'inline-block',
                        padding: '10px 20px',
                        backgroundColor: '#5a82a8',
                        color: 'white',
                        border: '2px solid #5a82a8',
                        borderRadius: '9999px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // initial depth
                        transition: 'all 0.2s ease-in-out',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 10px rgba(0, 0, 0, 0.25)';
                        e.target.style.backgroundColor = '#476d8e';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
                        e.target.style.backgroundColor = '#5a82a8';
                      }}
                    onClick={() => {
                      setShowPopup(true);
                    }}
                  >
                    ADD TRIP
                  </button>
                </div>

                {showPopup && <Popup onClose={handleClosePopup} />}

                <div className="left-pane">
                  <div style={{ height: "100%" }}>
                    <MapContainer
                      center={[51.505, 1]}
                      zoom={2} // 0 is the whole world, 13 is city level zoom
                      style={{ height: '100%', width: '100%' }}
                      minZoom={2} // ⬅️ Don't let user zoom out too far
                      maxZoom={15} // ⬅️ Don't let user zoom in too far
                      maxBounds={[
                        [-85, -180], // Southwest corner
                        [85, 180], // Northeast corner
                      ]}
                      maxBoundsViscosity={1.0}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CARTO</a> & <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      />

                      {markers.map((marker, index) => (
                        <Marker
                          key={index}
                          position={marker.position}
                          eventHandlers={{
                            mouseover: () => {
                              setHoveredPhotoUrl(marker.url);
                              handleHover(marker.url);
                            },
                            mouseout: () => setHoveredPhotoUrl(null),
                          }}
                        />
                      ))}
                    </MapContainer>
                  </div>
                </div>

                {/* Right Side */}
                <div className="right-pane">
                  <div className="grid-container">
                    {allPhotos.map((photo) => (
                      <div
                        className="grid"
                        key={photo.url}
                        ref={(el) => (postCardRefs.current[photo.url] = el)}
                      >
                        <div
                          className={`card-wrapper ${
                            hoveredPhotoUrl === photo.url ? "hoverable" : ""
                          }`}
                        >
                          <PostCard
                            post={{
                              url: photo.url,
                              photoNum: photo.number,
                              page: 'MainPage',
                              IsPopupOpen: showPopup,
                              location: photo.location,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/Page1/:photoNum" element={<Page1 />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

/* PHOTO GRID THINGY */
