import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/SignIn.css';

const SignIn = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { signIn, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSignInWithPuter = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    const result = await signIn();
    setIsSigningIn(false);
    if (result?.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className='signin-page'>
      <div className='signin-background-pattern'></div>
      <div className='signin-container'>
        <div className='signin-header'>
          <h2>Welcome to MovieHub</h2>
          <p className='signin-subtitle'>
            Sign in with your Puter account to save favorites and manage your watchlist
          </p>
        </div>

        {authError && <div className='error-message'>{authError}</div>}

        <form onSubmit={handleSignInWithPuter} className='signin-form'>
          <button
            type='submit'
            className='signin-btn signin-btn-puter'
            disabled={isSigningIn}
            aria-busy={isSigningIn}
          >
            {isSigningIn ? 'Signing in…' : 'Sign in with Puter'}
          </button>
        </form>

        <div className='signin-footer'>
          <p className='signin-footer-text'>
            A secure Puter window will open to sign in or create an account. Your Puter account
            powers your MovieHub profile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
