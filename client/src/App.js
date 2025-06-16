import React, { useContext } from 'react'
import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import Home from './pages/home/Home'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from './pages/register/RegisterPage'
import { AuthContext } from './context/AuthContext'
import './index.css'; // or './App.css'
import SavedPost from './components/savedPosts/SavedPost'
import SavePostPage from './pages/savePosts/SavePostPage'
import CoursesPage from './pages/courses/CoursesPage'



const App = () => {

  const { currentUser } = useContext(AuthContext)
  // console.log("currentUser in app component:", currentUser);

       if (!currentUser || currentUser == null) {
          console.log("No current user found, redirecting to login page.");
          return <Navigate to="/login" replace />;
      }


  return (
    <>
      <Router>
        <Routes>
          <Route path="/"
            element={currentUser ? <Home /> : <RegisterPage />} />

          <Route path="/login"
            element={currentUser ? <Navigate to="/" /> : <Login />} />

          <Route path="/register"
            element={currentUser ? <Navigate to="/" /> : <RegisterPage />} />

          <Route path={`/profile`} element={<Profile />} />

          <Route path={`/savedposts`} element={<SavePostPage/>} />

          <Route path={`/courses`} element={<CoursesPage/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
