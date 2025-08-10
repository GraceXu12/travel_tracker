
import { useState } from "react";
import PostCard from './Post';

function Popup({onClose, onImageUpload}) {
     // declare state var file with initial value null
     // set file is funct to update state
    const [file, setFile] = useState(null);
      
    function handleChange(e){
        // e is event object that browser passes to even handler function 
        console.log(e.target.files);
        // creates temp URL pointing to the file
        // saves URL in state variable file
        const imageURL = URL.createObjectURL(e.target.files[0]);
        setFile(imageURL);
        //onImageUpload(imageURL);
      }

    function handleClose(){
        if (file) {
            onImageUpload(file)
        }
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
                backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                height: '300px',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                zIndex: 1000
            }}>
                <button onClick={handleClose} 
                    style={{                   
                        marginLeft: 'auto',
                        display: 'block'  
                }}>
                    Close
                </button>
                <div >
                     {file && <PostCard post={{title: "Tim's Film", url:file,release_date:"2024" }}/>}
                </div>
                <div> 
                    <h2>Add Image:</h2>
                    <input type="file" accept="image/*" onChange={handleChange} />
                </div>

            </div>
                
        </div>
    )
}

export default Popup