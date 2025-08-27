//import './Post.css';

import { useNavigate } from 'react-router-dom';
//import Page1 from '../Page1';

function PostCard({ post, className }) {
    const navigate = useNavigate();
    console.log("--------------------------", post.IsPopupOpen);

    const deletePhotoFromDB = () => {
        fetch("http://localhost:5000/deletephoto", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json", // without this it doesnt parse res.body as JSON so backend req.body is empty
            },
            body: JSON.stringify({ id: post.url, page: post.page, number: post.photoNum })
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
            });
    };

    const directNewPage = (photoNum) => {
        navigate(`/Page1/${photoNum}`, {
            state: { location: post.location }
        });
    };

    let flipped = false;

    return (
        <div className="post-entire">
            <div
                className="post-frame"
                onClick={() => {
                    if (!post.IsPopupOpen) {
                        directNewPage(post.photoNum);
                    }
                }}
            >
                <div className="flip-card">
                    <div className="flip-card-front">
                        <img
                            className={`${className}`}
                            src={post.url}
                        />
                        <h3 className="location-text">
                            {!post.IsPopupOpen && '📍'}{post.location}
                        </h3>
                    </div>

                    {!post.IsPopupOpen &&
                        <div className="buttonContainer">
                            <button
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '10px',
                                    width: '30px',
                                    height: '30px',
                                    backgroundColor: 'transparent',
                                    border: '2px solid white',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0,
                                    lineHeight: 1,
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deletePhotoFromDB();
                                }}
                                aria-label="Close"
                            >
                                X
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default PostCard;
