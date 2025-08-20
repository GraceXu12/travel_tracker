import './App.css'
import PostCard from "./components/Post"
import React, { useState, useEffect  } from "react";
import Popup from "./components/Popup"

import './Page1.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Page1 from './Page1';

import './components/Post.css';

function App() {

  // control the visibility of Popup with button
  const [showPopup, setShowPopup] = useState(false)

  const [uploadedImage, setUploadedImage] = useState(null)
 
  const [allPhotos, setAllPhotos] = useState([]);

  
 
  // Fetch photos from server
  const fetchPhotos = () => {
    console.log(`Fetching photos for page: MainPage...`);
    fetch(`http://localhost:5000/photos?page=MainPage`) // starts requests and returns promise
      .then(res => { // when request done, run this function ( res => {...}) res stores result of fetch
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error('Failed to fetch photos');
        }
        return res.json();
      })
      .then(data => {
        console.log("Fetched photos:", data);
        setAllPhotos(data);
      })
      .catch(err => console.error("Error fetching photos:", err));
  };

  // useEffect runs after UI update
  useEffect(() => {

    fetchPhotos();

  }, []); //[] run when new component appears


  useEffect(() => {
     if (showPopup) {
      document.body.style.overflow = "hidden"; // prevents being able to scroll if popup open
    } else {
      document.body.style.overflow = "auto"; 
    }
  }, [showPopup]); // rerun when showPopup changes
  // Handle new image upload - this runs when popup closes
  const handleImageUpload = (imageURL) => {
    console.log("New image uploaded:", imageURL);
    setUploadedImage(imageURL);
    // Note: fetchPhotos is called by onPhotoSaved when the photo is actually saved to DB
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    console.log("baaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    fetchPhotos();
  }


  return (
    <>
      
      <Router>
      <Routes>
        <Route path="/" element={

    <div className="App">
      
      <button onClick={() => {setShowPopup(true);}}>OPEN POP UP</button>
      {showPopup && (
        <Popup
          onClose={handleClosePopup}  // Pass our handler to Popup
        />
      )}
 

  

      <div className="grid-container">
        {allPhotos.map((photo) => (
          <div className="grid" key = {photo.url}>
             <div className="card-wrapper">
                <PostCard  post={{ url: photo.url, photoNum: photo.number, page: "MainPage",  IsPopupOpen:showPopup  }} />
             </div>
        </div>
      ))}
   
    
     
 
 
      </div>
    
    </div>
     } />

     <Route path="/Page1/:photoNum" element={<Page1 />} />
      </Routes>
    </Router>
    </>

  );
}



export default App
