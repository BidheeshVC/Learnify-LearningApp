    import React, { useContext } from 'react'
    import './profile.css'
    import Topbar from '../../components/topbar/Topbar'
    import Sidebar from "../../components/sidebar/Sidebar";
    import Feed from "../../components/feed/Feed";
    import Rightbar from "../../components/rightbar/Rightbar";
    import { useLocation } from "react-router-dom";

    import { useEffect, useState } from 'react';
    import axios from 'axios';
    import Post from '../../components/post/Post';
    import { AuthContext } from '../../context/AuthContext';

    export default function Profile() {

        const {currentUser} = useContext(AuthContext)

        // console.log("user in profile page :::", currentUser)

        const location = useLocation();
        const { post } = location.state || {};
        // console.log("verified user-:", currentUser)
        // console.log("verified post--------:", post)
        // console.log("location state:", location.state)

        const [userPosts, setUserPosts] = useState([]);
        const [userDetails, setUserDetails] = useState(null);

        let backend_url = process.env.BACKEND_URL || "http://localhost:4000/api";
        const PF = process.env.REACT_APP_PUBLIC_FOLDER;


        useEffect(() => {
            // When coming from a post, use post.userId instead of post._id
            let userIdForPosts = post?.userId || currentUser?._id || null;

        

            const fetchUserDetails = async () => {
                try {
                    const res = await axios.get(`${backend_url}/users/${userIdForPosts}`);
                    console.log("Fetched user details:", res.data);
                    setUserDetails(res.data);
                } catch (err) {
                        console.error("Error fetching user details:", err);
                }
            };
            fetchUserDetails();
            // Fetch user posts
            const fetchUserPosts = async () => {
                try {

                    const res = await axios.get(`${backend_url}/posts/profile/${userIdForPosts}`);
                    // console.log("Fetched user posts:", res.data);
                    setUserPosts(res.data);
                } catch (err) {
                    console.error("Error fetching user posts:", err);
                }
            }
            fetchUserPosts();
        }, [currentUser, post]);

        // console.log("user details:", userDetails)
        // console.log("user posts:", userPosts)


        
        const coverImage = post?.coverPicture
            ? post?.coverPicture
            : currentUser?.coverPicture
                ? currentUser?.coverPicture
                : PF + "person/noCover.png";
        console.log("Cover image URL:", coverImage);

        const profileImage = post?.profilePicture
            ? post?.profilePicture
            : currentUser?.profilePicture
                ? currentUser?.profilePicture
                : PF + "person/noCover.png";

        console.log("Profile image URL:", profileImage);


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
                            <div className="profileInfo">
                                <h4 className="profileInfoName">{post ? post?.username : currentUser?.username}</h4>
                                <span className="profileInfoDesc">Hello my friends!</span>
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
                                                key={p.id}
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


