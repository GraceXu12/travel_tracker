import './App.css';
import PostCard from './components/Post';
import React, { useState, useEffect } from 'react';
import Popup from './components/Popup';
import {Marker, MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import './Page1.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Page1 from './Page1';

import './components/Post.css';





function App() {
  // Control the visibility of Popup with button
  const [showPopup, setShowPopup] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [allPhotos, setAllPhotos] = useState([]);

  // array with all coutnries coordinates
  const [markers, setMarkers] = useState([]);

  const [hoveredPhotoUrl, setHoveredPhotoUrl] = useState(null);

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




useEffect(() => {
  console.log("Hovered photo URL:", hoveredPhotoUrl);
}, [hoveredPhotoUrl]);

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

  // Handle new image upload - this runs when popup closes
  const handleImageUpload = (imageURL) => {
    console.log('New image uploaded:', imageURL);
    setUploadedImage(imageURL);
    // Note: fetchPhotos is called by onPhotoSaved when the photo is actually saved to DB
  };

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

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div className="App">
                {/* Left Side */}
                <div className="left-pane">
                  <div className="topBarStyles">
                    <h2>My Top Bar</h2>
                  </div>

                  <div  style={{height: "100vh"}}>
                    <MapContainer
                      center={[51.505, 1]}
                      zoom={4} // 0 is the whole world, 13 is city level zoom
                      style={{ height: '100%', width: '100%' }}
                      minZoom={2}  // ⬅️ Don't let user zoom out too far
                      maxZoom={15} // ⬅️ Don't let user zoom in too far
                      maxBounds={[
                        [-85, -180], // Southwest corner
                        [85, 180]    // Northeast corner
                      ]}
                      maxBoundsViscosity={1.0}
                    >
                      <TileLayer  
                        attribution='&copy; <a href="https://carto.com/">CARTO</a> & <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      />

                   {markers.map((marker, index) => (
                    <Marker key={index} position={marker.position}
                            eventHandlers={{
                              mouseover: () => setHoveredPhotoUrl(marker.url),
                              mouseout: () => setHoveredPhotoUrl(null),
                            }}
                            >
                    </Marker>
                  ))}

                                        

                    </MapContainer>



                  </div>

                
                  
                </div>

                {/* Right Side */}
                <div className="right-pane">
                  <h3>Right Side Content</h3>
                  <p>This is your right-side panel. You can add more UI here.</p>
                  <div className="grid-container">
                    {allPhotos.map((photo) => (
                      <div className="grid" key={photo.url}>
                        <div className="card-wrapper">
                       
                          <PostCard 

                           className={hoveredPhotoUrl === photo.url ? "hoverable" : ""}
                            post={{
                              url: photo.url,
                              photoNum: photo.number,
                              page: 'MainPage',
                              IsPopupOpen: showPopup,
                              location: photo.location
                            }}
                            
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                    <button
                    style={{
                      marginTop: '70px',
                      padding: '10px 20px',
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setShowPopup(true);
                    }}
                  >
                    OPEN POP UP
                  </button>

                  {showPopup && <Popup onClose={handleClosePopup} />}
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
