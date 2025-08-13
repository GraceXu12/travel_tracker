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


    
    function onClick() {
        

    }
    return <div className="post-entire"> 
        <div className="post-frame" >
            <img 
                src={post.url} 
               
                style={{ 
                    width: "300px", 
                    height: "200px", 
                    objectFit: "cover", 
                    marginTop: "10px",
                    border: "15px solid white",   // inner white border 
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)"    
                }} 
                onClick={onClick}
            />
        </div>  
        
        {!post.IsPopupOpen &&<button onClick={deletePhotoFromDB}>Delete</button>}
   
    
        
    </div>
}

export default PostCard