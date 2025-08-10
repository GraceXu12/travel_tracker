import './App.css'
import PostCard from "./components/Post"
import React, { useState } from "react";
import Popup from "./components/Popup"

function App() {

  // control the visibility of Popup with button
  const [showPopup, setShowPopup] = useState(false)

  const [uploadedImage, setUploadedImage] = useState(null)
 
 
  return (
    <>
    <div className="App">
      
      <button onClick={() => {setShowPopup(true);}}>OPEN POP UP</button>
      {showPopup && <Popup onClose={() => setShowPopup(false)} onImageUpload={setUploadedImage}/>}
      
      {uploadedImage && ( 
        <div>
        <h2>Uploaded Image</h2>
        <PostCard post={{
          url: uploadedImage
        }}/>
        </div>
      )}
    
    </div>
      
    </>

  );
}



export default App
