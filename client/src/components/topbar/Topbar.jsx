import React, { useContext } from "react";
import "./topbar.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Logout } from "../../context/AuthActions"; // Import the Logout action
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation


export default function Topbar() {

  const { dispatch } = useContext(AuthContext);

  const { currentUser } = useContext(AuthContext)

  const navigate = useNavigate(); // useNavigate hook to programmatically navigate
  // console.log("currentUser in topbar component: ", currentUser);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleLogout = () => {
    dispatch(Logout());  // this will call reducer and remove the user
    navigate("/login");
  };



  // const [user, setUser] = useState(null); // to store user data from local storage

  // get user data from local storage
  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   console.log("User data from local storage:------------------------------", user);

  //   if (user) {

  //     user.userId = user._id; // Assuming you want to set userId to _id
  //     setUser(user);
  //   } else {
  //     console.log("User not found in local storage");
  //   }
  // }, []);

  // console.log("userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr1:", user);

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
        {/* <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
          <Link
            to="/login"
            style={{ textDecoration: "none" }}
          >
            <span className="topbarLink">Login</span>
          </Link>
          <Link
            to="/register"
            style={{ textDecoration: "none" }}
          >
            <span className="topbarLink">Register</span>
          </Link>
        </div> */}
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
            <button onClick={handleLogout}>
              Logout
            </button>
          </div>

        </div>
        <Link to={`/profile/`}>
          <img
            src={currentUser?.profilePicture ? currentUser.profilePicture : PF + "/persons/person2.jpeg"}
            alt=""
            className="topbarImg"
          />
        </Link>

      </div>
    </div>
  );
}




// import React, { useEffect, useState } from "react";
// import "./topbar.css";
// import SearchIcon from "@mui/icons-material/Search";
// import PersonIcon from "@mui/icons-material/Person";
// import ChatIcon from "@mui/icons-material/Chat";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import { Link, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // ✅ Make sure to import this

// export default function Topbar() {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate(); // ✅ Correctly initialize navigate

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     console.log("User data from local storage:------------------------------", user);

//     if (user) {
//       user.userId = user._id;
//       setUser(user);
//     } else {
//       console.log("User not found in local storage");
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//     toast.success("Logout successful!", { position: "top-center" });

//     setTimeout(() => {
//       navigate("/login");
//     }, 2000);
//   };

//   return (
//     <div className="topbarContainer">
//       <div className="topbarLeft">
//         <Link to="/" style={{ textDecoration: "none" }}>
//           <span className="logo">Learnify</span>
//         </Link>
//       </div>
//       <div className="topbarCenter">
//         <div className="searchbar">
//           <SearchIcon className="searchIcon" />
//           <input
//             placeholder="Search for friend, post or video"
//             className="searchInput"
//           />
//         </div>
//       </div>
//       <div className="topbarRight">
//         <div className="topbarLinks">
//           <span className="topbarLink">Homepage</span>
//           <span className="topbarLink">Timeline</span>
//           <Link to="/login" style={{ textDecoration: "none" }}>
//             <span className="topbarLink">Login</span>
//           </Link>
//           <Link to="/register" style={{ textDecoration: "none" }}>
//             <span className="topbarLink">Register</span>
//           </Link>
//           <span onClick={handleLogout} className="topbarLink">Logout</span>
//         </div>
//         <div className="topbarIcons">
//           <div className="topbarIconItem">
//             <PersonIcon />
//             <span className="topbarIconBadge">1</span>
//           </div>
//           <div className="topbarIconItem">
//             <ChatIcon />
//             <span className="topbarIconBadge">2</span>
//           </div>
//           <div className="topbarIconItem">
//             <NotificationsIcon />
//             <span className="topbarIconBadge">1</span>
//           </div>
//         </div>
//         <Link to="/profile" state={{ user }}>
//           <img
//             src="https://i.redd.it/y9tnx8bau3i71.jpg"
//             alt=""
//             className="topbarImg"
//           />
//         </Link>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// }

