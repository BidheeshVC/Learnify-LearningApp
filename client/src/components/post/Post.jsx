import React, {
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback,
    useMemo
} from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import { format } from 'timeago.js';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

// Context
import { AuthContext } from '../../context/AuthContext';

// Components
import ConfirmModal from '../confirmModal/confirmModal.jsx';

// Styles
import './post.css';
import 'react-toastify/dist/ReactToastify.css';

// ==================== CONSTANTS ====================
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000/api';
const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
const DESCRIPTION_LIMIT = 200;
const DEFAULT_PROFILE_IMAGE = `${PUBLIC_FOLDER}person/noCover.png`;

// ==================== TYPES & INTERFACES ====================
/**
 * Post Component Props
 * @typedef {Object} PostProps
 * @property {Object} post - The post data object
 * @property {Object} user - User data for the post author
 * @property {Function} triggerRefresh - Function to trigger parent component refresh
 */

/**
 * Post Component - Displays individual social media post with interactions
 * Features: Like, Save, Comment, Edit, Delete functionality
 * 
 * @param {PostProps} props - Component props
 * @returns {JSX.Element} Post component
 */
export default function Post({ post, user, triggerRefresh }) {
    // ==================== HOOKS & CONTEXT ====================
    const { currentUser } = useContext(AuthContext);

    // Refs for handling outside clicks
    const menuRef = useRef(null);
    const iconRef = useRef(null);
    const commentMenuRef = useRef(null);

    console.log('Post component rendered with post:', post);
    console.log('Current user ID:', currentUser?.user?._id);

    // ==================== STATE MANAGEMENT ====================
    // Post interaction states
    const [like, setLike] = useState(post?.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [readMore, setReadMore] = useState(false);

    // UI control states
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingPost, setEditingPost] = useState(false);

    // Comment-related states
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [openCommentMenuId, setOpenCommentMenuId] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [editCommentId, setEditCommentId] = useState(null);
    const [commentToDelete, setCommentToDelete] = useState(null);

    // Post editing states
    const [editPostDesc, setEditPostDesc] = useState(post?.desc || '');

    // ==================== COMPUTED VALUES ====================
    /**
     * Determines the correct profile image to display
     * Priority: post.profilePicture > user.profilePicture > currentUser.profilePicture > default
     */
    const profileImageUrl = useMemo(() => {
        if (post?.profilePicture) return post.profilePicture;
        if (user?.profilePicture) return user.profilePicture;
        if (currentUser?.user?.profilePicture) return `${PUBLIC_FOLDER}${currentUser.user.profilePicture}`;
        return DEFAULT_PROFILE_IMAGE;
    }, [post?.profilePicture, user?.profilePicture, currentUser?.user?.profilePicture]);

    /**
     * Gets the display username for the post
     */
    const displayUsername = useMemo(() => {
        return post?.username || user?.username || 'Unknown User';
    }, [post?.username, user?.username]);

    /**
     * Checks if current user is the post owner
     */
    const isPostOwner = useMemo(() => {
        return currentUser?.user?._id === post?.userId;
    }, [currentUser?.user?._id, post?.userId]);

    /**
     * Formats the post description with read more functionality
     */
    const formattedDescription = useMemo(() => {
        if (!post?.desc) return '';

        if (post.desc.length <= DESCRIPTION_LIMIT) {
            return post.desc;
        }

        return readMore
            ? post.desc
            : `${post.desc.substring(0, DESCRIPTION_LIMIT)}...`;
    }, [post?.desc, readMore]);

    // ==================== API FUNCTIONS ====================
    /**
     * Fetches comments for the current post
     */
    const fetchComments = useCallback(async () => {
        if (!post?._id) return;

        try {
            const response = await axios.get(`${BACKEND_URL}/comments/${post._id}`);

            if (response.data.message === "No comments found for this post.") {
                setComments([]);
                return;
            }

            setComments(response.data.comments || []);
            console.log('Comments fetched successfully:', response.data.comments?.length || 0);

        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Failed to load comments');
        }
    }, [post?._id]);

    /**
     * Handles like/unlike functionality
     */
    const handleLike = useCallback(async () => {
        if (!currentUser?.user?._id || !post?._id) {
            toast.error('Authentication required');
            return;
        }

        try {
            await axios.put(`${BACKEND_URL}/posts/like/${post._id}`, {
                userId: currentUser.user._id,
            });

            // Optimistic UI update
            setLike(prevLike => isLiked ? prevLike - 1 : prevLike + 1);
            setIsLiked(prevLiked => !prevLiked);

        } catch (error) {
            console.error('Error liking post:', error);
            toast.error('Failed to update like status');

            // Revert optimistic update on error
            setLike(prevLike => isLiked ? prevLike + 1 : prevLike - 1);
            setIsLiked(prevLiked => !prevLiked);
        }
    }, [currentUser?.user?._id, post?._id, isLiked]);

    /**
     * Handles save/unsave post functionality
     */
    const handleSavePost = useCallback(async () => {
        if (!currentUser?.user?._id || !post?._id) {
            toast.error('Authentication required');
            return;
        }

        try {
            await axios.put(`${BACKEND_URL}/posts/${post._id}/save`, {
                userId: currentUser.user._id,
            });

            // Optimistic UI update
            setIsSaved(prevSaved => !prevSaved);
            //   toast.success(isSaved ? 'Post unsaved' : 'Post saved');

        } catch (error) {
            console.error('Error saving post:', error);
            toast.error('Failed to update save status');

            // Revert optimistic update on error
            setIsSaved(prevSaved => !prevSaved);
        }
    }, [currentUser?.user?._id, post?._id, isSaved]);

    /**
     * Submits a new comment
     */
    const handleSubmitComment = useCallback(async () => {
        const trimmedComment = newCommentText.trim();

        if (!trimmedComment) {
            toast.warn('Comment cannot be empty');
            return;
        }

        if (!currentUser?.user?._id || !post?._id) {
            toast.error('Authentication required');
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/comments/${post._id}`, {
                userId: currentUser.user._id,
                text: trimmedComment,
            });

            console.log('Comment submitted successfully:', response.data);

            // Add new comment to local state
            setComments(prevComments => [...prevComments, response.data]);
            setNewCommentText('');

            // Refresh comments to ensure consistency
            await fetchComments();

        } catch (error) {
            console.error('Error submitting comment:', error);
            toast.error('Failed to post comment');
        }
    }, [newCommentText, currentUser?.user?._id, post?._id, fetchComments]);

    /**
     * Deletes a comment by ID
     */
    const handleDeleteComment = useCallback(async (commentId) => {
        if (!currentUser?.user?._id) {
            toast.error('Authentication required');
            return;
        }

        try {
            await axios.delete(`${BACKEND_URL}/comments/${commentId}`, {
                data: { userId: currentUser.user._id },
            });

            // Remove comment from local state
            setComments(prevComments =>
                prevComments.filter(comment => comment._id !== commentId)
            );

            toast.success('Comment deleted successfully');

        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment. You can only delete your own comments.');
        }
    }, [currentUser?.user?._id]);

    /**
     * Handles comment editing
     */
    const handleEditComment = useCallback(async (commentId) => {
        const trimmedText = editCommentText.trim();

        if (!trimmedText) {
            toast.warn('Comment cannot be empty');
            return;
        }

        if (!currentUser?.user?._id) {
            toast.error('Authentication required');
            return;
        }

        try {
            await axios.put(`${BACKEND_URL}/comments/${commentId}`, {
                userId: currentUser.user._id,
                text: trimmedText,
            });

            // Update comment in local state
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment._id === commentId
                        ? { ...comment, text: trimmedText }
                        : comment
                )
            );

            // Reset editing state
            setEditCommentText('');
            setOpenCommentMenuId(null);
            setEditCommentId(null);

            // Refresh comments for consistency
            await fetchComments();

        } catch (error) {
            console.error('Error editing comment:', error);
            toast.error('Failed to update comment. You can only edit your own comments.');
        }
    }, [editCommentText, currentUser?.user?._id, fetchComments]);

    /**
     * Deletes the post
     */
    const handleDeletePost = useCallback(async () => {
        if (!currentUser?.user?._id || !post?._id) {
            toast.error('Authentication required');
            return;
        }

        try {
            const response = await axios.delete(`${BACKEND_URL}/posts/${post._id}`, {
                data: { userId: currentUser.user._id },
            });

            toast.success(response.data || 'Post deleted successfully');

            // Delay refresh to show toast message
            setTimeout(() => {
                if (triggerRefresh) {
                    triggerRefresh(true);
                }
                setMenuOpen(false);
            }, 2000);

        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Failed to delete post. You can only delete your own posts.');
            setMenuOpen(false);
        }
    }, [currentUser?.user?._id, post?._id, triggerRefresh]);

    /**
     * Handles post editing
     */
    const handleEditPost = useCallback(async () => {
        const trimmedDesc = editPostDesc.trim();

        if (!currentUser?.user?._id || !post?._id) {
            toast.error('Authentication required');
            return;
        }

        try {
            const response = await axios.put(`${BACKEND_URL}/posts/${post._id}`, {
                userId: currentUser.user._id,
                desc: trimmedDesc,
            });

            console.log('Post updated successfully:', response.data);

            // Update local post description
            post.desc = trimmedDesc;

            setEditingPost(false);
            setMenuOpen(false);

            toast.success('Post updated successfully');

            // Trigger parent refresh
            if (triggerRefresh) {
                triggerRefresh(true);
            }

        } catch (error) {
            console.error('Error editing post:', error);
            toast.error('Failed to update post. You can only edit your own posts.');
        }
    }, [editPostDesc, currentUser?.user?._id, post?._id, triggerRefresh]);

    // ==================== EVENT HANDLERS ====================
    /**
     * Handles clicks outside of menus to close them
     */
    const handleClickOutside = useCallback((event) => {
        const isClickOutsidePostMenu =
            menuRef.current &&
            !menuRef.current.contains(event.target) &&
            iconRef.current &&
            !iconRef.current.contains(event.target);

        const isClickOutsideCommentMenu =
            commentMenuRef.current &&
            !commentMenuRef.current.contains(event.target);

        if (isClickOutsidePostMenu) {
            setMenuOpen(false);
        }

        if (isClickOutsideCommentMenu) {
            setOpenCommentMenuId(null);
        }
    }, []);

    /**
     * Toggles comments section visibility
     */
    const handleToggleComments = useCallback(() => {
        setCommentsOpen(prevOpen => {
            const newOpen = !prevOpen;

            // Fetch comments when opening
            if (newOpen) {
                fetchComments();
            }

            return newOpen;
        });
    }, [fetchComments]);

    /**
     * Handles read more/less toggle
     */
    const handleToggleReadMore = useCallback(() => {
        setReadMore(prevReadMore => !prevReadMore);
    }, []);

    /**
     * Handles opening edit post mode
     */
    const handleOpenEditPost = useCallback(() => {
        setEditingPost(true);
        setEditPostDesc(post?.desc || '');
        setMenuOpen(false);
    }, [post?.desc]);

    /**
     * Handles canceling post edit
     */
    const handleCancelEditPost = useCallback(() => {
        setEditingPost(false);
        setEditPostDesc(post?.desc || '');
    }, [post?.desc]);

    /**
     * Handles opening edit comment mode
     */
    const handleOpenEditComment = useCallback((commentId, currentText) => {
        setEditCommentId(commentId);
        setEditCommentText(currentText);
        setOpenCommentMenuId(null);
    }, []);

    /**
     * Handles canceling comment edit
     */
    const handleCancelEditComment = useCallback(() => {
        setEditCommentId(null);
        setEditCommentText('');
    }, []);

    /**
     * Handles opening delete confirmation modal
     */
    const handleOpenDeleteModal = useCallback((commentId = null) => {
        setCommentToDelete(commentId);
        setShowDeleteModal(true);
        setOpenCommentMenuId(null);
    }, []);

    /**
     * Handles closing delete confirmation modal
     */
    const handleCloseDeleteModal = useCallback(() => {
        setShowDeleteModal(false);
        setCommentToDelete(null);
    }, []);

    /**
     * Handles delete confirmation
     */
    const handleConfirmDelete = useCallback(() => {
        if (commentToDelete) {
            handleDeleteComment(commentToDelete);
            setCommentToDelete(null);
        } else {
            handleDeletePost();
        }
        setShowDeleteModal(false);
    }, [commentToDelete, handleDeleteComment, handleDeletePost]);

    // ==================== EFFECTS ====================
    /**
     * Initialize component data on mount
     */
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    /**
     * Update saved state when post data changes
     */
      useEffect(() => {
        const saved = post?.savedBy?.includes(currentUser?.user?._id);
        if (isSaved !== saved) {
          setIsSaved(saved);
        }
      }, [post?.savedBy, currentUser?.user?._id,]);
    // useEffect(() => {
    //     setIsSaved(post?.savedBy?.includes(currentUser?.user?._id) || false);
    // }, [post?._id, currentUser?.user?._id]);


    /**
     * Update liked state when post data changes
     */
    useEffect(() => {
        const liked = post?.likes?.includes(currentUser?.user?._id);
        if (isLiked !== liked) {
            setIsLiked(liked);
        }
    }, [post?.likes, currentUser?.user?._id,]);

    // useEffect(() => {
    //     const liked = post?.likes?.includes(currentUser?.user?._id);
    //     setIsLiked(liked);
    // }, [post?.likes, currentUser?.user?._id]);


    /**
     * Attach and cleanup outside click event listener
     */
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    // ==================== RENDER HELPERS ====================
    /**
     * Renders the post header with user info and actions
     */
    const renderPostHeader = () => (
        <div className="postTop">
            <div className="postTopLeft">
                <Link
                    to="/profile"
                    state={{ userId: post?.userId }}
                    style={{ textDecoration: 'none' }}
                >
                    <img
                        className="postProfileImg"
                        src={profileImageUrl}
                        alt="Profile"
                        onError={(e) => {
                            e.target.src = DEFAULT_PROFILE_IMAGE;
                        }}
                    />
                </Link>
                <div className="postInfo">
                    <span className="postUsername">
                        {displayUsername}
                        <span className="postDate">
                            {post?.createdAt && format(post.createdAt)}
                        </span>
                    </span>
                    {post?.locationName && (
                        <span className="postLocation">{post.locationName}</span>
                    )}
                </div>
            </div>

            <div className="postTopRight">
                <img
                    onClick={handleSavePost}
                    className="saveIcon"
                    src={`${PUBLIC_FOLDER}${isSaved ? 'saved.png' : 'save.png'}`}
                    alt="Save"
                />
                <MoreVertical
                    className="postMoreVert"
                    onClick={() => setMenuOpen(!menuOpen)}
                    ref={iconRef}
                />
                {menuOpen && (
                    <div className="postMenu" ref={menuRef}>
                        <div className="postMenuItem" onClick={() => handleOpenDeleteModal()}>
                            Delete
                        </div>
                        <div className="postMenuItem" onClick={handleOpenEditPost}>
                            Edit
                        </div>
                        <div className="postMenuItem">Report</div>
                    </div>
                )}
            </div>
        </div>
    );

    /**
     * Renders the post content (text, image, tags)
     */
    const renderPostContent = () => (
        <div className="postCenter">
            {editingPost ? (
                <div className="editPostBox">
                    <textarea
                        value={editPostDesc}
                        onChange={(e) => setEditPostDesc(e.target.value)}
                        className="editPostInput"
                        placeholder="Edit your post..."
                    />
                    <div className="editActions">
                        <button className="commentBtn" onClick={handleEditPost}>
                            Save
                        </button>
                        <button className="commentBtn cancel" onClick={handleCancelEditPost}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {post?.desc && (
                        <span className="postText">
                            {formattedDescription}
                            {post.desc.length > DESCRIPTION_LIMIT && (
                                <span
                                    onClick={handleToggleReadMore}
                                    className="readMoreToggle"
                                >
                                    {readMore ? ' Show less' : ' Read more'}
                                </span>
                            )}
                        </span>
                    )}

                    {post?.img && (
                        <img
                            className="postImg"
                            src={`${PUBLIC_FOLDER}${post.img}`}
                            alt="Post content"
                        />
                    )}

                    {post?.tags && post.tags.length > 0 && (
                        <div className="postTags">
                            {post.tags.map((tag, index) => (
                                <span key={index} className="tag">#{tag}</span>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );

    /**
     * Renders the post actions (like, comment buttons)
     */
    const renderPostActions = () => (
        <div className="postBottom">
            <div className="postActions">
                <div className="postActionIcons">
                    <div>
                        <img
                            onClick={handleLike}
                            className="likeIcon"
                            src={`${PUBLIC_FOLDER}${isLiked ? 'liked1.png' : 'like1.png'}`}
                            alt="Like"
                        />
                        <span className="postLikeCounter">{like} likes</span>
                    </div>
                    <span className="postCommentText" onClick={handleToggleComments}>
                        {commentsOpen
                            ? `Hide ${comments.length || 0} comments`
                            : `View ${comments.length || 0} comments`}
                    </span>
                </div>
            </div>
        </div>
    );

    /**
     * Renders individual comment
     */
    const renderComment = (comment) => (
        <div key={comment._id} className="comment">
            <img
                className="commentAvatar"
                src={comment.profilePicture || DEFAULT_PROFILE_IMAGE}
                alt="Commenter"
            />
            <div className="commentContent">
                <div className="commentMoreVertContainer">
                    <MoreVertical
                        className="postMoreVert"
                        onClick={() =>
                            setOpenCommentMenuId(
                                openCommentMenuId === comment._id ? null : comment._id
                            )
                        }
                    />
                    {openCommentMenuId === comment._id && (
                        <div className="postMenu" ref={commentMenuRef}>
                            <div
                                className="postMenuItem"
                                onClick={() => handleOpenDeleteModal(comment._id)}
                            >
                                Delete
                            </div>
                            <div
                                className="postMenuItem"
                                onClick={() => handleOpenEditComment(comment._id, comment.text)}
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
                                placeholder="Edit your comment..."
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
                                    onClick={handleCancelEditComment}
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

                {comment.createdAt && (
                    <div className="commentTime">
                        {new Date(comment.createdAt).toLocaleTimeString()}
                    </div>
                )}
            </div>
        </div>
    );

    /**
     * Renders the comments section
     */
    const renderCommentsSection = () => (
        <div className="commentsSectionWrapper">
            {/* New comment input */}
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

            {/* Comments list */}
            <div className="commentsSection">
                {comments.map(renderComment)}
            </div>
        </div>
    );

    // ==================== EARLY RETURNS ====================
    if (!post) {
        console.warn('Post component received null/undefined post');
        return null;
    }

    if (!currentUser) {
        console.warn('Post component requires authenticated user');
        return (
            <div className="post-error">
                <p>Please log in to view posts</p>
            </div>
        );
    }

    // ==================== MAIN RENDER ====================
    return (
        <div className="post">
            <div className="postWrapper">
                {/* Post Header */}
                {renderPostHeader()}

                {/* Post Content */}
                {renderPostContent()}

                {/* Post Actions */}
                {renderPostActions()}

                {/* Comments Section */}
                {commentsOpen && renderCommentsSection()}

                {/* Toast Container */}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleConfirmDelete}
                    title={commentToDelete ? "Delete Comment" : "Delete Post"}
                    message={
                        commentToDelete
                            ? "Are you sure you want to delete this comment?"
                            : "Are you sure you want to delete this post?"
                    }
                />
            </div>
        </div>
    );
}














































// // React and related imports
// import React, { useContext, useEffect, useRef, useState } from 'react';
// import './post.css';
// import { MoreVertical } from 'lucide-react'; // Vertical 3-dot icon
// import { format } from 'timeago.js'; // Converts date to "x minutes ago" format
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext'; // Global auth context
// import axios from 'axios'; // For making API requests
// import { ToastContainer, toast } from 'react-toastify'; // For showing success/error toasts
// import 'react-toastify/dist/ReactToastify.css';
// import ConfirmModal from '../confirmModal/confirmModal.jsx'; // Reusable confirmation modal component

// export default function Post({ post, user, triggerRefresh }) {
//     console.log("Post component rendered with post:", post);
//     const { currentUser } = useContext(AuthContext); // Logged-in user's info

//     console.log("user id got in post component:----------------", currentUser.user?._id);
//     console.log("Post component currentUser:", currentUser);

//     // STATE VARIABLES
//     const [like, setLike] = useState(post.likes.length); // Number of likes
//     const [isLiked, setIsLiked] = useState(false); // Whether the current user liked the post

//     const [isSaved, setIsSaved] = useState(false); // Whether the current user saved the post

//     const [commentsOpen, setCommentsOpen] = useState(false); // Toggle comments visibility
//     const [menuOpen, setMenuOpen] = useState(false); // Toggle post options menu
//     const [showDeleteModal, setShowDeleteModal] = useState(false); // Toggle delete confirmation modal

//     const [comments, setComments] = useState([]); // Store fetched comments
//     const [newCommentText, setNewCommentText] = useState(''); // Input text for new comment
//     const [openCommentMenuId, setOpenCommentMenuId] = useState(null); // Track which comment's menu is open
//     const [editCommentText, setEditCommentText] = useState(''); // Text for editing comment
//     const [editCommentId, setEditCommentId] = useState(null); // ID of the comment being edited
//     const [commentToDelete, setCommentToDelete] = useState(null); // ID of comment to delete

//     const [editingPost, setEditingPost] = useState(false); // Toggle post editing mode
//     const [editPostDesc, setEditPostDesc] = useState(post.desc || ''); // Text for editing post description

//     // REFS to detect clicks outside of menus
//     const menuRef = useRef(null);
//     const iconRef = useRef(null);
//     const commentMenuRef = useRef(null);

//     // STATE to handle long descriptions
//     const [readMore, setReadMore] = useState(false);
//     const DESCRIPTION_LIMIT = 200;

//     // Environment variables
//     const PF = process.env.REACT_APP_PUBLIC_FOLDER;
//     const backend_url = process.env.BACKEND_URL || 'http://localhost:4000/api';

//     console.log("Post component profile picture:", PF + currentUser?.user?.profilePicture);


//     // Check if post is already saved by the user
//     // useEffect(() => {
//     //     setIsSaved(post?.savedBy?.includes(currentUser.user?._id));
//     // }, [post?.savedBy, currentUser.user?._id]);
//     useEffect(() => {
//         const saved = post?.savedBy?.includes(currentUser.user?._id);
//         if (isSaved !== saved) {
//             setIsSaved(saved);
//         }
//     }, [post?.savedBy, currentUser.user?._id]);


//     // Handle like button click
//     const likeHandler = async () => {
//         try {
//             await axios.put(`${backend_url}/posts/like/${post._id}`, {
//                 userId: currentUser.user?._id,
//             });
//             setLike(isLiked ? like - 1 : like + 1); // Toggle like count
//             setIsLiked(!isLiked); // Toggle like state
//         } catch (error) {
//             console.error('Error liking post:', error);
//         }
//     };

//     // Handle save post button click
//     const handleSave = async () => {
//         console.log(`${backend_url}/posts/${post._id}/save`)
//         try {
//             const saveResult = await axios.put(`${backend_url}/posts/${post._id}/save`, {
//                 userId: currentUser.user?._id,
//             });
//             // console.log("ssssssssssssssssssssssssssssssssssssssss")
//             setIsSaved(!isSaved); // Toggle saved state
//         } catch (error) {
//             console.error('Error saving post:', error);
//         }
//     };

//     // Submit a new comment
//     const handleSubmitComment = async () => {
//         if (!newCommentText.trim()) return; // Do not submit empty comments
//         console.log("currentUser in handleSubmitComment:", currentUser.user?._id);
//         try {
//             const res = await axios.post(`${backend_url}/comments/${post._id}`, { userId: currentUser.user?._id, text: newCommentText, });
//             console.log("Comment submitted:", res.data);
//             setComments([...comments, res.data]); // Add new comment to state
//             setNewCommentText(''); // Clear input
//             fetchComments(); // Refresh comments from server
//         } catch (error) {
//             console.error('Error submitting comment:', error);
//         }
//     };

//     useEffect(() => {
//         fetchComments(); // Fetch comments when post is loaded
//         // console.log("------------------------------------ ")
//     }, [])

//     // Fetch all comments for the current post
//     const fetchComments = async () => {
//         try {
//             const res = await axios.get(`${backend_url}/comments/${post._id}`);
//             // console.log("fetched comments**:", res.data);

//             if (res.data.message === "No comments found for this post.") {
//                 setComments([]); // No comments found, set empty array
//                 return;
//             }
//             setComments(res.data.comments); // Set retrieved comments

//         } catch (error) {
//             console.error("Error fetching comments:", error);
//         }
//     };

//     // Delete a comment by ID
//     const handleDeleteComment = async (commentId) => {
//         try {
//             const res = await axios.delete(`${backend_url}/comments/${commentId}`, { data: { userId: currentUser.user?._id }, });
//             setComments(comments.filter(comment => comment._id !== commentId)); // Remove from UI
//         } catch (error) {
//             console.error("Error deleting comment:", error);
//             toast.error("You can delete only your comment.");
//         }
//     };

//     const handleEditComment = async (commentId) => {
//         try {
//             const res = await axios.put(`${backend_url}/comments/${commentId}`, { userId: currentUser.user?._id, text: editCommentText, });

//             // Update comment in UI
//             setComments(comments.map(comment =>
//                 comment._id === commentId ? { ...comment, text: editCommentText } : comment
//             ));

//             // Reset states
//             setEditCommentText('');
//             setOpenCommentMenuId(null);
//             setEditCommentId(null);

//             // ✅ Show success toast only
//             // toast.success("Comment updated successfully!", {
//             //     autoClose: 1000,
//             //     closeOnClick: true,
//             // });

//             await fetchComments();

//         } catch (error) {
//             console.error("Error editing comment:", error);

//             // ❌ Show error toast only
//             // toast.error("Failed to update comment!", {
//             //     autoClose: 3000,
//             //     closeOnClick: true,
//             // });
//         }
//     };

//     // Delete a post by ID
//     const deletePost = async () => {
//         try {
//             const res = await axios.delete(`${backend_url}/posts/${post._id}`, { data: { userId: currentUser.user?._id }, });
//             toast.success(res.data); // Show success message
//             setTimeout(() => {
//                 triggerRefresh(true); // Refresh post list
//                 setMenuOpen(false); // Close menu
//             }, 3000);
//         } catch (err) {
//             console.error(err);
//             toast.error("You can delete only your post.");
//             setMenuOpen(false);
//         }
//     };

//     // edit post
//     const handleEditPost = async () => {
//         try {
//             const res = await axios.put(`${backend_url}/posts/${post._id}`, { userId: currentUser.user?._id, desc: editPostDesc, });
//             alert("Post updated successfully!");
//             console.log("Edit post response from backend:", res.data);
//             post.desc = editPostDesc; // Update post description in the state

//             setEditingPost(false); // Exit edit mode
//             setMenuOpen(false); // Close menu
//             triggerRefresh(true); // Refresh post list
//         } catch (error) {
//             console.error("Error editing post:", error);
//             alert("Failed to update post. You can edit only your post.");
//         }
//     };

//     // Detect clicks outside menus and close them
//     const handleClickOutside = (e) => {
//         const isClickOutsidePostMenu =
//             menuRef.current &&
//             !menuRef.current.contains(e.target) &&
//             iconRef.current &&
//             !iconRef.current.contains(e.target);

//         const isClickOutsideCommentMenu =
//             commentMenuRef.current &&
//             !commentMenuRef.current.contains(e.target) &&
//             iconRef.current &&
//             !iconRef.current.contains(e.target);

//         if (isClickOutsidePostMenu) {
//             setMenuOpen(false); // Close post menu
//         }
//         if (isClickOutsideCommentMenu) {
//             setOpenCommentMenuId(null); // Close comment menu
//         }
//     };

//     // Attach and clean up outside click event
//     useEffect(() => {
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     // const profileImage = post?.profilePicture ? post?.profilePicture  : user?profilePicture ? user?profilePicture : currentUser?.user?.profilePicture  ? PF + currentUser?.user?.profilePicture : PF + "person/noCover.png";
//     let profileImage;

//     if (post?.profilePicture) {
//         profileImage = post.profilePicture;
//     } else if (user?.profilePicture) {
//         profileImage = user.profilePicture;
//     } else if (currentUser?.user?.profilePicture) {
//         profileImage = PF + currentUser.user.profilePicture;
//     } else {
//         profileImage = PF + "person/noCover.png";
//     }

//     return (
//         <div className="post">
//             <div className="postWrapper">
//                 {/* Top Section - User Info */}
//                 <div className="postTop">
//                     <div className="postTopLeft">
//                         <Link to="/profile" state={{ userId: post.userId }} style={{ textDecoration: 'none' }}>
//                             <img
//                                 className="postProfileImg"
//                                 // src={post?.profilePicture || user?.profilePicture}
//                                 src={profileImage}
//                                 alt="profile"
//                             />
//                         </Link>
//                         <div className="postInfo">
//                             <span className="postUsername">
//                                 {post?.username || user?.username}
//                                 <span className="postDate">{format(post?.createdAt)}</span>
//                             </span>
//                             <span className="postLocation">{post?.locationName}</span>
//                         </div>
//                     </div>

//                     {/* Right side - Save icon and menu */}
//                     <div className="postTopRight">
//                         <img
//                             onClick={handleSave}
//                             className="saveIcon"
//                             src={PF + (isSaved ? 'saved.png' : 'save.png')}
//                             alt="save"
//                         />
//                         <MoreVertical className="postMoreVert" onClick={() => setMenuOpen(!menuOpen)} ref={iconRef} />
//                         {menuOpen && (
//                             <div className="postMenu" ref={menuRef}>
//                                 <div className="postMenuItem" onClick={() => setShowDeleteModal(true)}>Delete</div>
//                                 <div className='postMenuItem' onClick={() => {
//                                     setEditingPost(true);
//                                     setEditPostDesc(post.desc);
//                                 }}>Edit</div>
//                                 <div className="postMenuItem">Report</div>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Post Content */}
//                 <div className="postCenter">
//                     {editingPost ? (
//                         <div className="editPostBox">
//                             <textarea
//                                 value={editPostDesc}
//                                 onChange={(e) => setEditPostDesc(e.target.value)}
//                                 className="editPostInput"
//                             />
//                             <div className="editActions">
//                                 <button className="commentBtn" onClick={handleEditPost}>Save</button>
//                                 <button
//                                     className="commentBtn cancel"
//                                     onClick={() => {
//                                         setEditingPost(false); // Exit edit mode
//                                         setEditPostDesc(post.desc || ''); // Reset to original post description
//                                     }}
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     ) : (
//                         <>
//                             <span className="postText">
//                                 {post?.desc?.length > DESCRIPTION_LIMIT ? (
//                                     <>
//                                         {readMore ? post.desc : `${post.desc.substring(0, DESCRIPTION_LIMIT)}... `}
//                                         <span onClick={() => setReadMore(!readMore)} className="readMoreToggle">
//                                             {readMore ? 'Show less' : 'Read more'}
//                                         </span>
//                                     </>
//                                 ) : (
//                                     post?.desc
//                                 )}
//                             </span>

//                             {post?.img && <img className="postImg" src={PF + post.img} alt="post" />}

//                             {/* Tags */}
//                             <div className="postTags">
//                                 {post?.tags?.map((tag, index) => (
//                                     <span key={index} className="tag">#{tag}</span>
//                                 ))}
//                             </div>
//                         </>
//                     )}
//                 </div>

//                 {/* Like & Comment Buttons */}
//                 <div className="postBottom">
//                     <div className="postActions">
//                         <div className="postActionIcons">
//                             <div>
//                                 <img
//                                     onClick={likeHandler}
//                                     className="likeIcon"
//                                     src={PF + (isLiked ? 'liked1.png' : 'like1.png')}
//                                     alt="like"
//                                 />
//                                 <span className="postLikeCounter">{like} likes</span>
//                             </div>
//                             <span
//                                 className="postCommentText"
//                                 onClick={() => {
//                                     setCommentsOpen(!commentsOpen);
//                                     if (!commentsOpen) {
//                                         fetchComments();
//                                     }
//                                 }}
//                             >
//                                 {commentsOpen
//                                     ? `Hide ${comments.length || 0} comments`
//                                     : `View ${comments.length || 0} comments`}
//                             </span>

//                         </div>
//                     </div>
//                 </div>

//                 {/* Comments Section */}
//                 {commentsOpen && (
//                     <div className="commentsSectionWrapper">
//                         {/* Add new comment box */}
//                         <div className="newCommentBox">
//                             <textarea
//                                 value={newCommentText}
//                                 onChange={(e) => setNewCommentText(e.target.value)}
//                                 placeholder="Write a comment..."
//                                 className="commentInput"
//                             />
//                             <button onClick={handleSubmitComment} className="commentBtn">
//                                 Post
//                             </button>
//                         </div>
//                         <div className="commentsSection">
//                             {comments.map((comment) => (
//                                 <div key={comment._id} className="comment">
//                                     <img className="commentAvatar" src={comment.profilePicture} alt="User" />
//                                     <div className="commentContent">
//                                         <div className="commentMoreVertContainer">
//                                             <MoreVertical
//                                                 className="postMoreVert"
//                                                 onClick={() =>
//                                                     setOpenCommentMenuId(openCommentMenuId === comment._id ? null : comment._id)
//                                                 }
//                                             />
//                                             {openCommentMenuId === comment._id && (
//                                                 <div className="postMenu" ref={(el) => (commentMenuRef.current = el)}>
//                                                     <div className="postMenuItem"
//                                                         onClick={() => {
//                                                             setCommentToDelete(comment._id);
//                                                             setShowDeleteModal(true);
//                                                             setOpenCommentMenuId(null); // Close menu
//                                                         }}>
//                                                         Delete
//                                                     </div>
//                                                     <div
//                                                         className="postMenuItem"
//                                                         onClick={() => {
//                                                             setEditCommentId(comment._id); // enter edit mode
//                                                             setEditCommentText(comment.text); // prefill current comment text
//                                                             setOpenCommentMenuId(null); // close the menu
//                                                         }}
//                                                     >
//                                                         Edit
//                                                     </div>
//                                                     <div className="postMenuItem">Report</div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <div>
//                                             {editCommentId === comment._id ? (
//                                                 <div className="editCommentBox">
//                                                     <textarea
//                                                         value={editCommentText}
//                                                         onChange={(e) => setEditCommentText(e.target.value)}
//                                                         className="commentInput"
//                                                     />
//                                                     <div className="editActions">
//                                                         <button
//                                                             className="commentBtn"
//                                                             onClick={() => handleEditComment(comment._id)}
//                                                         >
//                                                             Save
//                                                         </button>
//                                                         <button
//                                                             className="commentBtn cancel"
//                                                             onClick={() => {
//                                                                 setEditCommentId(null);
//                                                                 setEditCommentText('');
//                                                             }}
//                                                         >
//                                                             Cancel
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <div>
//                                                     <span className="commentUsername">{comment.username}</span>
//                                                     <span className="commentText">{comment.text}</span>
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <div className="commentTime">
//                                             {new Date(comment.createdAt).toLocaleTimeString()}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* Toast for alerts & Modal for delete confirmation */}
//                 <ToastContainer position="top-right" autoClose={2000} />
//                 <ConfirmModal
//                     isOpen={showDeleteModal}
//                     onClose={() => { setShowDeleteModal(false); setCommentToDelete(null); }}
//                     onConfirm={() => {
//                         if (commentToDelete) {
//                             handleDeleteComment(commentToDelete); // Delete comment
//                             setCommentToDelete(null);
//                         }
//                         else {
//                             deletePost(); // Delete post
//                         }
//                         setShowDeleteModal(false); // Close modal
//                     }}
//                     title={commentToDelete ? "Delete Comment" : "Delete Post"}
//                     message={commentToDelete ? "Are you sure you want to delete this comment?" : "Are you sure you want to delete this post?"}
//                 />
//             </div>
//         </div>
//     );
// }
