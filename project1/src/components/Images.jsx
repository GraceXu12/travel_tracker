//import './Post.css';
import './Images.css'
import { useNavigate } from 'react-router-dom';
//import Page1 from '../Page1';

function Images({post}) {
    const navigate = useNavigate();
   


        const deletePhotoFromDB = () => {
            fetch("http://localhost:5000/deletephoto", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json", // without this it doesnt parse res.body as JSON so backend req.body is empty
                },
                body: JSON.stringify({ id: post.url, page: post.page, number: post.photoNum})

            })
            .then(res => { // when request done, run this function ( res => {...}) res stores result of fetch
            console.log("Response status:", res.status);
            if (!res.ok) {
              throw new Error('Failed to delete');
            }
            return res.json();
            })
            // return message of server side first
            // then refresh page
            .then(data => {
                window.location.reload();
            })
    
        }

        


    
    return <div > 

        <div  >
           
            <div >
                <div >
                    <div className="ImageContainer">
                        <img src={post.url}  />
                        <button  style={{  marginTop: "0px",
                                            background: "white",
                                            border: "none",
                                            borderRadius: "50%",
                                            padding: 0,
                                            cursor: "pointer"}} 
                            onClick={deletePhotoFromDB}>
                            <img 
                                src="https://www.svgrepo.com/show/442475/close-circle.svg"
                                alt="Close"
                                sstyle={{ 
  width: "30px", 
  height: "30px", 
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)" 
}}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>  
        

   </div>
}

export default Images;