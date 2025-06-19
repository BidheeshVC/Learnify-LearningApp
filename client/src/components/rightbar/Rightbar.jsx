import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { format } from 'timeago.js';
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Rightbar({ profile }) {
  const [userDetails, setUserDetails] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  const { currentUser } = useContext(AuthContext);
  if (!currentUser) {
    console.error("Current user is not available in Rightbar component.");
    navigate('/login'); // Redirect to login if currentUser is not available
  }

  // console.log("user in rightbar:", currentUser);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  let backend_url = process.env.BACKEND_URL || "http://localhost:4000/api";


  // get all users except the current user
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`${backend_url}/users/online/getUsers`);
        // console.log("Fetched user details in right bar:", res.data);

        // filter out the current user and sort by last online time
        const filteredUsers = res.data.filter(
          (u) => u._id !== currentUser?._id
        )
        // console.log("filtered users list::", filteredUsers)
        setUserDetails(filteredUsers);

      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUserDetails();
  }, []);



  const HomeRightbar = () => {
    return (
      <>

        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.jpg" alt="" />
        <h4 className="rightbarTitle">People You May Know</h4>
        <ul className="rightbarFriendList">
          {userDetails.map((u) => (
            <Online key={u._id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">email:</span>
            <span className="rightbarInfoValue">{currentUser?.email}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">IsAdmin:</span>
            <span className="rightbarInfoValue">{currentUser?.isAdmin ? "Admin" : "User"} </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">User Since:</span>
            <span className="rightbarInfoValue">{format(currentUser?.createdAt)}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User followers</h4>
        <div className="rightbarFollowings">
          {currentUser?.followers?.map((follower) => (
            <div className="rightbarFollowing">
              <img
                src={PF + "persons/person1.jpeg"}
                alt=""
                className="rightbarFollowingImg"
              />
              <span className="rightbarFollowingName">{follower?.username}</span>
            </div>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {profile ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}