import React, { useState, useEffect, useRef } from "react";
import { Tooltip } from "@mui/material";
import { getLoginUrl, getPostLogoutUrl } from "@/utils/keycloak";

const GUEST_AVATAR_PATH = "/assets/img/guest.png";

const ProfileButton: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(GUEST_AVATAR_PATH);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if user is logged in by checking for tokens
  useEffect(() => {
    const checkLoginStatus = () => {
      const token =
        localStorage.getItem("kc_token") || sessionStorage.getItem("kc_token");
      setIsLoggedIn(!!token);
    };

    // Check initially
    checkLoginStatus();

    // Listen for storage changes (localStorage only)
    window.addEventListener("storage", checkLoginStatus);

    // Listen for focus events (when user returns from login)
    window.addEventListener("focus", checkLoginStatus);

    // Custom event listener for when tokens are set programmatically
    window.addEventListener("tokensUpdated", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("focus", checkLoginStatus);
      window.removeEventListener("tokensUpdated", checkLoginStatus);
    };
  }, []);

  // Fetch avatar when login status changes
  useEffect(() => {
    const fetchAvatar = async () => {
      const token =
        localStorage.getItem("kc_token") || sessionStorage.getItem("kc_token");
      if (!token || !isLoggedIn) {
        setAvatarUrl(GUEST_AVATAR_PATH);
        return;
      }

      setIsLoadingAvatar(true);
      try {
        const response = await fetch("/api/v2/users/avatar", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAvatarUrl(data.avatarUrl);
        } else {
          // Error fetching avatar, use default
          setAvatarUrl(GUEST_AVATAR_PATH);
        }
      } catch {
        // Error fetching avatar, use default
        setAvatarUrl(GUEST_AVATAR_PATH);
      } finally {
        setIsLoadingAvatar(false);
      }
    };

    if (isLoggedIn) {
      fetchAvatar();
    } else {
      setAvatarUrl(GUEST_AVATAR_PATH);
    }
  }, [isLoggedIn]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem("kc_token");
    localStorage.removeItem("kc_refresh_token");
    sessionStorage.removeItem("kc_token");
    sessionStorage.removeItem("kc_refresh_token");

    // Reset avatar
    setAvatarUrl(GUEST_AVATAR_PATH);

    // Update state
    setIsLoggedIn(false);
    setIsDropdownOpen(false);

    // Notify other components about token changes
    window.dispatchEvent(new Event("tokensUpdated"));

    window.location.href = getPostLogoutUrl();
  };

  const toggleDropdown = () => {
    if (!isLoggedIn) {
      handleLogin();
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    <div className="profile-button-container" ref={dropdownRef}>
      <Tooltip title={isLoggedIn ? "Account" : "Login"} placement="bottom">
        <button
          className="profile-button"
          onClick={toggleDropdown}
          aria-label={isLoggedIn ? "Account menu" : "Login"}
          style={
            !isLoadingAvatar
              ? {
                  backgroundImage: `url(${avatarUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }
              : {}
          }
        >
          {isLoadingAvatar && (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}
        </button>
      </Tooltip>

      {isLoggedIn && isDropdownOpen && (
        <div className="profile-dropdown">
          <button className="dropdown-item" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      )}

      <style jsx>{`
        .profile-button-container {
          position: relative;
        }

        .profile-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 20px;
        }

        .profile-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }

        .loading-spinner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .profile-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: #2c3e50;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          min-width: 120px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          overflow: hidden;
        }

        .dropdown-item {
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          color: #fff;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          transition: background-color 0.2s ease;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .dropdown-item i {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default ProfileButton;
