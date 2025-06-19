import React, { useContext } from "react";
import "./topbar.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Logout } from "../../context/AuthActions"; // Import the Logout action
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation


export default function Topbar() {

    const { dispatch } = useContext(AuthContext);

    const { currentUser } = useContext(AuthContext)

    const navigate = useNavigate(); // useNavigate hook to programmatically navigate
    // console.log("currentUser in topbar component: ", currentUser);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

     if (!currentUser || currentUser == null) {
        console.log("No current user found, redirecting to login page.");
        return <Navigate to="/login" replace />;
    }


    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span className="logo">Learnify</span>
                </Link>
            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                    <SearchIcon className="searchIcon" />
                    <input
                        placeholder="Search for friend, post or video"
                        className="searchInput"
                    />
                </div>
            </div>
            <div className="topbarRight">
             
                <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <PersonIcon />
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div className="topbarIconItem">
                        <ChatIcon />
                        <span className="topbarIconBadge">2</span>
                    </div>
                    <div className="topbarIconItem">
                        <NotificationsIcon />
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div className="topbarIconItem">

                    </div>

                </div>
                {/* <Link to={`/profile/`}> */}
                <Link to="/profile" state={{ post: currentUser }}>
                    <img
                        src={currentUser?.profilePicture
                            ? currentUser?.profilePicture
                            : PF + "/persons/person2.jpeg"}
                        alt=""
                        className="topbarImg"
                    />
                </Link>

            </div>
        </div>
    );
}



