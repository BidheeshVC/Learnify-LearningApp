import React, { useContext } from 'react'
import './profile.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import { useLocation } from "react-router-dom";

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


    let backend_url = process.env.BACKEND_URL || "http://localhost:4000/api";
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;


    const fetchUserDetails = async () => {
        try {
            const userIdForPosts = post?.userId || null;
            const res = await axios.get(`${backend_url}/users/${userIdForPosts}`);
            console.log("Fetched user details++++++++++++++++++++:", res.data);
            setUserDetails(res.data);

            const isFollowing = res.data.followers?.some(
                (followerId) => followerId._id.toString() === currentUser._id
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
            // console.log("Fetched user posts:", res.data);
            setUserPosts(res.data);
        } catch (err) {
            console.error("Error fetching user posts:", err);
        }
    }


    useEffect(() => {
        // When coming from a post, use post.userId instead of post._id
        let userIdForPosts = post?.userId || currentUser?._id || null;
        fetchUserPosts(userIdForPosts);
        fetchUserDetails(userIdForPosts);

    }, [currentUser, post, userDetails?._id]);

    const followHandler = async () => {
        if (currentUser._id === userDetails._id) {
            toast.warn("You can't follow yourself.");
            console.warn("You can't follow yourself.");
            return; // Prevent sending request
        }
        try {
            await axios.put(`${backend_url}/users/${userDetails._id}/followandunfollow`, {
                userId: currentUser._id,
            });
            await fetchUserDetails();
        }
        catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
            console.error("Follow/unfollow error:", err.response?.data || err.message);
            console.log("Followed status before error:", followed);
        }
    };




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
                            {/* <img
                                    className="profileCoverImg"
                                    // src={post.coverPicture ? PF + post.coverPicture  : user.coverPicture || PF + "person/noCover.png"}
                                    // src={
                                    //     post.coverPicture
                                    //       ? PF + post.coverPicture
                                    //       : user.coverPicture
                                    //       ? PF + user.coverPicture
                                    //       : PF + "person/noCover.png"
                                    //   }
                                    
                                    alt=""
                                /> */
                                <img className="profileCoverImg" src={coverImage} alt="Cover" />
                            }

                            <img
                                className="profileUserImg"
                                // src={post?.profilePicture || PF + "person/noAvatar.png"}
                                src={profileImage}
                                alt=""
                            />
                        </div>
                        {/* <div className="profileInfo">
                            <h4 className="profileInfoName">{post ? post?.username : currentUser?.username}</h4>
                            <span className="profileInfoDesc">Hello my friends!</span>
                        </div> */}
                        <div className="profileInfo">
                            <h4 className="profileInfoName">{post ? post?.username : currentUser?.username}</h4>
                            <span className="profileInfoDesc">Hello my friends!</span>
                            {/* 
                            {userDetails && currentUser._id == userDetails._id && (
                                <div className="profileMenu">
                                    <button className='editprofilebutton'>Edit Profile</button>
                                </div>
                            )} */}
                            {/* <div className="profileMenu">
                                <button className='editprofilebutton'>Edit Profile</button>
                            </div> */}


                            {/* Show follow button if it's not your own profile */}
                            {/* {userDetails && currentUser._id !== userDetails._id && (

                                // {userDetails.followers.includes(currentUser._id) && 
                                <button className="followButton" onClick={followHandler}>
                                    {followed ? "Unfollow" : "Follow"}
                                </button>
                            )} */}

                            {userDetails && currentUser._id !== userDetails._id ? (
                                <button className="followButton" onClick={followHandler}>
                                    {followed ? "Unfollow" : "Follow"}
                                </button>
                            ) : (
                                <div className="profileMenu">
                                    <button
                                        className="editprofilebutton"
                                        onClick={() => setShowEditProfileModal(true)}
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            )}

                            {showEditProfileModal && (
                                <div className="modal-overlay" onClick={() => setShowEditProfileModal(false)}>
                                    <div
                                        className="editProfileModal"
                                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                                    >
                                        <h2>Edit Profile</h2>
                                        <form className="edit-profile-form">
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


