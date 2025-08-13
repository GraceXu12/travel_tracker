//import './Post.css';

function PostCard({post}) {

    console.log("--------------------------",post.IsPopupOpen);



        const deletePhotoFromDB = () => {
            fetch("http://localhost:5000/deletephoto", {
                method: "Delete",
                headers: {
                    "Content-Type": "application/json", // without this it doesnt parse res.body as JSON so backend req.body is empty
                },
                body: JSON.stringify({ id: post.url})

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
    
    

    let flipped = false


    
    return <div className="post-entire"> 
        <div className="post-frame" >
            <div className="flip-card">
                <div className="flip-card-inner" style={{ cursor: !post.IsPopupOpen ? 'pointer' : 'default' }}>
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
        
        {!post.IsPopupOpen &&<button  style={{ marginTop: "50px" }} onClick={deletePhotoFromDB}>Delete</button>}
   </div>
}

export default PostCard