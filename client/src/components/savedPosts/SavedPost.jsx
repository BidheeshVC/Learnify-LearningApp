// src/components/SavedPost.jsx
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import { MoreVertical } from 'lucide-react'
import { format } from 'timeago.js'
import { ToastContainer } from 'react-toastify'
import ConfirmModal from '../confirmModal/confirmModal'
import Topbar from '../topbar/Topbar'
import './SavedPost.css'

const DESCRIPTION_LIMIT = 100
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

export default function SavedPost() {
  const { currentUser } = useContext(AuthContext)
  const [savedPosts, setSavedPosts] = useState([])
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  // const [menuOpen, setMenuOpen] = useState(false)
  const [menuOpenPostId, setMenuOpenPostId] = useState(null)

  const [readMore, setReadMore] = useState(false)
  const [likeCounts, setLikeCounts] = useState({}) // track per-post likes
  const [isLiked, setIsLiked] = useState({})
  const [isSaved, setIsSaved] = useState({})
  const [fetchData, setFetchData] = useState(false)


  const backend_url = process.env.BACKEND_URL || 'http://localhost:4000/api'

  const iconRef = useRef(null);
  const menuRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setMenuOpenPostId(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);




  useEffect(() => {
    const userId = currentUser?._id
    if (!userId) return
    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${backend_url}/posts/getsavedposts/${userId}`)
        // console.log("saved post response", res.data)

        setSavedPosts(res.data)
        // initialize per-post states
        const likesInit = {}, savedInit = {}
        res.data.forEach(p => {
          likesInit[p._id] = p.likes.length
          savedInit[p._id] = true
        })
        setLikeCounts(likesInit)
        setIsSaved(savedInit)
      } catch (err) {
        console.error('Error fetching saved posts:', err)
      }
    }
    fetchSaved()
  }, [currentUser, fetchData])

  const likeHandler = async postId => {
    try {
      await axios.put(`${backend_url}/posts/${postId}/like`, { userId: currentUser._id })
      setLikeCounts(prev => ({
        ...prev,
        [postId]: isLiked[postId] ? prev[postId] - 1 : prev[postId] + 1
      }))
      setIsLiked(prev => ({ ...prev, [postId]: !prev[postId] }))
    } catch (err) {
      console.error(err)
    }
  }

  const toggleSave = async postId => {
    console.log("post id toggleSave", postId)
    try {
      const res = await axios.put(`${backend_url}/posts/${postId}/save`, { userId: currentUser._id })
      // console.log("response check in toggle save::", res.status)
      if (res.status == 200) {
        setFetchData(!fetchData)
      }
      setIsSaved(prev => ({ ...prev, [postId]: !prev[postId] }))

    } catch (err) {
      console.error(err)
    }
  }
  console.log("fetch data verification::", fetchData)

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    // implement delete logic
    setShowDeleteModal(false)
  }

  useEffect(() => {
    if (savedPosts?.savedBy?.includes(currentUser._id)) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [savedPosts?.savedBy, currentUser._id]);

  return (
    <>
      <Topbar />
      <div className="main-layout">
        {/* <Sidebar /> */}
        <div className="saved-posts-container">
          {savedPosts.length > 0 ? (
            savedPosts.map(post => (
              <div key={post._id} className="post">
                <div className="postWrapper">
                  <div className="postTop">
                    <div className="postTopLeft">
                      <Link to="/profile" state={{ post }} style={{ textDecoration: 'none' }}>
                        <img
                          className="postProfileImg"
                          src={
                            post.profilePicture?.startsWith('http')
                              ? post.profilePicture
                              : PF + (post.profilePicture || 'defaultAvatar.png')
                          }
                          alt="profile"
                        />

                      </Link>
                      <div className="postInfo">
                        <span className="postUsername">
                          {post.username || 'Unknown'}
                          <span className="postDate">{format(post.createdAt)}</span>
                        </span>
                        <span className="postLocation">{post.locationName}</span>
                      </div>
                    </div>
                    <div className="postTopRight">
                      <img
                        onClick={() => (setIsSaved(!isSaved), toggleSave(post._id))}
                        className="saveIcon"
                        // src={PF +(`/icons/${isSaved[post._id] ? 'saved.png' : 'save.png'}`)}
                        src={PF + (isSaved ? "saved.png" : "save.png")}

                        alt={isSaved[post._id] ? 'saved' : 'save'}
                      />
                      {/* <MoreVertical
                        className="postMoreVert"
                        onClick={() => setMenuOpen(prev => !prev)}
                      /> */}
                      {/* {menuOpen && (
                        <div className="postMenu"> */}
                      {/* <div
                            className="postMenuItem"
                            onClick={() => toggleSave(post._id)}
                          >
                            {isSaved[post._id] ? 'Unsave' : 'Save'}
                          </div> */}
                      {/* <div className="postMenuItem" onClick={handleDelete}>
                            Delete Post
                          </div> */}
                      {/* <div className="postMenuItem">Report</div>
                        </div>
                      )} */}
                      <MoreVertical
                        ref={iconRef}
                        className="postMoreVert"
                        onClick={() => setMenuOpenPostId(prev => (prev === post._id ? null : post._id))}
                      />
                      {menuOpenPostId === post._id && (
                        <div className="postMenu" ref={menuRef}>
                          <div className="postMenuItem">Report</div>
                        </div>
                      )}

                    </div>
                  </div>
                  <div className="postCenter">
                    <span className="postText">
                      {post.desc?.length > DESCRIPTION_LIMIT ? (
                        <>
                          {readMore ? post.desc : post.desc.substring(0, DESCRIPTION_LIMIT) + '... '}
                          <span
                            onClick={() => setReadMore(prev => !prev)}
                            style={{ color: 'gray', cursor: 'pointer' }}
                          >
                            {readMore ? 'Show less' : 'Read more'}
                          </span>
                        </>
                      ) : (
                        post.desc
                      )}
                    </span>
                    {post.img && <img className="postImg" src={PF + post.img} alt="post" />}
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
                            onClick={() => likeHandler(post._id)}
                            className="likeIcon"
                            src={PF + (isLiked ? "liked1.png" : "like1.png")}
                            alt={isLiked[post._id] ? 'liked' : 'like'}
                          />
                          <span className="postLikeCounter">
                            {likeCounts[post._id]} likes
                          </span>
                        </div>

                        <span
                          className="postCommentText"
                          onClick={() => setCommentsOpen(prev => !prev)}
                        >
                          View comments
                        </span>
                      </div>
                    </div>
                  </div>
                  {commentsOpen && (
                    <div className="commentsSection">
                      {/* ... same comment markup from your snippet ... */}
                    </div>
                  )}
                </div>
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
            ))
          ) : (
            <p className="no-saved">You haven't saved any posts yet.</p>
          )}
        </div>
      </div>
    </>
  )
}