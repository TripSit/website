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
    // Clear tokens from sessionStorage
    sessionStorage.removeItem("kc_token");
    sessionStorage.removeItem("kc_refresh_token");
    sessionStorage.removeItem("kc_id_token");

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

  // Legacy stylesheet is unlayered and beats Tailwind's @layer utilities on
  // the cascade, so colors that must hold are set inline (inline wins both)
  const showAvatar = isLoggedIn && !isLoadingAvatar;

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip title={isLoggedIn ? "Account" : "Login"} placement="bottom">
        <button
          className="flex h-10 w-10 cursor-pointer appearance-none items-center justify-center overflow-hidden rounded-full bg-cover bg-center p-0 text-lg text-mute transition hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          onClick={toggleDropdown}
          aria-label={isLoggedIn ? "Account menu" : "Login"}
          style={{
            border: "1px solid var(--color-line)",
            background: "var(--color-surface)",
            ...(showAvatar && { backgroundImage: `url(${avatarUrl})` }),
          }}
        >
          {isLoadingAvatar ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-cyan" />
          ) : (
            !isLoggedIn && <i className="bi bi-person-fill" aria-hidden />
          )}
        </button>
      </Tooltip>

      {isLoggedIn && isDropdownOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-2 min-w-32 overflow-hidden rounded-xl bg-surface p-1 shadow-2xl shadow-night/60"
          style={{ border: "1px solid var(--color-line)" }}
        >
          <button
            className="flex w-full cursor-pointer appearance-none items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink transition hover:bg-violet/15 hover:text-cyan"
            onClick={handleLogout}
            style={{ border: "none", background: "none" }}
          >
            <i className="bi bi-box-arrow-right" aria-hidden />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
