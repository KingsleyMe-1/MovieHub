import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavigationBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchInput);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleSignOutClick = () => {
    signOut();
    closeSidebar();
    closeProfileDropdown();
  };

  const handleWatchlistClick = () => {
    navigate('/watchlist');
    closeSidebar();
  };

  const getWatchlistCount = () => {
    const count = user?.watchlist?.length || 0;
    return count > 9 ? '9+' : count.toString();
  };

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <button
          type='button'
          className='navbar-logo'
          onClick={handleLogoClick}
          aria-label='MovieHub - Go to Homepage'
        >
          <svg
            className='navbar-logo-icon'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
          >
            <path d='M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z' />
            <path
              d='M5.76 10h2.48l.72 1.44L10.4 8H6.48l-.72 3.44M11.76 10h2.48l.72 1.44L16.4 8h-3.92l-.72 3.44'
              opacity='0.6'
            />
          </svg>
          <span className='navbar-brand'>MovieHub</span>
        </button>

        <div className='navbar-search'>
          <form onSubmit={handleSearchSubmit}>
            <div className='navbar-search-wrapper'>
              <input
                type='text'
                placeholder='Search by movie title'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className='navbar-search-input'
              />
              <button type='submit' className='navbar-search-button' aria-label='Search'>
                <svg
                  className='navbar-search-icon'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <circle cx='11' cy='11' r='8' />
                  <path d='m21 21-4.35-4.35' />
                </svg>
              </button>
            </div>
          </form>
        </div>

        <button
          type='button'
          className='navbar-hamburger'
          onClick={toggleSidebar}
          aria-label='Menu'
        >
          <svg viewBox='0 0 24 24' fill='currentColor'>
            <path d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' />
          </svg>
        </button>

        <div className='navbar-actions'>
          {!user && (
            <a
              href='https://github.com/KingsleyMe-1/MovieHub'
              target='_blank'
              rel='noopener noreferrer'
              className='navbar-github-link'
              aria-label='GitHub'
            >
              <svg className='navbar-github-icon' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
              </svg>
            </a>
          )}

          {user && (
            <div className='navbar-watchlist-wrapper'>
              <button
                className='navbar-watchlist-button'
                onClick={handleWatchlistClick}
                aria-label='My Watchlist'
                title='My Watchlist'
              >
                <svg className='navbar-watchlist-icon' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z' />
                </svg>
              </button>
              {user.watchlist && user.watchlist.length > 0 && (
                <span className='watchlist-badge'>{getWatchlistCount()}</span>
              )}
            </div>
          )}

          {user ? (
            <div className='navbar-profile-container'>
              <button
                className='navbar-profile-button'
                onClick={toggleProfileDropdown}
                aria-label='User Profile'
                title={user.name}
              >
                <svg viewBox='0 0 24 24' fill='currentColor' className='navbar-profile-icon'>
                  <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z' />
                </svg>
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div className='profile-dropdown-overlay' onClick={closeProfileDropdown}></div>
                  <div className='profile-dropdown'>
                    <div className='profile-dropdown-header'>
                      <div className='profile-dropdown-avatar'>
                        <svg viewBox='0 0 24 24' fill='currentColor'>
                          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z' />
                        </svg>
                      </div>
                      <div className='profile-dropdown-info'>
                        <p className='profile-dropdown-name'>{user.name}</p>
                        <p className='profile-dropdown-email'>{user.email}</p>
                      </div>
                    </div>

                    <div className='profile-dropdown-divider'></div>

                    <a
                      href='https://github.com/KingsleyMe-1/MovieHub'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='profile-dropdown-link'
                      onClick={closeProfileDropdown}
                    >
                      <svg viewBox='0 0 24 24' fill='currentColor'>
                        <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                      </svg>
                      <span>GitHub Repository</span>
                    </a>

                    <button className='profile-dropdown-signout' onClick={handleSignOutClick}>
                      <svg viewBox='0 0 24 24' fill='currentColor'>
                        <path d='M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z' />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button className='navbar-signin-button' onClick={handleSignInClick}>
              SIGN IN
            </button>
          )}
        </div>
      </div>

      {isSidebarOpen && <div className='sidebar-overlay' onClick={closeSidebar}></div>}

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button
          type='button'
          className='sidebar-close'
          onClick={closeSidebar}
          aria-label='Close menu'
        >
          <svg viewBox='0 0 24 24' fill='currentColor'>
            <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
          </svg>
        </button>

        <div className='sidebar-content'>
          <a
            href='https://github.com/KingsleyMe-1/MovieHub'
            target='_blank'
            rel='noopener noreferrer'
            className='sidebar-link'
            onClick={closeSidebar}
          >
            <svg className='sidebar-icon' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
            </svg>
            <span>GitHub Repository</span>
          </a>

          {user && (
            <div className='sidebar-watchlist-wrapper'>
              <button className='sidebar-link sidebar-watchlist-link' onClick={handleWatchlistClick}>
                <svg className='sidebar-icon' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z' />
                </svg>
                <span>My Watchlist</span>
                {user.watchlist && user.watchlist.length > 0 && (
                  <span className='sidebar-watchlist-badge'>{getWatchlistCount()}</span>
                )}
              </button>
            </div>
          )}

          {user ? (
            <>
              <div className='sidebar-user-info'>
                <span className='sidebar-user-name'>👤 {user.name}</span>
              </div>
              <button className='sidebar-button' onClick={handleSignOutClick}>
                SIGN OUT
              </button>
            </>
          ) : (
            <button
              className='sidebar-button'
              onClick={() => {
                handleSignInClick();
                closeSidebar();
              }}
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;

