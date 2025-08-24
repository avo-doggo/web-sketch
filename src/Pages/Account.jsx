import React, { useState, useEffect } from "react";
import "../Styles/Account.css";

export function Account() {
  const [activeTab, setActiveTab] = useState("general");

  // Load user info from sessionStorage
  const [userInfo, setUserInfo] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    language: "English",
    isPublic: true,
    password: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    text: false,
    updates: true,
    highlights: false,
    news: true,
  });

  const [theme, setTheme] = useState("light");


  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("userInfo"));
    if (storedUser) setUserInfo(storedUser);
  }, []);

  const handleChange = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
    sessionStorage.setItem(
      "userInfo",
      JSON.stringify({ ...userInfo, [field]: value })
    );
  };

  return (
    <div className="account-page">
      <h1>Account Settings</h1>

      <div className="tabs">
        {["general", "security", "notifications", "settings"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {/* GENERAL - READ ONLY */}
        {activeTab === "general" && (
          <div className="general-tab">
            <p>
              <strong>Username:</strong> {userInfo.username}
            </p>
            <p>
              <strong>Full Name:</strong> {userInfo.fullName}
            </p>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {userInfo.phone}
            </p>
            <p>
              <strong>Language:</strong> {userInfo.language}
            </p>
            <p>
              <strong>Account Visibility:</strong>{" "}
              {userInfo.accountVisibility ? "Public" : "Private"}
            </p>
          </div>
        )}

       {/* SECURITY */}
{activeTab === "security" && (
  <div className="security-tab">
    <label>
      Change Username:
      <input
        type="text"
        value={userInfo.username}
        onChange={(e) => handleChange("username", e.target.value)}
      />
    </label>
    <label>
      Change Password:
      <input
        type="password"
        value={userInfo.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />
    </label>
    <label>
      Change Email:
      <input
        type="email"
        value={userInfo.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
    </label>
    <label>
      Change Phone Number:
      <input
        type="tel"
        value={userInfo.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
      />
    </label>
    <label>
      Change Name:
      <input
        type="text"
        value={userInfo.fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
      />
    </label>
  </div>
)}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="notifications-tab">
            {Object.keys(notifications).map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={notifications[key]}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [key]: e.target.checked,
                    })
                  }
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
        )}

{/* SETTINGS */}
{activeTab === "settings" && (
  <div className="settings-tab">
    <label>
      Theme:
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>

    <label>
      Account Visibility:
      <select
        value={userInfo.accountVisibility ? "Public" : "Private"}
        onChange={(e) =>
          handleChange(
            "accountVisibility",
            e.target.value === "Public" ? true : false
          )
        }
      >
        <option value="Public">Public</option>
        <option value="Private">Private</option>
      </select>
    </label>

    <label>
      Language:
      <input
        type="text"
        value={userInfo.language}
        onChange={(e) => handleChange("language", e.target.value)}
      />
    </label>
  </div>
)}

      </div>
    </div>
  );
}
