//import './Post.css';

import { useNavigate } from 'react-router-dom';
//import Page1 from '../Page1';

function PostCard({post}) {
    const navigate = useNavigate();
    console.log("--------------------------",post.IsPopupOpen);



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

          const directNewPage = (photoNum) => {
            navigate(`/Page1/${photoNum}`);
        }
    
    

    let flipped = false


    
    return <div className="post-entire"> 

        <div className="post-frame" onClick={() =>{ if (!post.IsPopupOpen){directNewPage(post.photoNum);}}} >
           
            <div className="flip-card">
                <div className={`flip-card-inner ${!post.IsPopupOpen ? 'flipped' : ''}`}>
                    <div className="flip-card-front">
                        <img 
                            src={post.url} 
                          
                            style={{ 
                                
                                width: "400px", 
                                height: "250px", 
                                objectFit: "cover", 
                                border: "15px solid white",   // inner white border 
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)"    
                            }} 
                        />
                    </div>
                

                    <div className="flip-card-back" 
                        style={{ 
                                
                                width: "400px", 
                                height: "250px", 
                                objectFit: "cover", 
                                border: "15px solid white",   // inner white border 
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)", 
                                borderRadius: "8px",
                            }} 
                    >
                            {!post.IsPopupOpen && 
                                <div className="buttonContainer">
                                    <button  style={{   marginTop: "0px",
                                                        background: "white",
                                                        border: "none",
                                                        borderRadius: "50%",
                                                        padding: 0,
                                                        cursor: "pointer"}}  
                                                        onClick={(e) => { e.stopPropagation(); deletePhotoFromDB()}}> 
                                        <img 
                                            src="https://www.svgrepo.com/show/442475/close-circle.svg"
                                            alt="Close"
                                            style={{ width: "30px", height: "30px" }}/>
                                    </button>
                                </div>}

                        <div className="column">
                            <p>hello</p>
                        </div>
                         <div className="column">
                            <p>hello2</p>
                        </div>

                     

                    </div>
                </div>
            </div>
        </div>  
        
       
   </div>
}



export default PostCard;