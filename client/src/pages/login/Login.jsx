
import React, { useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
// import axios from 'axios';
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [authUser, setAuthUser] = useState(null); // State to hold authenticated user data
  // const navigate = useNavigate(); // Hook for navigation

  const email = useRef();
  const password = useRef();
  const navigate = useNavigate(); // Hook for navigation

  const { currentUser, isFetching, dispatch } = useContext(AuthContext);



  const handleLogin = async (e) => {
    e.preventDefault();
    // loginCall({ email: email.current.value, password: password.current.value }, dispatch);

    try {
      const response = await loginCall({ email: email.current.value, password: password.current.value }, dispatch);
      
      if (response.status === 200) {
        alert(response.data.message);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // setAuthUser(response.data.user); // Update auth state
        console.log("User data saved to local storage after logged in   :", response.data.user);
        navigate('/');
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "An error occurred during login");
    }


    console.log('Login attempt:', { email: email.current.value, password: password.current.value });


    // console.log('LOGIN attempt:', { email, password });

    // axios.post("http://localhost:4000/api/auth/login", { email, password })
    //   .then((res) => {
    //     console.log("Login response:", res.data);
    //     if (res.status === 200) {
    //       alert(res.data.message);
    //       localStorage.setItem("user", JSON.stringify(res.data.user));
    //       setAuthUser(res.data.user); // Update auth state
    //       navigate('/');
    //     }
    //   }).catch((err) => {
    //     alert(err.response?.data?.message || "An error occurred");
    //   })


  };
  // useEffect(() => {
  //   if (currentUser) {
  //     console.log("User logged in on use:", currentUser);
  //     // You can navigate here if needed
  //     navigate("/");
  //   }
  // }, [currentUser]);


  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h3 className="login-logo">Learnify</h3>
          <p className="login-desc">Connect with friends and the world around you.</p>
        </div>
        <form className="login-form">
          {/* <input type="email" placeholder="Email" className="login-input"
            value={email} onChange={(e) => setEmail(e.target.value)} /> */}
          <input type="email" placeholder="Email" className="login-input"
            ref={email} />

          <input type="password" placeholder="Password" className="login-input"
            ref={password} />


          {/* <input type="password" placeholder="Password" className="login-input"
            value={password} onChange={(e) => setPassword(e.target.value)} */}

          <button className="login-button" onClick={handleLogin} disabled={isFetching}>
            {isFetching ? "Logging in..." : "Login"}
          </button>

          {/* <Link to="/">
            <button className="login-button" onClick={handleLogin}>Login</button>
          </Link> */}

          <span className="login-forgot">Forgot Password?</span>
          <Link to="/register">
            <button className="login-register-button">Create a New Account</button>
          </Link>
        </form>
      </div>
    </div>
  );
}