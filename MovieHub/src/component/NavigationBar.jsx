import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavigationBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchInput);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSignInClick = () => {
    navigate("/signin");
  };

  const handleSignOutClick = () => {
    signOut();
    closeSidebar();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <button type="button" className="navbar-logo" onClick={handleLogoClick} aria-label="MovieHub - Go to Homepage">
          <svg
            className="navbar-logo-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
            <path d="M5.76 10h2.48l.72 1.44L10.4 8H6.48l-.72 3.44M11.76 10h2.48l.72 1.44L16.4 8h-3.92l-.72 3.44" opacity="0.6" />
          </svg>
          <span className="navbar-brand">MovieHub</span>
        </button>

        {/* Search Bar */}
        <div className="navbar-search">
          <form onSubmit={handleSearchSubmit}>
            <div className="navbar-search-wrapper">
              <input
                type="text"
                placeholder="Search by movie title"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="navbar-search-input"
              />
              <button
                type="submit"
                className="navbar-search-button"
                aria-label="Search"
              >
                <svg
                  className="navbar-search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Hamburger Menu Button (Mobile Only) */}
        <button 
          type="button"
          className="navbar-hamburger"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>

        {/* Right Section (Desktop) */}
        <div className="navbar-actions">
          <a
            href="https://github.com/KingsleyMe-1/MovieHub"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-github-link"
            aria-label="GitHub"
          >
            <svg
              className="navbar-github-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>

          {user ? (
            <div className="navbar-user-menu">
              <span className="navbar-user-name">👤 {user.name}</span>
              <button className="navbar-signout-button" onClick={handleSignOutClick}>
                SIGN OUT
              </button>
            </div>
          ) : (
            <button className="navbar-signin-button" onClick={handleSignInClick}>
              SIGN IN
            </button>
          )}
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button 
          type="button"
          className="sidebar-close"
          onClick={closeSidebar}
          aria-label="Close menu"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <div className="sidebar-content">
          <a
            href="https://github.com/KingsleyMe-1/MovieHub"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-link"
            onClick={closeSidebar}
          >
            <svg
              className="sidebar-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>GitHub Repository</span>
          </a>

          {user ? (
            <>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">👤 {user.name}</span>
              </div>
              <button className="sidebar-button" onClick={handleSignOutClick}>
                SIGN OUT
              </button>
            </>
          ) : (
            <button className="sidebar-button" onClick={() => { handleSignInClick(); closeSidebar(); }}>
              SIGN IN
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;


