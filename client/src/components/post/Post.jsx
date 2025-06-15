// React and related imports
import React, { useContext, useEffect, useRef, useState } from 'react';
import './post.css';
import { MoreVertical } from 'lucide-react'; // Vertical 3-dot icon
import { format } from 'timeago.js'; // Converts date to "x minutes ago" format
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Global auth context
import axios from 'axios'; // For making API requests
import { ToastContainer, toast } from 'react-toastify'; // For showing success/error toasts
import 'react-toastify/dist/ReactToastify.css';
import ConfirmModal from '../confirmModal/confirmModal.jsx'; // Reusable confirmation modal component

export default function Post({ post, user, triggerRefresh }) {
    // console.log("Post component rendered with post:", post);
    const { currentUser } = useContext(AuthContext); // Logged-in user's info

    console.log("user id got in post component:----------------", currentUser.user._id);

    // STATE VARIABLES
    const [like, setLike] = useState(post.likes.length); // Number of likes
    const [isLiked, setIsLiked] = useState(false); // Whether the current user liked the post

    const [isSaved, setIsSaved] = useState(false); // Whether the current user saved the post

    const [commentsOpen, setCommentsOpen] = useState(false); // Toggle comments visibility
    const [menuOpen, setMenuOpen] = useState(false); // Toggle post options menu
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Toggle delete confirmation modal

    const [comments, setComments] = useState([]); // Store fetched comments
    const [newCommentText, setNewCommentText] = useState(''); // Input text for new comment
    const [openCommentMenuId, setOpenCommentMenuId] = useState(null); // Track which comment's menu is open
    const [editCommentText, setEditCommentText] = useState(''); // Text for editing comment
    const [editCommentId, setEditCommentId] = useState(null); // ID of the comment being edited
    const [commentToDelete, setCommentToDelete] = useState(null); // ID of comment to delete

    const [editingPost, setEditingPost] = useState(false); // Toggle post editing mode
    const [editPostDesc, setEditPostDesc] = useState(post.desc || ''); // Text for editing post description     

    // REFS to detect clicks outside of menus
    const menuRef = useRef(null);
    const iconRef = useRef(null);
    const commentMenuRef = useRef(null);

    // STATE to handle long descriptions
    const [readMore, setReadMore] = useState(false);
    const DESCRIPTION_LIMIT = 200;

    // Environment variables
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const backend_url = process.env.BACKEND_URL || 'http://localhost:4000/api';

    // Check if post is already saved by the user
    useEffect(() => {
        setIsSaved(post?.savedBy?.includes(currentUser.user._id));
    }, [post?.savedBy, currentUser.user._id]);

    // Handle like button click
    const likeHandler = async () => {
        try {
            await axios.put(`${backend_url}/posts/like/${post._id}`, {
                userId: currentUser.user._id,
            });
            setLike(isLiked ? like - 1 : like + 1); // Toggle like count
            setIsLiked(!isLiked); // Toggle like state
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    // Handle save post button click
    const handleSave = async () => {
        console.log(`${backend_url}/posts/${post._id}/save`)
        try {
            const saveResult = await axios.put(`${backend_url}/posts/${post._id}/save`, {
                userId: currentUser.user._id,
            });
            console.log("s")
            setIsSaved(!isSaved); // Toggle saved state
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };

    // Submit a new comment
    const handleSubmitComment = async () => {
        if (!newCommentText.trim()) return; // Do not submit empty comments
        try {
            const res = await axios.post(`${backend_url}/comments/${post._id}`, { userId: currentUser.user._id, text: newCommentText, });
            console.log("Comment submitted:", res.data);
            setComments([...comments, res.data]); // Add new comment to state
            setNewCommentText(''); // Clear input
            fetchComments(); // Refresh comments from server
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    useEffect(() => {
        fetchComments(); // Fetch comments when post is loaded
        // console.log("------------------------------------ ")
    }, [])

    // Fetch all comments for the current post
    const fetchComments = async () => {
        try {
            const res = await axios.get(`${backend_url}/comments/${post._id}`);
            // console.log("fetched comments**:", res.data);

            if (res.data.message === "No comments found for this post.") {
                setComments([]); // No comments found, set empty array
                return;
            }
            setComments(res.data.comments); // Set retrieved comments

        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    // Delete a comment by ID
    const handleDeleteComment = async (commentId) => {
        try {
            const res = await axios.delete(`${backend_url}/comments/${commentId}`, { data: { userId: currentUser.user._id }, });
            setComments(comments.filter(comment => comment._id !== commentId)); // Remove from UI
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error("You can delete only your comment.");
        }
    };

    const handleEditComment = async (commentId) => {
        try {
            const res = await axios.put(`${backend_url}/comments/${commentId}`, { userId: currentUser.user._id, text: editCommentText, });

            // Update comment in UI
            setComments(comments.map(comment =>
                comment._id === commentId ? { ...comment, text: editCommentText } : comment
            ));

            // Reset states
            setEditCommentText('');
            setOpenCommentMenuId(null);
            setEditCommentId(null);

            // ✅ Show success toast only
            // toast.success("Comment updated successfully!", {
            //     autoClose: 1000,
            //     closeOnClick: true,
            // });

            await fetchComments();

        } catch (error) {
            console.error("Error editing comment:", error);

            // ❌ Show error toast only
            // toast.error("Failed to update comment!", {
            //     autoClose: 3000,
            //     closeOnClick: true,
            // });
        }
    };

    // Delete a post by ID
    const deletePost = async () => {
        try {
            const res = await axios.delete(`${backend_url}/posts/${post._id}`, { data: { userId: currentUser.user._id }, });
            toast.success(res.data); // Show success message
            setTimeout(() => {
                triggerRefresh(true); // Refresh post list
                setMenuOpen(false); // Close menu
            }, 3000);
        } catch (err) {
            console.error(err);
            toast.error("You can delete only your post.");
            setMenuOpen(false);
        }
    };

    // edit post
    const handleEditPost = async () => {
        try {
            const res = await axios.put(`${backend_url}/posts/${post._id}`, { userId: currentUser.user._id, desc: editPostDesc, });
            alert("Post updated successfully!");
            console.log("Edit post response from backend:", res.data);
            post.desc = editPostDesc; // Update post description in the state

            setEditingPost(false); // Exit edit mode
            setMenuOpen(false); // Close menu
            triggerRefresh(true); // Refresh post list
        } catch (error) {
            console.error("Error editing post:", error);
            alert("Failed to update post. You can edit only your post.");
        }
    };

    // Detect clicks outside menus and close them
    const handleClickOutside = (e) => {
        const isClickOutsidePostMenu =
            menuRef.current &&
            !menuRef.current.contains(e.target) &&
            iconRef.current &&
            !iconRef.current.contains(e.target);

        const isClickOutsideCommentMenu =
            commentMenuRef.current &&
            !commentMenuRef.current.contains(e.target) &&
            iconRef.current &&
            !iconRef.current.contains(e.target);

        if (isClickOutsidePostMenu) {
            setMenuOpen(false); // Close post menu
        }
        if (isClickOutsideCommentMenu) {
            setOpenCommentMenuId(null); // Close comment menu
        }
    };

    // Attach and clean up outside click event
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="post">
            <div className="postWrapper">
                {/* Top Section - User Info */}
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to="/profile" state={{ post }} style={{ textDecoration: 'none' }}>
                            <img
                                className="postProfileImg"
                                src={post?.profilePicture || user?.profilePicture}
                                alt="profile"
                            />
                        </Link>
                        <div className="postInfo">
                            <span className="postUsername">
                                {post?.username || user?.username}
                                <span className="postDate">{format(post?.createdAt)}</span>
                            </span>
                            <span className="postLocation">{post?.locationName}</span>
                        </div>
                    </div>

                    {/* Right side - Save icon and menu */}
                    <div className="postTopRight">
                        <img
                            onClick={handleSave}
                            className="saveIcon"
                            src={PF + (isSaved ? 'saved.png' : 'save.png')}
                            alt="save"
                        />
                        <MoreVertical className="postMoreVert" onClick={() => setMenuOpen(!menuOpen)} ref={iconRef} />
                        {menuOpen && (
                            <div className="postMenu" ref={menuRef}>
                                <div className="postMenuItem" onClick={() => setShowDeleteModal(true)}>Delete</div>
                                <div className='postMenuItem' onClick={() => {
                                    setEditingPost(true);
                                    setEditPostDesc(post.desc);
                                }}>Edit</div>
                                <div className="postMenuItem">Report</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Post Content */}
                <div className="postCenter">
                    {editingPost ? (
                        <div className="editPostBox">
                            <textarea
                                value={editPostDesc}
                                onChange={(e) => setEditPostDesc(e.target.value)}
                                className="editPostInput"
                            />
                            <div className="editActions">
                                <button className="commentBtn" onClick={handleEditPost}>Save</button>
                                <button
                                    className="commentBtn cancel"
                                    onClick={() => {
                                        setEditingPost(false); // Exit edit mode
                                        setEditPostDesc(post.desc || ''); // Reset to original post description
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <span className="postText">
                                {post?.desc?.length > DESCRIPTION_LIMIT ? (
                                    <>
                                        {readMore ? post.desc : `${post.desc.substring(0, DESCRIPTION_LIMIT)}... `}
                                        <span onClick={() => setReadMore(!readMore)} className="readMoreToggle">
                                            {readMore ? 'Show less' : 'Read more'}
                                        </span>
                                    </>
                                ) : (
                                    post?.desc
                                )}
                            </span>

                            {post?.img && <img className="postImg" src={PF + post.img} alt="post" />}

                            {/* Tags */}
                            <div className="postTags">
                                {post?.tags?.map((tag, index) => (
                                    <span key={index} className="tag">#{tag}</span>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Like & Comment Buttons */}
                <div className="postBottom">
                    <div className="postActions">
                        <div className="postActionIcons">
                            <div>
                                <img
                                    onClick={likeHandler}
                                    className="likeIcon"
                                    src={PF + (isLiked ? 'liked1.png' : 'like1.png')}
                                    alt="like"
                                />
                                <span className="postLikeCounter">{like} likes</span>
                            </div>
                            <span
                                className="postCommentText"
                                onClick={() => {
                                    setCommentsOpen(!commentsOpen);
                                    if (!commentsOpen) {
                                        fetchComments();
                                    }
                                }}
                            >
                                {commentsOpen
                                    ? `Hide ${comments.length || 0} comments`
                                    : `View ${comments.length || 0} comments`}
                            </span>

                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                {commentsOpen && (
                    <div className="commentsSectionWrapper">
                        {/* Add new comment box */}
                        <div className="newCommentBox">
                            <textarea
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="commentInput"
                            />
                            <button onClick={handleSubmitComment} className="commentBtn">
                                Post
                            </button>
                        </div>
                        <div className="commentsSection">
                            {comments.map((comment) => (
                                <div key={comment._id} className="comment">
                                    <img className="commentAvatar" src={comment.profilePicture} alt="User" />
                                    <div className="commentContent">
                                        <div className="commentMoreVertContainer">
                                            <MoreVertical
                                                className="postMoreVert"
                                                onClick={() =>
                                                    setOpenCommentMenuId(openCommentMenuId === comment._id ? null : comment._id)
                                                }
                                            />
                                            {openCommentMenuId === comment._id && (
                                                <div className="postMenu" ref={(el) => (commentMenuRef.current = el)}>
                                                    <div className="postMenuItem"
                                                        onClick={() => {
                                                            setCommentToDelete(comment._id);
                                                            setShowDeleteModal(true);
                                                            setOpenCommentMenuId(null); // Close menu
                                                        }}>
                                                        Delete
                                                    </div>
                                                    <div
                                                        className="postMenuItem"
                                                        onClick={() => {
                                                            setEditCommentId(comment._id); // enter edit mode
                                                            setEditCommentText(comment.text); // prefill current comment text
                                                            setOpenCommentMenuId(null); // close the menu
                                                        }}
                                                    >
                                                        Edit
                                                    </div>
                                                    <div className="postMenuItem">Report</div>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            {editCommentId === comment._id ? (
                                                <div className="editCommentBox">
                                                    <textarea
                                                        value={editCommentText}
                                                        onChange={(e) => setEditCommentText(e.target.value)}
                                                        className="commentInput"
                                                    />
                                                    <div className="editActions">
                                                        <button
                                                            className="commentBtn"
                                                            onClick={() => handleEditComment(comment._id)}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            className="commentBtn cancel"
                                                            onClick={() => {
                                                                setEditCommentId(null);
                                                                setEditCommentText('');
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <span className="commentUsername">{comment.username}</span>
                                                    <span className="commentText">{comment.text}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="commentTime">
                                            {new Date(comment.createdAt).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Toast for alerts & Modal for delete confirmation */}
                <ToastContainer position="top-right" autoClose={2000} />
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => { setShowDeleteModal(false); setCommentToDelete(null); }}
                    onConfirm={() => {
                        if (commentToDelete) {
                            handleDeleteComment(commentToDelete); // Delete comment
                            setCommentToDelete(null);
                        }
                        else {
                            deletePost(); // Delete post
                        }
                        setShowDeleteModal(false); // Close modal
                    }}
                    title={commentToDelete ? "Delete Comment" : "Delete Post"}
                    message={commentToDelete ? "Are you sure you want to delete this comment?" : "Are you sure you want to delete this post?"}
                />
            </div>
        </div>
    );
}
