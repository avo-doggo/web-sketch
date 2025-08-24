import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Home.css"; 

export  function Home() {
  // --- Login State ---
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  // --- Sign-Up State ---
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  // --- Handlers ---
  const handleLogin = () => {
    const storedUser = JSON.parse(sessionStorage.getItem("userInfo"));

    if (
      storedUser &&
      loginUsername === storedUser.username &&
      loginPassword === storedUser.password
    ) {
      alert("Login successful!");
      navigate("/account"); // redirect to account page
    } else {
      alert("Invalid username or password.");
    }
  };

  const handleSignUp = () => {
    if (!signUpUsername || !signUpPassword) {
      alert("Please enter both username and password.");
      return;
    }

    const newUser = {
      username: signUpUsername,
      password: signUpPassword,
      fullName: "",
      email: "",
      phone: "",
      language: "English",
      isPublic: true,
    };

    sessionStorage.setItem("userInfo", JSON.stringify(newUser));
    alert("Sign-up successful! You can now log in.");
    setSignUpOpen(false);
    setSignUpUsername("");
    setSignUpPassword("");
  };

  return (
    <div className="home-container">
      <h1 className="intro-text">Welcome <br/> to <br/>WebSketch!</h1>
      

      {/* Login Button */}
      <button className="login-btn" onClick={() => setLoginOpen(true)}>
        Log In
      </button>

      {/* Sign-Up Section */}
      <p className="no-account-text">Don't have an account?</p>
      <button className="signup-btn" onClick={() => setSignUpOpen(true)}>
        Sign Up
      </button>
     
      <p className="hint-text">*Hint = press the logo in the top corner for the menu!</p>
      {/* Login Popup */}
      {loginOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Log In</h2>
            <label>
              Username:
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </label>
            <button onClick={handleLogin}>Log In</button>
            <button onClick={() => setLoginOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Sign-Up Popup */}
      {signUpOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Sign Up</h2>
            <label>
              Username:
              <input
                type="text"
                value={signUpUsername}
                onChange={(e) => setSignUpUsername(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
              />
            </label>
            <button onClick={handleSignUp}>Sign Up</button>
            <button onClick={() => setSignUpOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
