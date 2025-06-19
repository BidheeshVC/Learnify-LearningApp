import React, { useContext, useEffect } from 'react'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css"
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();
  const {currentUser} =  useContext(AuthContext)
  console.log("user in home component: ", currentUser);

  if (!currentUser) {
    navigate("/login");
    console.log("User not found in home component");
  }
    



  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed />
        <Rightbar />
      </div>
    </>
  )
}

export default Home