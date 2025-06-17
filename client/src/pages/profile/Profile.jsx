import React, { useContext } from 'react'
import './profile.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '../../components/post/Post';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';


export default function Profile() {

    const { currentUser } = useContext(AuthContext)

    console.log("user in profile page from context :::", currentUser)



    const location = useLocation();
    const { post } = location.state || {};


    const [userPosts, setUserPosts] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [followed, setFollowed] = useState(false);

    const [showEditProfileModal, setShowEditProfileModal] = useState(false);

    const navigate = useNavigate();


    let backend_url = process.env.BACKEND_URL || "http://localhost:4000/api";
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;


    const fetchUserDetails = async () => {
        try {
            const userIdForPosts = post?.userId || currentUser?.user?._id || null;
            console.log("Fetching user details for userId:", userIdForPosts);
            const res = await axios.get(`${backend_url}/users/${userIdForPosts}`);
            console.log("Fetched user details++++++++++++++++++++:", res.data);
            setUserDetails(res.data);

            const isFollowing = res.data.followers?.some(
                (followerId) => followerId._id.toString() === currentUser.user._id
            );

            console.log("is following:", isFollowing);

            setFollowed(isFollowing);
        } catch (err) {
            console.error("Error fetching user details:", err);
        }
    };

    // Fetch user posts
    const fetchUserPosts = async (userIdForPosts) => {
        try {
            const res = await axios.get(`${backend_url}/posts/profile/${userIdForPosts}`);
            console.log("Fetched user posts:", res.data);
            setUserPosts(res.data);
        } catch (err) {
            console.error("Error fetching user posts:", err);
        }
    }


    useEffect(() => {
        // When coming from a post, use post.userId instead of post._id
        let userIdForPosts = post?.userId || currentUser?.user._id || null;
        console.log("User ID for posts:", userIdForPosts);
        fetchUserPosts(userIdForPosts);
        fetchUserDetails(userIdForPosts);

    }, [currentUser, post, userDetails?._id]);

    const followHandler = async () => {
        if (currentUser.user._id === userDetails._id) {
            toast.warn("You can't follow yourself.");
            console.warn("You can't follow yourself.");
            return; // Prevent sending request
        }
        try {
            await axios.put(`${backend_url}/users/${userDetails._id}/followandunfollow`, {
                userId: currentUser.user._id,
            });
            await fetchUserDetails();
        }
        catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
            console.error("Follow/unfollow error:", err.response?.data || err.message);
            console.log("Followed status before error:", followed);
        }
    };
    // logout handler
    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.reload(); // Reload the page to reflect the logout
        console.log("User logged out successfully.");
        console.log("Current user after logout----------------:", currentUser);
        if (!currentUser || currentUser == null) {
            navigate("/login"); // Redirect to login page
        }

    };

    // edit profile

    const handleEditProfileSubmit = async (e) =>{
        e.preventDefault();
        
    }



    const coverImage = post?.coverPicture
        ? post?.coverPicture
        : currentUser?.coverPicture
            ? currentUser?.coverPicture
            : PF + "person/noCover.png";
    // console.log("Cover image URL:", coverImage);

    const profileImage = post?.profilePicture
        ? post?.profilePicture
        : currentUser?.profilePicture
            ? currentUser?.profilePicture
            : PF + "person/noCover.png";

    // console.log("Profile image URL:", profileImage);


    return (
        <>
            <Topbar />
            <div className="profile">
                <Sidebar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            {
                                <img className="profileCoverImg" src={coverImage} alt="Cover" />
                            }

                            <img
                                className="profileUserImg"
                                src={profileImage}
                                alt=""
                            />
                        </div>
                        {/* <div className="profileInfo">
                            <h4 className="profileInfoName">{post ? post?.username : currentUser?.username}</h4>
                            <span className="profileInfoDesc">Hello my friends!</span>
                        </div> */}
                        <div className="profileInfo">
                            <h4 className="profileInfoName">{post ? post?.username : currentUser?.user?.username}</h4>
                            <span className="profileInfoDesc">Hello my friends!</span>

                            {userDetails && currentUser.user._id !== userDetails._id ? (
                                <button className="followButton" onClick={followHandler}>
                                    {followed ? "Unfollow" : "Follow"}
                                </button>
                            ) : (
                                <div className="profileMenu">
                                    <div>
                                        <button
                                            className="editprofilebutton"
                                            onClick={() => setShowEditProfileModal(true)}
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                    <div>
                                        <button className="logoutbutton"
                                            onClick={handleLogout}
                                        >Log Out</button>
                                    </div>
                                </div>
                            )}

                            {showEditProfileModal && (
                                <div className="modal-overlay" onClick={() => setShowEditProfileModal(false)}>
                                    <div
                                        className="editProfileModal"
                                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                                    >
                                        <h2>Edit Profile</h2>
                                        <form className="edit-profile-form" onSubmit={handleEditProfileSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="username">Username</label>
                                                <input
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    placeholder={post ? post?.username : currentUser?.username}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="description">Description</label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    placeholder={post ? post?.description : currentUser?.description}
                                                    rows="3"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="profilePicture">Profile Picture</label>
                                                <input type="file" id="profilePicture" accept="image/*" />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="coverPicture">Cover Picture</label>
                                                <input type="file" id="coverPicture" accept="image/*" />
                                            </div>

                                            <div className="form-actions">
                                                <button
                                                    type="button"
                                                    className="cancel-btn"
                                                    onClick={() => setShowEditProfileModal(false)}
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
                            )}


                        </div>

                    </div>
                    <div className="profileRightBottom">
                        {/* <Feed profile setUserPosts={setUserPosts} /> */}
                        <>
                            <div className="feed">
                                <div className="feedWrapper">
                                    {/* <Share /> */}
                                    {userPosts?.map((p) => (
                                        // <Post key={p.id} post={p} user={userDetails?.username, userDetails?.profilePicture} />
                                        <Post
                                            key={p._id}
                                            post={p}
                                            user={{
                                                username: post ? post?.username : currentUser?.username,
                                                profilePicture: post ? post?.profilePicture : currentUser?.profilePicture,
                                            }}
                                        />

                                    ))}
                                </div>
                            </div>

                        </>
                        <Rightbar profile currentUser={userDetails} />
                    </div>
                </div>
            </div>
        </>
    )
}


