import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import axios from 'axios';


export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (confirmPassword.current.value !== password.current.value) {
      confirmPassword.current.setCustomValidity("Passwords do not match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      // console.log('SIGNUP attempt in register page:', user);
      try {
         await axios.post("http://localhost:4000/api/auth/register", user);
        //  console.log("SIGNUP attempt in register page:", user);

         navigate('/login'); 
      } catch (err) {
        console.log(err);
      }

    }
    
  }


  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");

  // const navigate = useNavigate(); // Hook for navigation



  // const handleSignup = (e) => {
  //   e.preventDefault();

  //   console.log('SIGNUP attempt:', { username, email, password, confirmPassword });
  //   // Validation checks
  //   if (!username || !email || !password || !confirmPassword) {
  //     alert("Please fill in all fields")
  //     return;
  //   }
  //   // check if the password and confirm password match
  //   if (password !== confirmPassword) {
  //     alert("Passwords do not match!");
  //     return;
  //   }
  //   axios.post("http://localhost:4000/api/auth/register", { username, email, password })
  //     .then((res) => {
  //       if (res.status == 200) {
  //         alert("User registered successfully")
  //         console.log("User registered successfully")
  //         // alert(res.data.message)
  //       }
  //       console.log("res data", res.data)
  //       navigate('/login');
  //     }).catch((err) => {
  //       // console.log("error on catch:", err)
  //       alert(err.response.data.message)
  //       // alert("Internal server error")
  //     })
  // };

  return (
    <div className="register-container">
      <form action="" onSubmit={handleSignup}>
        <div className="register-box">
          <div className="register-header">
            <h3 className="register-logo">Lamasocial</h3>
            <p className="register-desc">Connect with friends and the world around you.</p>
          </div>
          <div className="register-form">
            <input type="text" placeholder="Username" className="register-input"
              ref={username} required />
              <input type="email" placeholder="Email" className="register-input"
              ref={email} required />
              <input type="password" placeholder="Password" className="register-input"
              ref={password} required />
              <input type="password" placeholder="Confirm Password" className="register-input"
              ref={confirmPassword} required />
              <button className="register-button" type="submit">Sign Up</button>
            <div className="register-login-text">Already have an account?</div>
            <Link to="/login">
              <button className="register-login-button">Login to Account</button>
            </Link>
          </div>



        
          {/* <div className="register-form">
            <input type="text" placeholder="Username" className="register-input"
              value={username} onChange={(e) => setUsername(e.target.value)} />

            <input type="email" placeholder="Email" className="register-input"
              value={email} onChange={(e) => setEmail(e.target.value)} />

            <input type="password" placeholder="Password" className="register-input"
              value={password} onChange={(e) => setPassword(e.target.value)} />

            <input type="password" placeholder="Confirm Password" className="register-input"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

            <button className="register-button" type="submit">Sign Up</button>
            <div className="register-login-text">Already have an account?</div>
            <Link to="/login">
              <button className="register-login-button">Login to Account</button>
            </Link>
          </div> */}
        </div>
      </form>
    </div>
  );
}