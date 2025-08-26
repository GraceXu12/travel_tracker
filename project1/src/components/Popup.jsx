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
            body: JSON.stringify({ url: json.url, page: pageName, location: location })
        });

        setIsUploading(false);
        return json.url;
    }

    async function handleChange(e) {
        const file = e.target.files[0];
        if (file) {
            setFile(URL.createObjectURL(file));
            setRawFileState(file);
            console.log(rawFile, "--------------");
        }

        // await uploadPic(file, "MainPage");
    }

    async function handleClose(actionType) {
        if (actionType == "Save" && rawFile) {
            setIsUploading(true);
            await uploadPic(rawFile, "MainPage", location);
            setIsUploading(false);
        }

        console.log("+++++++++++++++++++++++++++++++++++++Location is ", location);
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
                    onClick={() => { handleClose("Close") }}
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                    }}
                >
                    Close
                </button>

                {/* Save Button */}
                <button
                    onClick={() => { handleClose("Save") }}
                    disabled={!rawFile || isUploading}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px'
                    }}
                >
                    SAVE
                </button>

                {/* File Upload Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginLeft: '100px', marginTop: '10px' }}>
                    <h2>ADD TRIP:</h2>
                    <label
                        htmlFor="file-upload"
                        style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#5a82a8',
                            color: 'white',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s ease-in-out',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#476d8e';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#5a82a8';
                        }}
                    >
                        📷 Choose Photo
                    </label>
                    <input id="file-upload" type="file" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
                </div>

                {/* Image Preview */}
                <div
                    style={{
                        maxWidth: '300px',
                        margin: '0 auto',
                        position: 'relative',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    <div>
                        {file && <PostCard post={{ url: file, IsPopupOpen: true }} />}
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '0%',
                            left: '2px',
                            right: '2px',
                            padding: '6px 12px',
                            zIndex: 10,
                        }}
                    >
                        {file && (
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={location}
                                placeholder="LOCATION"
                                onChange={handleChangeInput}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        )}
                    </div>
                </div>

                <div>
                    {/* Reserved space for future content */}
                </div>
            </div>
        </div>
    );
}

export default Popup;
