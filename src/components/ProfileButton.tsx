import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import { getLoginUrl, getLogoutUrl } from '@/utils/keycloak';

const ProfileButton: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if user is logged in by checking for tokens
  useEffect(() => {
    const token = localStorage.getItem('kc_token') || sessionStorage.getItem('kc_token');
    setIsLoggedIn(!!token);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    // Redirect to Keycloak login
    window.location.href = getLoginUrl();
  };

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem('kc_token');
    localStorage.removeItem('kc_refresh_token');
    sessionStorage.removeItem('kc_token');
    sessionStorage.removeItem('kc_refresh_token');
    
    // Update state
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    
    // window.location.reload();
    window.location.href = getLogoutUrl();
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
      <Tooltip
        title={isLoggedIn ? "Account" : "Login"}
        placement="bottom"
      >
        <button
          className="profile-button"
          onClick={toggleDropdown}
          aria-label={isLoggedIn ? "Account menu" : "Login"}
        >
          <Image
            src="/assets/img/guest.png"
            alt="Profile"
            width={48}
            height={48}
            className="profile-image"
          />
        </button>
      </Tooltip>

      {isLoggedIn && isDropdownOpen && (
        <div className="profile-dropdown">
          <button
            className="dropdown-item"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      )}

      <style jsx>{`
        .profile-button-container {
          position: relative;
          display: inline-block;
        }

        .profile-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 20px;
          overflow: hidden;
        }

        .profile-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }

        .profile-image {
          border-radius: 50%;
          object-fit: cover;
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