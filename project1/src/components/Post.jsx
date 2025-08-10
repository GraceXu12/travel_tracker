//import './Post.css';
function PostCard({post}) {
    let flipped = false

    
    function onClick() {
        flipped = flipped ? false:true
        alert("flipped is " + flipped)

    }
    return <div className="post-entire"> 
        <div className="post-frame" >
            <img 
                src={post.url} 
                alt={post.title} 
                style={{ 
                    width: "200px", 
                    height: "250px", 
                    objectFit: "cover", 
                    marginTop: "10px",
                    border: "15px solid white",   // inner white border 
                     boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)"    
                }} 
                onClick={onClick}
            />
        </div>   
   
        <div className="post-info">
            <h3>{post.title}</h3>
            <p>{post.release_date}</p>
        </div>
        
    </div>
}

export default PostCard