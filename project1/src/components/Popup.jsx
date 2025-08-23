import { useState } from "react";
import PostCard from './Post';

function Popup({ onClose }) {
    const [file, setFile] = useState(null);
    const [uploadedImageURL, setUploadedImageURL] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [location, setLocation] = useState('');
    const [rawFile, setRawFileState] = useState(null);
     
    const handleChangeInput = (e) => {
        setLocation(e.target.value);
    };

 

    async function uploadPic(obj, pageName, location) {
        const data = new FormData();
        data.append("file", obj);
        data.append("upload_preset", "travel_diary");

        const res = await fetch("https://api.cloudinary.com/v1_1/dmoiuke2e/image/upload", {
            method: "POST",
            body: data
        });

        const json = await res.json();
        setUploadedImageURL(json.url);

        await fetch("http://localhost:5000/save-photo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: json.url, page: pageName, location: location})
        });

        setIsUploading(false);
        return json.url;
    }

    async function handleChange(e) {
        const file = e.target.files[0];
        if (file){
            setFile(URL.createObjectURL(file));
            setRawFileState(file);
            console.log(rawFile,"--------------")
        }
        
        //await uploadPic(file, "MainPage");
    }

    async function handleClose(actionType) {
        if (actionType== "Save" && rawFile){

            setIsUploading(true);
            await uploadPic(rawFile, "MainPage", location)
            setIsUploading(false);

        }
        console.log("+++++++++++++++++++++++++++++++++++++Location is ",location )
        
        onClose();
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            zIndex: 2000
        }}>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '500px',
                height: '500px',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                zIndex: 1000,
                overflowY: "auto"
            }}>

                {/* Close Button */}
                <button
                    onClick={() =>{handleClose("Close")}}
                    style={{
                        position: 'fixed',
                        top: '30px',
                        right: '30px',
                    }}
                >
                    Close
                </button>

                {/* Save Button */}
                <button
                    onClick={() =>{handleClose("Save")}}
                    disabled={!rawFile || isUploading}
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px'
                    }}
                >
                    SAVE
                </button>

                {/* File Upload Section */}
                <div>
                    <h2>Add Image:</h2>
                    <input type="file" accept="image/*" onChange={handleChange} />
                </div>

                {/* Image Preview */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {file && <PostCard post={{ url: file, IsPopupOpen: true }} />}
                </div>

                {/* Form for Place/Location */}
                <div>
                  
                        <label htmlFor="location">Place:</label><br />
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={location}
                            onChange={handleChangeInput}
                        /><br />
                       
                  
                </div>
            </div>
        </div>
    );
}

export default Popup;
