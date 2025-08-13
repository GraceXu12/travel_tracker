
import { useState } from "react";
import PostCard from './Post';

function Popup({onClose}) {
     // declare state var file with initial value null
     // set file is funct to update state
    const [file, setFile] = useState(null);
    const [uploadedImageURL, setUploadedImageURL] = useState(null);
    const [isUploading, setIsUploading] = useState(true); // disabling closing popup button (save) if upload not ready

    let uploadPromise= null;


    async function uploadPic(obj){
       
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
        const res = await fetch(" https://api.cloudinary.com/v1_1/dmoiuke2e/image/upload",{
            method:"POST" ,
            body: data
        })
        // waits for cloudinary's response and converts it from json to js object
        // contains info about uploaded image including url
        const json = await res.json()
        //console.log("hello")
        //console.log(json.url)
        setUploadedImageURL(json.url)
        
        // send url to MangoDb through backend
        await fetch("http://localhost:5000/save-photo", { // adjust port if needed
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: json.url })
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
        await uploadPic(file);
        //await uploadPromise;

    }

    // uploaded image appears in main page once popup closed
    async function handleClose(){
        console.log("in handle close")
        // if upload still loading wait for it to finish
       
        //if (uploadPromise){
        //    console.log("------------------------")
        //    await uploadPromise;
        //}
        console.log("111hahahahaahhaah");
       
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
                
                overflowY: "auto"  // enable vertical scroll is content overflow
         
                
            }}>
                <button onClick={handleClose} 
                    disabled={isUploading} 
                    style={{                   
                        marginLeft: 'auto',
                        display: 'block'  
                }}>
                    Close
                </button>
                 <div> 
                    <h2>Add Image:</h2>
                    <input type="file" accept="image/*" onChange={handleChange} />
                </div>
                <div >
                     {file && <PostCard post={{ url:file,IsPopupOpen: true}}/>}
                </div>
               

            </div>
                
        </div>
    )
}

export default Popup