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
    const { userId } = location.state || {};
    const post = {};

    console.log("user id from post component=====", userId)


    const [userPosts, setUserPosts] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [followed, setFollowed] = useState(false);


    const [profileUser, setProfileUser] = useState({})
    const [profileUserPosts, setProfileUserPosts] = useState({})


    const [showEditProfileModal, setShowEditProfileModal] = useState(false);

    const navigate = useNavigate();

    const [editForm, setEditForm] = useState({
        username: currentUser?.username || "",
        desc: currentUser?.description || "",
        profilePicture: null,
        coverPicture: null
    });



    let backend_url = process.env.BACKEND_URL || "http://localhost:4000/api";
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;



    const fetchProfileUserDetails = async () => {
        try {
            const userIdForPosts = post?.userId || currentUser?.user?._id || null;
            const res = await axios.get(`${backend_url}/users/profile/${userIdForPosts}`)
            console.log("data from fetchProfileUserDetails::::::", res.data)
            setProfileUser(res.data.user)
            setProfileUserPosts(res.data.userPosts)
        } catch (err) {
            console.error("Error fetching user details:", err);

        }
    }
    console.log("profileUser-------------", profileUser)
    console.log("profileUserPosts--------------", profileUserPosts)



    const fetchUserDetails = async () => {
        try {
            const userIdForPosts = post?.userId || currentUser?.user?._id || null;
            console.log("Fetching user details for userId:", userIdForPosts);
            const res = await axios.get(`${backend_url}/users/${userIdForPosts}`);
            // console.log("Fetched user details++++++++++++++++++++:", res.data);
            setUserDetails(res.data);

            const isFollowing = res.data.followers?.some(
                (followerId) => followerId._id.toString() === currentUser?._id
            );

            // console.log("is following:", isFollowing);

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
        let userIdForPosts = post?.userId || currentUser?.user?._id || null;

        fetchProfileUserDetails(userIdForPosts);

    }, [])


    useEffect(() => {
        // When coming from a post, use post.userId instead of post._id
        let userIdForPosts = post?.userId || currentUser?.user?._id || null;
        // console.log("User ID for posts:", userIdForPosts);
        fetchUserPosts(userIdForPosts);
        fetchUserDetails(userIdForPosts);

    }, [currentUser, post, userDetails?._id]);

    const followHandler = async () => {
        if (currentUser?._id === userDetails._id) {
            toast.warn("You can't follow yourself.");
            console.warn("You can't follow yourself.");
            return; // Prevent sending request
        }
        try {
            await axios.put(`${backend_url}/users/${userDetails._id}/followandunfollow`, {
                userId: currentUser?._id,
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

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setEditForm((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setEditForm((prev) => ({ ...prev, [name]: value }));
        }
    };


    const handleEditProfileSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("userId", currentUser?._id);
        formData.append("username", editForm.username);
        formData.append("description", editForm.desc);
        if (editForm.profilePicture) formData.append("profilePicture", editForm.profilePicture);
        if (editForm.coverPicture) formData.append("coverPicture", editForm.coverPicture);

        try {
            const res = await axios.put(`${backend_url}/users/edit/${currentUser?._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Profile updated successfully");
            console.log("Profile updated successfull")
            console.log("Updated user::::::::::::::::::::::", res);

            setShowEditProfileModal(false);
            window.location.reload(); // You can also update local state instead of reload

        } catch (err) {
            console.error("Error fetching user posts:", err);
        }

    }



    const coverImage = post?.coverPicture
        ? post?.coverPicture
        : currentUser?.coverPicture
            ? PF + currentUser?.coverPicture
            : PF + "person/noCover.png";
    // console.log("Cover image URL:", coverImage);

    const profileImage = post?.profilePicture
        ? post?.profilePicture
        : currentUser?.profilePicture
            ? PF + currentUser?.profilePicture
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
                            <h4 className="profileInfoName">{post ? post?.username : currentUser?name}</h4>
                            <span className="profileInfoDesc">Hello my friends!</span>
                        </div> */}
                        <div className="profileInfo">
                            <h4 className="profileInfoName">{post ? post?.username : currentUser?.username}</h4>
                            <span className="profileInfoDesc">{post ? post?.desc : currentUser?.desc}</span>

                            {userDetails && currentUser?._id !== userDetails._id ? (
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
                                                    value={editForm.username}
                                                    onChange={handleInputChange}
                                                    placeholder={post ? post?.username : currentUser?.username}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="description">Description</label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    value={editForm.desc}
                                                    onChange={handleInputChange}
                                                    placeholder={post ? post?.desc : currentUser?.desc}
                                                    rows="3"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="profilePicture">Profile Picture</label>
                                                <input
                                                    type="file"
                                                    id="profilePicture"
                                                    name="profilePicture"
                                                    accept="image/*"
                                                    onChange={handleInputChange} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="coverPicture">Cover Picture</label>
                                                <input
                                                    type="file"
                                                    id="coverPicture"
                                                    name="coverPicture"
                                                    accept="image/*"
                                                    onChange={handleInputChange} />
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
                                                username: post ? post?.username : currentUser?.name,
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


