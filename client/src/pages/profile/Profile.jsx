import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Components
import Topbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Rightbar from '../../components/rightbar/Rightbar';
import Post from '../../components/post/Post';

// Context
import { AuthContext } from '../../context/AuthContext';

// Styles
import './profile.css';

// Constants
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000/api';
const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
const DEFAULT_COVER_IMAGE = `${PUBLIC_FOLDER}persons/person1.jpeg`;

/**
 * Profile Component - Displays user profile with posts, follow functionality, and edit capabilities
 * Handles both current user's profile and other users' profiles
 */
export default function Profile() {
  // ==================== HOOKS & CONTEXT ====================
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract userId from navigation state (when coming from another component)
  const { userId } = location.state || {};

  // ==================== STATE MANAGEMENT ====================
  // Profile user data and posts
  const [profileUser, setProfileUser] = useState({});
  const [profileUserPosts, setProfileUserPosts] = useState([]);
  
  // Legacy states (kept for compatibility - can be removed if not used elsewhere)
  const [userPosts, setUserPosts] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [followed, setFollowed] = useState(false);

  // UI state
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Edit form state
  const [editForm, setEditForm] = useState({
    username: currentUser?.user?.username || '',
    desc: currentUser?.user?.description || '',
    profilePicture: null,
    coverPicture: null
  });

  // ==================== COMPUTED VALUES ====================
  /**
   * Determines the target user ID for API calls
   * Priority: userId from navigation state > current user ID
   */
  const targetUserId = useMemo(() => {
    return userId || currentUser?.user?._id || null;
  }, [userId, currentUser?.user?._id]);

  /**
   * Determines if viewing own profile
   */
  const isOwnProfile = useMemo(() => {
    return targetUserId === currentUser?.user?._id;
  }, [targetUserId, currentUser?.user?._id]);

  /**
   * Gets appropriate cover image URL with fallback
   */
  const coverImageUrl = useMemo(() => {
    return profileUser?.coverPicture || 
           currentUser?.user?.coverPicture || 
           DEFAULT_COVER_IMAGE;
  }, [profileUser?.coverPicture, currentUser?.user?.coverPicture]);

  /**
   * Gets appropriate profile image URL with fallback
   */
  const profileImageUrl = useMemo(() => {
    return profileUser?.profilePicture || 
           currentUser?.user?.profilePicture || 
           DEFAULT_COVER_IMAGE;
  }, [profileUser?.profilePicture, currentUser?.user?.profilePicture]);

  // ==================== API FUNCTIONS ====================
  /**
   * Fetches profile user details and their posts
   * @param {string} userId - Target user ID
   */
  const fetchProfileUserDetails = useCallback(async (userId) => {
    if (!userId) {
      console.warn('No user ID provided for profile fetch');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching profile user details for userId:', userId);
      
      const response = await axios.get(`${BACKEND_URL}/users/profile/${userId}`);
      const { user, userPosts } = response.data;
      
      console.log('Profile data fetched successfully:', response.data);
      
      setProfileUser(user || {});
      setProfileUserPosts(userPosts || []);
      
    } catch (error) {
      console.error('Error fetching profile user details:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetches user details for follow/unfollow functionality
   * @param {string} userId - Target user ID
   */
  const fetchUserDetails = useCallback(async (userId) => {
    if (!userId) return;

    try {
      console.log('Fetching user details for userId:', userId);
      
      const response = await axios.get(`${BACKEND_URL}/users/${userId}`);
      const userData = response.data;
      
      console.log('User details fetched successfully:', userData);
      setUserDetails(userData);

      // Check if current user is following this profile user
      const isFollowing = userData.followers?.some(
        (follower) => follower._id?.toString() === currentUser?.user?._id
      );
      
      setFollowed(isFollowing);
      
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user information');
    }
  }, [currentUser?.user?._id]);

  /**
   * Fetches user posts (legacy function - kept for compatibility)
   * @param {string} userId - Target user ID
   */
  const fetchUserPosts = useCallback(async (userId) => {
    if (!userId) return;

    try {
      const response = await axios.get(`${BACKEND_URL}/posts/profile/${userId}`);
      console.log('User posts fetched successfully:', response.data);
      setUserPosts(response.data);
      
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  }, []);

  // ==================== EVENT HANDLERS ====================
  /**
   * Handles follow/unfollow button click
   */
  const handleFollowToggle = useCallback(async () => {
    // Prevent self-following
    if (currentUser?.user?._id === userDetails?._id) {
      toast.warn("You can't follow yourself.");
      return;
    }

    if (!userDetails?._id) {
      toast.error('User information not available');
      return;
    }

    try {
      await axios.put(
        `${BACKEND_URL}/users/${userDetails._id}/followandunfollow`,
        { userId: currentUser?.user?._id }
      );
      
      // Refresh user details to get updated follow status
      await fetchUserDetails(userDetails._id);
      toast.success(followed ? 'Unfollowed successfully' : 'Followed successfully');
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      toast.error(errorMessage);
      console.error('Follow/unfollow error:', error.response?.data || error.message);
    }
  }, [currentUser?.user?._id, userDetails?._id, followed, fetchUserDetails]);

  /**
   * Handles user logout
   */
  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('user');
      console.log('User logged out successfully');
      
      // Force page reload to clear all state and redirect to login
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  }, []);

  /**
   * Handles edit form input changes
   * @param {Event} event - Input change event
   */
  const handleEditFormChange = useCallback((event) => {
    const { name, value, files } = event.target;
    
    setEditForm(prevForm => ({
      ...prevForm,
      [name]: files ? files[0] : value
    }));
  }, []);

  /**
   * Handles edit profile form submission
   * @param {Event} event - Form submit event
   */
  const handleEditProfileSubmit = useCallback(async (event) => {
    event.preventDefault();

    if (!currentUser?.user?._id) {
      toast.error('User authentication required');
      return;
    }

    const formData = new FormData();
    formData.append('userId', currentUser.user._id);
    formData.append('username', editForm.username);
    formData.append('description', editForm.desc);
    
    // Only append files if they exist
    if (editForm.profilePicture) {
      formData.append('profilePicture', editForm.profilePicture);
    }
    if (editForm.coverPicture) {
      formData.append('coverPicture', editForm.coverPicture);
    }

    try {
      const response = await axios.put(
        `${BACKEND_URL}/users/edit/${currentUser.user._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Profile updated successfully:', response.data);
      toast.success('Profile updated successfully');
      
      setShowEditProfileModal(false);
      
      // Refresh profile data instead of full page reload
      await fetchProfileUserDetails(currentUser.user._id);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    }
  }, [currentUser?.user?._id, editForm, fetchProfileUserDetails]);

  /**
   * Closes edit profile modal
   */
  const handleCloseEditModal = useCallback(() => {
    setShowEditProfileModal(false);
  }, []);

  /**
   * Opens edit profile modal
   */
  const handleOpenEditModal = useCallback(() => {
    setShowEditProfileModal(true);
  }, []);

  // ==================== EFFECTS ====================
  /**
   * Main effect - fetches profile data when component mounts or target user changes
   */
  useEffect(() => {
    if (!targetUserId) {
      console.warn('No target user ID available');
      setIsLoading(false);
      return;
    }

    console.log('Target user ID changed, fetching profile data:', targetUserId);
    fetchProfileUserDetails(targetUserId);
    
  }, [targetUserId, fetchProfileUserDetails]);

  /**
   * Effect for fetching additional user details and posts (legacy compatibility)
   */
  useEffect(() => {
    if (!targetUserId) return;

    console.log('Fetching additional user data for:', targetUserId);
    fetchUserPosts(targetUserId);
    fetchUserDetails(targetUserId);
    
  }, [targetUserId, fetchUserPosts, fetchUserDetails]);

  /**
   * Effect to update edit form when current user data changes
   */
  useEffect(() => {
    if (currentUser?.user && isOwnProfile) {
      setEditForm({
        username: currentUser.user.username || '',
        desc: currentUser.user.description || '',
        profilePicture: null,
        coverPicture: null
      });
    }
  }, [currentUser?.user, isOwnProfile]);

  // ==================== RENDER HELPERS ====================
  /**
   * Renders the edit profile modal
   */
  const renderEditProfileModal = () => (
    <div className="modal-overlay" onClick={handleCloseEditModal}>
      <div 
        className="editProfileModal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Edit Profile</h2>
        <form className="edit-profile-form" onSubmit={handleEditProfileSubmit}>
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={editForm.username}
              onChange={handleEditFormChange}
              placeholder="Enter username"
              required
            />
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="desc"
              value={editForm.desc}
              onChange={handleEditFormChange}
              placeholder="Enter description"
              rows="3"
            />
          </div>

          {/* Profile Picture Field */}
          <div className="form-group">
            <label htmlFor="profilePicture">Profile Picture</label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleEditFormChange}
            />
          </div>

          {/* Cover Picture Field */}
          <div className="form-group">
            <label htmlFor="coverPicture">Cover Picture</label>
            <input
              type="file"
              id="coverPicture"
              name="coverPicture"
              accept="image/*"
              onChange={handleEditFormChange}
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCloseEditModal}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  /**
   * Renders profile action buttons (follow/unfollow or edit/logout)
   */
  const renderProfileActions = () => {
    if (!isOwnProfile && userDetails) {
      // Show follow/unfollow button for other users
      return (
        <button className="followButton" onClick={handleFollowToggle}>
          {followed ? 'Unfollow' : 'Follow'}
        </button>
      );
    }

    if (isOwnProfile) {
      // Show edit profile and logout buttons for own profile
      return (
        <div className="profileMenu">
          <button
            className="editprofilebutton"
            onClick={handleOpenEditModal}
          >
            Edit Profile
          </button>
          <button
            className="logoutbutton"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      );
    }

    return null;
  };

  /**
   * Renders the posts feed
   */
  const renderPostsFeed = () => {
    if (isLoading) {
      return <p className="text-center text-gray-500 mt-4">Loading posts...</p>;
    }

    if (!profileUserPosts || profileUserPosts.length === 0) {
      return <p className="text-center text-gray-500 mt-4">No posts found</p>;
    }

    return (
      <div className="feed">
        <div className="feedWrapper">
          {profileUserPosts.map((post) => (
            <Post
              key={post._id}
              post={post}
              user={{
                username: profileUser?.username || currentUser?.user?.username,
                profilePicture: profileUser?.profilePicture || currentUser?.user?.profilePicture,
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  // ==================== EARLY RETURNS ====================
  if (!currentUser) {
    console.log('No authenticated user found');
    return (
      <div className="profile-error">
        <p>Please log in to view profiles</p>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          {/* Profile Header Section */}
          <div className="profileRightTop">
            <div className="profileCover">
              {/* Cover Image */}
              <img 
                className="profileCoverImg" 
                src={coverImageUrl} 
                alt="Cover"
                onError={(e) => {
                  e.target.src = DEFAULT_COVER_IMAGE;
                }}
              />

              {/* Profile Image */}
              <img
                className="profileUserImg"
                src={profileImageUrl}
                alt="Profile"
                onError={(e) => {
                  e.target.src = DEFAULT_COVER_IMAGE;
                }}
              />
            </div>

            {/* Profile Information */}
            <div className="profileInfo">
              <h4 className="profileInfoName">
                {profileUser?.username || currentUser?.user?.username || 'Unknown User'}
              </h4>
              <span className="profileInfoDesc">
                {profileUser?.desc || currentUser?.user?.desc || 'No description available'}
              </span>

              {/* Profile Actions (Follow/Edit/Logout buttons) */}
              {renderProfileActions()}

              {/* Edit Profile Modal */}
              {showEditProfileModal && renderEditProfileModal()}
            </div>
          </div>

          {/* Profile Content Section */}
          <div className="profileRightBottom">
            {/* Posts Feed */}
            {renderPostsFeed()}

            {/* Right Sidebar */}
            <Rightbar profile currentUser={userDetails} />
          </div>
        </div>
      </div>
    </>
  );
}




















// import React, { useContext } from 'react'
// import './profile.css'
// import Topbar from '../../components/topbar/Topbar'
// import Sidebar from "../../components/sidebar/Sidebar";
// import Rightbar from "../../components/rightbar/Rightbar";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Post from '../../components/post/Post';
// import { AuthContext } from '../../context/AuthContext';
// import { toast } from 'react-toastify';


// export default function Profile() {

//     const { currentUser } = useContext(AuthContext)

//     console.log("user in profile page from context :::", currentUser)



//     const location = useLocation();
//     const { userId } = location.state || {};
//     const post = {};
//     console.log("post from profile page::::::", post)

//     console.log("user id from post component=====", userId)


//     const [userPosts, setUserPosts] = useState([]);
//     const [userDetails, setUserDetails] = useState(null);
//     const [followed, setFollowed] = useState(false);


//     const [profileUser, setProfileUser] = useState({})
//     const [profileUserPosts, setProfileUserPosts] = useState({})


//     const [showEditProfileModal, setShowEditProfileModal] = useState(false);

//     const navigate = useNavigate();

//     const [editForm, setEditForm] = useState({
//         username: currentUser?.user?.username || "",
//         desc: currentUser?.user?.description || "",
//         profilePicture: null,
//         coverPicture: null
//     });



//     let backend_url = process.env.BACKEND_URL || "http://localhost:4000/api";
//     const PF = process.env.REACT_APP_PUBLIC_FOLDER;



//     const fetchProfileUserDetails = async () => {
//         try {
//             const userIdForPosts = userId || currentUser?.user?._id || null;
//             console.log("Fetching profile user details for userId:", userIdForPosts);
//             const res = await axios.get(`${backend_url}/users/profile/${userIdForPosts}`)
//             console.log("data from fetchProfileUserDetails::::::", res.data)
//             setProfileUser(res.data.user)
//             setProfileUserPosts(res.data.userPosts)
//         } catch (err) {
//             console.error("Error fetching user details:", err);

//         }
//     }
//     console.log("profileUser-------------", profileUser)
//     console.log("profileUserPosts--------------", profileUserPosts)



//     const fetchUserDetails = async () => {
//         try {
//             const userIdForPosts = userId || currentUser?.user?._id || null;
//             console.log("Fetching user details for userId:", userIdForPosts);
//             const res = await axios.get(`${backend_url}/users/${userIdForPosts}`);
//             console.log("Fetched user details++++++++++++++++++++:", res.data);
//             setUserDetails(res.data);

//             const isFollowing = res.data.followers?.some(
//                 (followerId) => followerId._id.toString() === currentUser?.user?._id
//             );

//             // console.log("is following:", isFollowing);

//             setFollowed(isFollowing);
//         } catch (err) {
//             console.error("Error fetching user details:", err);
//         }
//     };

//     // Fetch user posts
//     const fetchUserPosts = async (userIdForPosts) => {
//         try {
//             const res = await axios.get(`${backend_url}/posts/profile/${userIdForPosts}`);
//             console.log("Fetched user posts:", res.data);
//             setUserPosts(res.data);
//         } catch (err) {
//             console.error("Error fetching user posts:", err);
//         }
//     }

//     useEffect(() => {
//         let userIdForPosts = post?.userId || currentUser?.user?._id || null;

//         fetchProfileUserDetails(userIdForPosts);

//     }, [])


//     // useEffect(() => {
//     //     // When coming from a post, use post.userId instead of post._id
//     //     let userIdForPosts = post?.userId || currentUser?.user?._id || null;
//     //     // console.log("User ID for posts:", userIdForPosts);
//     //     fetchUserPosts(userIdForPosts);
//     //     fetchUserDetails(userIdForPosts);

//     // }, [currentUser, post, userDetails?._id]);

//     useEffect(() => {
//         // When coming from a post, use post.userId instead of post._id
//         let userIdForPosts = post?.userId || currentUser?.user?._id || null;
//         // console.log("User ID for posts:", userIdForPosts);
//         fetchUserPosts(userIdForPosts);
//         fetchUserDetails(userIdForPosts);

//     }, [currentUser?.user?._id]);

//     const followHandler = async () => {
//         if (currentUser?._id === userDetails._id) {
//             toast.warn("You can't follow yourself.");
//             console.warn("You can't follow yourself.");
//             return; // Prevent sending request
//         }
//         try {
//             await axios.put(`${backend_url}/users/${userDetails._id}/followandunfollow`, {
//                 userId: currentUser?._id,
//             });
//             await fetchUserDetails();
//         }
//         catch (err) {
//             toast.error(err.response?.data?.message || "Something went wrong");
//             console.error("Follow/unfollow error:", err.response?.data || err.message);
//             console.log("Followed status before error:", followed);
//         }
//     };
//     // logout handler
//     const handleLogout = () => {
//         localStorage.removeItem("user");
//         window.location.reload(); // Reload the page to reflect the logout
//         console.log("User logged out successfully.");
//         console.log("Current user after logout----------------:", currentUser);
//         if (!currentUser || currentUser == null) {
//             navigate("/login"); // Redirect to login page
//         }

//     };

//     // edit profile

//     const handleInputChange = (e) => {
//         const { name, value, files } = e.target;
//         if (files) {
//             setEditForm((prev) => ({ ...prev, [name]: files[0] }));
//         } else {
//             setEditForm((prev) => ({ ...prev, [name]: value }));
//         }
//     };


//     const handleEditProfileSubmit = async (e) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append("userId", currentUser?._id);
//         formData.append("username", editForm.username);
//         formData.append("description", editForm.desc);
//         if (editForm.profilePicture) formData.append("profilePicture", editForm.profilePicture);
//         if (editForm.coverPicture) formData.append("coverPicture", editForm.coverPicture);

//         try {
//             const res = await axios.put(`${backend_url}/users/edit/${currentUser?._id}`, formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             toast.success("Profile updated successfully");
//             console.log("Profile updated successfull")
//             console.log("Updated user::::::::::::::::::::::", res);

//             setShowEditProfileModal(false);
//             window.location.reload(); // You can also update local state instead of reload

//         } catch (err) {
//             console.error("Error fetching user posts:", err);
//         }

//     }



//     const coverImage = profileUser?.coverPicture
//         ? profileUser?.coverPicture
//         : currentUser?.user?.coverPicture
//             ? currentUser?.user?.coverPicture
//             : PF + "person/noCover.png";
//     // console.log("Cover image URL:", coverImage);

//     const profileImage = profileUser?.profilePicture
//         ? profileUser?.profilePicture
//         : currentUser?.user?.profilePicture
//             ? currentUser?.user?.profilePicture
//             : PF + "person/noCover.png";

//     // console.log("Profile image URL:", profileImage);


//     return (
//         <>
//             <Topbar />
//             <div className="profile">
//                 <Sidebar />
//                 <div className="profileRight">
//                     <div className="profileRightTop">
//                         <div className="profileCover">
//                             {
//                                 <img className="profileCoverImg" src={coverImage} alt="Cover" />
//                             }

//                             <img
//                                 className="profileUserImg"
//                                 src={profileImage}
//                                 alt=""
//                             />
//                         </div>
//                         {/* <div className="profileInfo">
//                             <h4 className="profileInfoName">{post ? post?.username : currentUser?name}</h4>
//                             <span className="profileInfoDesc">Hello my friends!</span>
//                         </div> */}
//                         <div className="profileInfo">
//                             <h4 className="profileInfoName">{profileUser ? profileUser?.username : currentUser?.user?.username}</h4>
//                             <span className="profileInfoDesc">{profileUser ? profileUser?.desc : currentUser?.user?.desc}</span>

//                             {userDetails && currentUser?.user?._id !== userDetails._id ? (
//                                 <button className="followButton" onClick={followHandler}>
//                                     {followed ? "Unfollow" : "Follow"}
//                                 </button>
//                             ) : (
//                                 <div className="profileMenu">
//                                     <div>
//                                         <button
//                                             className="editprofilebutton"
//                                             onClick={() => setShowEditProfileModal(true)}
//                                         >
//                                             Edit Profile
//                                         </button>
//                                     </div>
//                                     <div>
//                                         <button className="logoutbutton"
//                                             onClick={handleLogout}
//                                         >Log Out</button>
//                                     </div>
//                                 </div>
//                             )}

//                             {showEditProfileModal && (
//                                 <div className="modal-overlay" onClick={() => setShowEditProfileModal(false)}>
//                                     <div
//                                         className="editProfileModal"
//                                         onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
//                                     >
//                                         <h2>Edit Profile</h2>
//                                         <form className="edit-profile-form" onSubmit={handleEditProfileSubmit}>
//                                             <div className="form-group">
//                                                 <label htmlFor="username">Username</label>
//                                                 <input
//                                                     type="text"
//                                                     id="username"
//                                                     name="username"
//                                                     value={editForm.username}
//                                                     onChange={handleInputChange}
//                                                     placeholder={post ? post?.username : currentUser?.username}
//                                                     required
//                                                 />
//                                             </div>

//                                             <div className="form-group">
//                                                 <label htmlFor="description">Description</label>
//                                                 <textarea
//                                                     id="description"
//                                                     name="description"
//                                                     value={editForm.desc}
//                                                     onChange={handleInputChange}
//                                                     placeholder={post ? post?.desc : currentUser?.desc}
//                                                     rows="3"
//                                                 />
//                                             </div>

//                                             <div className="form-group">
//                                                 <label htmlFor="profilePicture">Profile Picture</label>
//                                                 <input
//                                                     type="file"
//                                                     id="profilePicture"
//                                                     name="profilePicture"
//                                                     accept="image/*"
//                                                     onChange={handleInputChange} />
//                                             </div>

//                                             <div className="form-group">
//                                                 <label htmlFor="coverPicture">Cover Picture</label>
//                                                 <input
//                                                     type="file"
//                                                     id="coverPicture"
//                                                     name="coverPicture"
//                                                     accept="image/*"
//                                                     onChange={handleInputChange} />
//                                             </div>

//                                             <div className="form-actions">
//                                                 <button
//                                                     type="button"
//                                                     className="cancel-btn"
//                                                     onClick={() => setShowEditProfileModal(false)}
//                                                 >
//                                                     Cancel
//                                                 </button>
//                                                 <button type="submit" className="save-btn">
//                                                     Save Changes
//                                                 </button>
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             )}


//                         </div>

//                     </div>
//                     <div className="profileRightBottom">
//                         {/* <Feed profile setUserPosts={setUserPosts} /> */}
//                         <>
//                             <div className="feed">
//                                 <div className="feedWrapper">
//                                     {profileUserPosts && profileUserPosts.length > 0 ? (
//                                         profileUserPosts.map((p) => (
//                                             <Post
//                                                 key={p._id}
//                                                 post={p}
//                                                 user={{
//                                                     username: profileUser?.username || currentUser?.name,
//                                                     profilePicture: profileUser?.profilePicture || currentUser?.profilePicture,
//                                                 }}
//                                             />
//                                         ))
//                                     ) : (
//                                         <p className="text-center text-gray-500 mt-4">No posts found</p>
//                                     )}
//                                 </div>
//                             </div>


//                         </>
//                         <Rightbar profile currentUser={userDetails} />
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }


