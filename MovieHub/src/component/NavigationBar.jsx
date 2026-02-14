import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/NavigationBar.css';
import puter from '@heyputer/puter.js';

const NavigationBar = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const toggleAi = () => {
    setIsAiOpen((s) => !s);
  };

  const closeAi = () => {
    setIsAiOpen(false);
  };

  useEffect(() => {
    if (!isAiOpen) return;
    setAiError('');
  }, [isAiOpen]);

  useEffect(() => {
    if (isAiOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev || '';
      };
    }
    document.body.style.overflow = document.body.style.overflow || '';
    return undefined;
  }, [isAiOpen]);

  const sendToPuter = async (prompt) => {
    if (!prompt || !prompt.trim()) return;
    setAiLoading(true);
    setAiError('');
    // add user message
    setAiMessages((m) => [...m, { from: 'user', text: prompt }]);
    try {
      // require user to be signed in to Puter for ai.chat
      if (!puter?.auth || !puter.auth.isSignedIn || !puter.auth.isSignedIn()) {
        setAiError('Please sign in to Puter to use the AI assistant.');
        setAiLoading(false);
        return;
      }

      let result;
      if (puter?.ai && typeof puter.ai.chat === 'function') {
        result = await puter.ai.chat(prompt, {
                model: "openai/gpt-5.2-chat",
                tools: [{ type: "web_search" }],
            });
      } 
      else {
        throw new Error('Puter.ai.chat not available — check library import');
      }

      let text = null;
      if (result?.message?.content && typeof result.message.content === 'string') {
        text = result.message.content;
        console.log('Result 2: ', text);
      }

      if (!text) text = 'No content returned from AI.';
      text = String(text).trim();

      setAiMessages((m) => [...m, { from: 'ai', text }]);
      setAiLoading(false);
    } catch (err) {
      setAiError(String(err.message || err));
      setAiMessages((m) => [...m, { from: 'ai', text: 'Puter.js unavailable or returned an error.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const onAiInputChange = (value) => {
    setAiInput(value);
  };

  const onAiKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const prompt = aiInput?.trim();
      if (prompt) {
        sendToPuter(prompt);
        setAiInput('');
      }
    }
  };

  const escapeHtml = (str) =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const renderMarkdownToHtml = (text) => {
    if (!text) return '';
    let s = escapeHtml(text);
    s = s.replace(/^##\s*(.+)$/gm, '<h2>$1</h2>');
    s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    s = s.replace(/ {2}\n/g, '<br/>');
    s = s.replace(/\n/g, '<br/>');
    return s;
  };

  const lastAiMessage = (() => {
    for (let i = aiMessages.length - 1; i >= 0; i--) {
      if (aiMessages[i].from === 'ai') return aiMessages[i];
    }
    return null;
  })();

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
    closeSidebar();
  };

  const handleSignInClick = () => {
    navigate('/signin');
    closeSidebar();
  };

  const handleSignOutClick = () => {
    signOut();
    closeSidebar();
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
                className='navbar-search-input'
                aria-label='Search movies'
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

        <div className='flex '>
          <button
            type='button'
            className={`navbar-hamburger ${user ? 'show-always' : ''}`}
            onClick={toggleSidebar}
            aria-label='Menu'
            aria-expanded={isSidebarOpen}
          >
            <svg viewBox='0 0 24 24' fill='currentColor'>
              <path d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' />
            </svg>
          </button>

          <button
            type='button'
            className={`navbar-ai-button ${!user ? 'disabled' : ''}`}
            onClick={user ? toggleAi : undefined}
            aria-label='AI Assistant'
            aria-expanded={isAiOpen}
            disabled={!user}
            aria-disabled={!user}
            title={!user ? 'Sign in to use the AI assistant' : 'AI Assistant'}
          >
            <svg viewBox='0 0 24 24' fill='currentColor' className='navbar-ai-icon' aria-hidden='true'>
              <path d='M12 2.5c.3 0 .6.18.74.46l.92 1.83 1.83.92c.28.14.46.44.46.74s-.18.6-.46.74l-1.83.92-.92 1.83c-.14.28-.44.46-.74.46s-.6-.18-.74-.46l-.92-1.83-1.83-.92c-.28-.14-.46-.44-.46-.74s.18-.6.46-.74l1.83-.92.92-1.83c.14-.28.44-.46.74-.46zm6 9.5c.24 0 .46.14.58.36l.72 1.44 1.44.72c.22.12.36.34.36.58s-.14.46-.36.58l-1.44.72-.72 1.44c-.12.22-.34.36-.58.36s-.46-.14-.58-.36l-.72-1.44-1.44-.72c-.22-.12-.36-.34-.36-.58s.14-.46.36-.58l1.44-.72.72-1.44c.12-.22.34-.36.58-.36zM4 6.5c.18 0 .35.1.44.26l.54 1.08 1.08.54c.16.08.26.26.26.44s-.1.36-.26.44l-1.08.54-.54 1.08c-.08.16-.26.26-.44.26s-.36-.1-.44-.26L2.9 9.8 1.82 9.26C1.66 9.18 1.56 9 1.56 8.82s.1-.36.26-.44L3.3 7.14l.54-1.08c.09-.16.26-.26.44-.26z'/>
            </svg>
          </button>
        </div>        

        {!user && (
          <div className='navbar-actions'>
            <a
              href='https://github.com/KingsleyMe-1/MovieHub'
              target='_blank'
              rel='noopener noreferrer'
              className='navbar-github-link'
              aria-label='GitHub Repository'
            >
              <svg className='navbar-github-icon' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
              </svg>
            </a>

            <button className='navbar-signin-button' onClick={handleSignInClick}>
              SIGN IN
            </button>
          </div>
        )}
      </div>

      {isSidebarOpen && (
        <div 
          className='sidebar-overlay' 
          onClick={closeSidebar}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && closeSidebar()}
          aria-label='Close sidebar'
        />
      )}

      {isAiOpen && (
        <div
          className='sidebar-overlay ai-overlay'
          onClick={closeAi}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && closeAi()}
          aria-label='Close AI sidebar'
        />
      )}

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
          {user && (
            <>
              <div className='sidebar-user-info'>
                <svg className='sidebar-user-icon' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z' />
                </svg>
                  <span className='sidebar-user-name'>{user.name}</span>
              </div>

              <div className='sidebar-divider' />

              <button 
                className='sidebar-link sidebar-watchlist-link' 
                onClick={handleWatchlistClick}
                aria-label={`My Watchlist${user.watchlist?.length ? ` (${getWatchlistCount()} items)` : ''}`}
              >
                <svg className='sidebar-icon' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z' />
                </svg>
                <span>My Watchlist</span>
                {user.watchlist && user.watchlist.length > 0 && (
                  <span className='sidebar-watchlist-badge'>{getWatchlistCount()}</span>
                )}
              </button>
            </>
          )}

          <a
            href='https://github.com/KingsleyMe-1/MovieHub'
            target='_blank'
            rel='noopener noreferrer'
            className='sidebar-link'
            onClick={closeSidebar}
            aria-label='View GitHub Repository'
          >
            <svg className='sidebar-icon' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
            </svg>
            <span>GitHub Repository</span>
          </a>

          {user ? (
            <>
              <div className='sidebar-divider' />
              <button className='sidebar-button sidebar-signout' onClick={handleSignOutClick}>
                <svg viewBox='0 0 24 24' fill='currentColor' className='sidebar-button-icon'>
                  <path d='M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z' />
                </svg>
                SIGN OUT
              </button>
            </>
          ) : (
            <button className='sidebar-button sidebar-signin' onClick={handleSignInClick}>
              <svg viewBox='0 0 24 24' fill='currentColor' className='sidebar-button-icon'>
                <path d='M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z' />
              </svg>
              LOG IN
            </button>
          )}
        </div>
      </div>

      <div className={`ai-sidebar ${isAiOpen ? 'open' : ''}`} aria-hidden={!isAiOpen}>
        <button
          type='button'
          className='sidebar-close'
          onClick={closeAi}
          aria-label='Close AI'
        >
          <svg viewBox='0 0 24 24' fill='currentColor'>
            <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
          </svg>
        </button>

        <button
          type='button'
          className='ai-sidebar-close'
          onClick={closeAi}
          aria-label='Close AI'
        >
          <svg viewBox='0 0 24 24' fill='currentColor'>
            <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
          </svg>
        </button>

        <div className='ai-content'>
          <div className='ai-messages'>
            {aiMessages.map((m, idx) => {
              let raw = '';
              if (typeof m.text === 'string') raw = m.text;
              else if (m.text && typeof m.text === 'object') raw = m.text.content || m.text.text || JSON.stringify(m.text);
              else raw = String(m.text);

              const contentHtml = renderMarkdownToHtml(raw);

              return (
                <div
                  key={idx}
                  className={`ai-message ${m.from === 'user' ? 'user' : 'ai'}`}
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              );
            })}

            {aiLoading && !lastAiMessage && (
              <div className='ai-message ai-loading'>Thinking...</div>
            )}

            {aiError && <div className='ai-error'>{aiError}</div>}
          </div>

          <div className='ai-input-row'>
            <input
              type='text'
              placeholder='Ask the AI about movies (press Enter to send)'
              value={aiInput}
              onChange={(e) => onAiInputChange(e.target.value)}
              onKeyDown={onAiKeyDown}
              className='ai-input'
              aria-label='AI chat input'
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;


