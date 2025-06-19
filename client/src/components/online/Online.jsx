import React, { useContext, useEffect, useState } from 'react'
import './online.css'
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';





export default function Online({ user }) {
    // console.log("user in online=========", user)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    let backend_url = process.env.BACKEND_URL || "http://localhost:4000/api";

    const { currentUser } = useContext(AuthContext);
    const [followed, setFollowed] = useState(false);

    useEffect(() => {
        if (user?.followings?.includes(currentUser?._id)) {
            setFollowed(true);
        } else {
            setFollowed(false);
        }
    }, [user, currentUser]);


    const followHandler = async () => {
        const userId = user._id;
        // console.log("user id in follow handler::", userId)
        try {
            const followRes = await axios.put(`${backend_url}/users/${userId}/followandunfollow`, {
                userId: currentUser?._id,
            });

            console.log("follow res::", followRes)
            if (followRes.data === "User has been followed") {
                setFollowed(true)
            } else {
                setFollowed(false)
            }
            // await fetchUserDetails();
        }
        catch (err) {
            // toast.error(err.response?.data?.message || "Something went wrong");
            console.error("Follow/unfollow error:", err.response?.data || err.message);
            console.log("Followed status before error:", followed);
        }
    }

    return (
        <li className='rightbarFriend'>
            <div className='rightbarProfile'>
                <div className='rightbarProfileImgContainer'>
                    <img className='rightbarProfileImg' src={user?.profilePicture || "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png"} alt='' />
                    <span className='rightbarOnline'></span>
                </div>
                <span className='rightbarUsername'>{user.username}</span>
            </div>

            <button className="followButton" onClick={followHandler}>
                {followed ? "Unfollow" : "Follow"}
            </button>
        </li>

    )
}
