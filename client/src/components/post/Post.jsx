import React, { useContext, useState } from 'react';
import './post.css';
import { MoreVertical } from 'lucide-react';
import { format } from 'timeago.js';
import { data, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmModal from '../confirmModal/confirmModal.jsx'; // adjust path if needed
import { useEffect } from 'react';
import { useRef } from 'react';


export default function Post({ post, user, triggerRefresh }) {

    const { currentUser } = useContext(AuthContext);


    // console.log("user in post component :", currentUser);
    // console.log("user from profile component :", user);

    // const user = Users.find((u) => u.id === post.userId); // fetch user from dummy data
    console.log("post logged in post jsx::", post)
    // console.log("user in post:", user)
    const [like, setLike] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    //added for test

    // for close delete report menu on outside click
    const menuRef = useRef(null);
    const iconRef = useRef(null);


    const [readMore, setReadMore] = useState(false);
    const DESCRIPTION_LIMIT = 200; // number of characters want as limit

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    let backend_url = process.env.BACKEND_URL || "http://localhost:4000/api";


    // if(post?.savedBy(includes(currentUser._id))){
    //     setIsSaved(true)
    // }else{
    //     setIsSaved(false)
    // }

    useEffect(() => {
        if (post?.savedBy?.includes(currentUser._id)) {
            setIsSaved(true);
        } else {
            setIsSaved(false);
        }
    }, [post?.savedBy, currentUser._id]);



    const likeHandler = async (postId) => {
        // console.log("Like handler called for post: ", postId);
        try {
            const res = await axios.put(`${backend_url}/posts/like/${postId}`, {
                userId: currentUser?._id,
            });
            console.log("res from like handler: ", res.data);

            // Toggle like state
            setLike(isLiked ? like - 1 : like + 1);
            setIsLiked(!isLiked);

        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async (postId) => {
        try {
            const res = await axios.put(`${backend_url}/posts/${postId}/save`, {
                userId: currentUser?._id,
            });
            console.log(res.data, "------------")
        } catch (err) {
            console.log(err)

        }
    }

    const deletePost = async (postId, userId) => {
        // console.log("post id and user id", postId, userId)
        try {
            const res = await axios.delete(`${backend_url}/posts/${postId}`, {
                data: { userId } // Axios allows sending data in DELETE with `data` key
            });
            // console.log("toast success::", res.data)
            showToast(res.data, "success");

            console.log(res.data); // Success message

            // Delay the refresh and menu close
            setTimeout(() => {
                triggerRefresh(true);
                setMenuOpen(false);
            }, 3000); // 3 seconds delay

        } catch (err) {
            console.error(err.response?.data || err.message);
            showToast("You can delete only your Post", "error");
            setMenuOpen(false);
        }
    };

    // const handleDelete = () => {
    //     if (window.confirm("Are you sure you want to delete this post?")) {
    //         deletePost(post._id, currentUser._id);
    //     }
    // };
    const handleDelete = () => {
        setShowDeleteModal(true); // open modal
    };

    const confirmDelete = () => {
        deletePost(post._id, currentUser._id);
        setShowDeleteModal(false);
    };



    const showToast = (message, type = "success") => {
        switch (type) {
            case "success":
                toast.success(message);
                break;
            case "warning":
                toast.warning(message);
                break;
            case "error":
                toast.error(message);
                break;
            default:
                toast.info(message);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                iconRef.current &&
                !iconRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to="/profile" state={{ post }} style={{ textDecoration: "none" }}>
                            <img className="postProfileImg" src={post?.profilePicture ? post.profilePicture : user.profilePicture} alt="profile" />
                        </Link>
                        <div className="postInfo">
                            <span className="postUsername">{post?.username ? post.username : user.username}<span className="postDate">{format(post?.createdAt)}</span></span>
                            <span className="postLocation">{post?.locationName}</span>
                        </div>
                    </div>

                    <div className="postTopRight">
                        <img
                            onClick={() => (setIsSaved(!isSaved), handleSave(post?._id))}
                            className="saveIcon"
                            src={PF + (isSaved ? "saved.png" : "save.png")}
                            alt={isSaved ? "saved" : "save"}
                        />
                        <MoreVertical className="postMoreVert" onClick={() => setMenuOpen(!menuOpen)} ref={iconRef} />
                        {menuOpen && (
                            <div className="postMenu" ref={menuRef}>
                                <div className="postMenuItem" onClick={handleDelete}>Delete</div>
                                <div className="postMenuItem">Report</div>
                            </div>
                        )}

                    </div>
                </div>

                <div className="postCenter">
                    <span className="postText">
                        {post?.desc?.length > DESCRIPTION_LIMIT ? (
                            <>
                                {readMore ? post.desc : post.desc.substring(0, DESCRIPTION_LIMIT) + '... '}
                                <span onClick={() => setReadMore(!readMore)} style={{ color: 'gray', cursor: 'pointer' }}>
                                    {readMore ? 'Show less' : 'Read more'}
                                </span>
                            </>
                        ) : (
                            post.desc
                        )}
                    </span>

                    <img className="postImg" src={PF + post.img} alt="post" />
                    <div className="postTags">
                        {post.tags?.map((tag, index) => (
                            <span key={index} className="tag">#{tag}</span>
                        ))}
                    </div>
                </div>

                <div className="postBottom">
                    <div className="postActions">
                        <div className="postActionIcons">
                            <div>
                                <img
                                    onClick={() => likeHandler(post?._id)}
                                    className="likeIcon"
                                    src={PF + (isLiked ? "liked1.png" : "like1.png")}
                                    alt={isLiked ? "liked" : "like"}
                                />
                                <span className="postLikeCounter">{like} likes</span>
                            </div>

                            <span
                                className="postCommentText"
                                onClick={() => setCommentsOpen(!commentsOpen)}
                            >
                                View {post.comment || " "} comments
                            </span>
                        </div>
                    </div>

                </div>


                {commentsOpen && (
                    <div className="commentsSection">
                        {/* Comment 1 */}
                        <div className="comment">
                            <img className="commentAvatar" src={PF + "userIcon.png"} alt="User1" />
                            <div className="commentContent">
                                <div>
                                    <span className="commentUsername">User1</span>
                                    <span className="commentText">Amazing shot 🔥</span>
                                </div>
                                <div className="commentTime">2h ago</div>

                                {/* Reply to Comment 1 */}
                                <div className="reply">
                                    <div className="comment">
                                        <img className="commentAvatar" src={PF + "userIcon.png"} alt="User2" />
                                        <div className="commentContent">
                                            <div>
                                                <span className="commentUsername">User2</span>
                                                <span className="commentText">Totally agree! 😍</span>
                                            </div>
                                            <div className="commentTime">1h ago</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comment 2 */}
                        <div className="comment">
                            <img className="commentAvatar" src={PF + "userIcon.png"} alt="User3" />
                            <div className="commentContent">
                                <div>
                                    <span className="commentUsername">User3</span>
                                    <span className="commentText">This place looks awesome!</span>
                                </div>
                                <div className="commentTime">3h ago</div>
                            </div>
                        </div>
                    </div>

                )}
            </div>

            {/* React Toastify Container */}
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
            />

        </div>


    );
}






// import React, { useContext, useState } from 'react';
// import './post.css';
// import { MoreVertical } from 'lucide-react';
// import { format } from 'timeago.js';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';

// import { Heart } from 'lucide-react';

// export default function Post({ post, user }) {

//     const { currentUser } = useContext(AuthContext);


//     console.log("user in post component :", currentUser);
//     console.log("user from profile component :", user);

//     // const user = Users.find((u) => u.id === post.userId); // fetch user from dummy data
//     console.log("post logged in post jsx::", post)
//     // console.log("user in post:", user)
//     const [like, setLike] = useState(post.likes.length);
//     const [isLiked, setIsLiked] = useState(false);
//     const [isSaved, setIsSaved] = useState(false);
//     const [commentsOpen, setCommentsOpen] = useState(false);
//     const [menuOpen, setMenuOpen] = useState(false);

//     const [readMore, setReadMore] = useState(false);
//     const DESCRIPTION_LIMIT = 200; // number of characters want as limit


//     const PF = process.env.REACT_APP_PUBLIC_FOLDER;


//     const likeHandler = () => {
//         setLike(isLiked ? like - 1 : like + 1);
//         setIsLiked(!isLiked);
//     }

//     return (
//         <div className="post">
//             <div className="postWrapper">
//                 <div className="postTop">
//                     <div className="postTopLeft">
//                         <Link to="/profile" state={{ post }} style={{ textDecoration: "none" }}>
//                             <img className="postProfileImg"
//                                 src={post?.profilePicture ? post.profilePicture : user.profilePicture}
//                                 alt="profile" />
//                         </Link>
//                         <span className="postUsername">{post?.username ? post.username : user.username}</span>
//                         <span className="postDate">{format(post.createdAt)}</span>

//                     </div>
//                     <div className="postTopRight">
//                         <MoreVertical className="postMoreVert" onClick={() => setMenuOpen(!menuOpen)} />
//                         {menuOpen && (
//                             <div className="postMenu">
//                                 <div className="postMenuItem" onClick={() => setIsSaved(!isSaved)}>
//                                     {isSaved ? "Unsave" : "Save"}
//                                 </div>
//                                 <div className="postMenuItem">Report</div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//                 <div className="postCenter">
//                     {/* <span className="postText">{post?.desc}</span> */}
//                     <span className="postText">
//                         {post?.desc?.length > DESCRIPTION_LIMIT ? (
//                             <>
//                                 {readMore ? post.desc : post.desc.substring(0, DESCRIPTION_LIMIT) + '... '}
//                                 <span
//                                     onClick={() => setReadMore(!readMore)}
//                                     style={{ color: 'gray', cursor: 'pointer' }}
//                                 >
//                                     {readMore ? 'Show less' : 'Read more'}
//                                 </span>
//                             </>
//                         ) : (
//                             post.desc
//                         )}
//                     </span>

//                     <img className="postImg" src={PF + post.img} alt="post" />
//                 </div>
//                 <div className="postBottom">
//                     <div className="postBottomLeft">
//                         <img onClick={likeHandler} className='likeIcon' src={PF + "like.png"} alt="like" />
//                         <img onClick={likeHandler} className='likeIcon' src={PF + "heart.png"} alt="heart" />
//                         {/* <img className='likeIcon' src={PF + "dislike.png"} alt="dislike" /> */}
//                         <span className="postLikeCounter">{like} people like it</span>
//                     </div>
//                     <div className="postBottomRight">
//                         <span className="postCommentText" onClick={() => setCommentsOpen(!commentsOpen)}>
//                             {post.comment} comments
//                         </span>
//                     </div>
//                 </div>
//                 {commentsOpen && (
//                     <div className="commentsSection">
//                         <div className="comment">
//                             <span className="commentUsername">User1:</span>
//                             <span className="commentText">Great post!</span>
//                             <span className="replyText">Reply</span>
//                         </div>
//                         <div className="comment">
//                             <span className="commentUsername">User2:</span>
//                             <span className="commentText">Nice picture</span>
//                             <span className="replyText">Reply</span>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>

//     );
// }