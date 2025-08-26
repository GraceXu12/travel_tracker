import React, { useState, useEffect  } from "react";
import PostCard from "./components/Post"
import { useNavigate,useParams } from "react-router-dom";
import Images from "./components/Images"
import './Page1.css'
import './App.css'



import { useLocation } from 'react-router-dom';




function Page1() {
    const [file, setFile] = useState(null);

    const [uploadedImageURL, setUploadedImageURL] = useState(null);

    const [photo, setPhoto] = useState(null);

    const [allPhotos, setAllPhotos] = useState([]); 
    const [isUploading, setIsUploading] = useState(true); // disabling closing popup button (save) if upload not ready
    const { photoNum } = useParams();


     const navigate = useNavigate(); // hook to navigate programmatically

  const handleRedirect = () => {
    navigate("/"); // "/" is your main page route
  };


  const location = useLocation();
  const photoLocation = location.state?.location;

 async function uploadPic(obj, pageName){
       
        // e is event object that browser passes to even handler function 
       
        // creates temp URL pointing to the file
        // saves URL in state variable file


        const data = new FormData() // construct set of key-value pairs
        data.append("file", obj )
        data.append("upload_preset","travel_diary")

        // fetch() - built-in JS function to make HTTP requests ( talk to servers over internet)
        // method: POST - sending data to server to create something new
        // body: data - content 
        // await - tell JS to wait until server responds to your request before moving on 
        const res = await fetch("https://api.cloudinary.com/v1_1/dmoiuke2e/image/upload",{
            method:"POST" ,
            body: data
        })
        // waits for cloudinary's response and converts it from json to js object
        // contains info about uploaded image including url
        const json = await res.json()

         setUploadedImageURL(json.url); 

        // send url to MangoDb through backend
        await fetch("http://localhost:5000/save-photo", { // adjust port if needed
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: json.url , page: pageName, number: photoNum})
        });
        setIsUploading(false);
        return json.url
      }


 


    async function handleChange(e){
         // e is event object that browser passes to even handler function 
        const file = e.target.files[0];

        // creates temp URL pointing to the file
        // saves URL in state variable file
        setFile(URL.createObjectURL(file));
       // uploadPromise = uploadPic(file);
        await uploadPic(file, "Page1");
        //await uploadPromise;
        fetchPhotos(photoNum);

    }

      const fetchPhotos = (photoNum) => {
    console.log(`Fetching photos for page: Page1...`);
    fetch(`http://localhost:5000/photos?page=Page1&number=${photoNum}`) // starts requests and returns promise
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


      useEffect(() => {
    
        fetchPhotos(photoNum);
        console.log("+++++++++++++++++++= photoNum =", photoNum)
    
      }, [photoNum]); 

  
    return (
      <div className="page1-container">
  <div className="topBarStyles">
    <button className="BackButton" onClick={handleRedirect}>Back</button>
    <h1 style={{ margin: 0, textAlign: 'center' }}>{photoLocation}</h1>

    <input style={{ display: 'none' }} id="fileUpload" type="file" accept="image/*" onChange={handleChange} />
    <label htmlFor="fileUpload" className="plus-button">+</label>
  </div>

  <div className="masonry-scroll-container">
    <div className="masonry">
      {allPhotos.map((photo) => (
        <div className="masonry-item" key={photo.url}>
          <Images post={{ url: photo.url, photoNum: photoNum, page: "Page1" }} />
        </div>
      ))}
    </div>
  </div>
</div>

     
    );
};

export default Page1;