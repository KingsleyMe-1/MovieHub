import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('moviehub_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('moviehub_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = (email, password) => {
    if (email && password) {
      const userData = {
        id: Date.now(),
        email: email,
        name: email.split('@')[0],
        favorites: [],
        watchlist: [],
      };
      setUser(userData);
      localStorage.setItem('moviehub_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signUp = (name, email, password) => {
    if (name && email && password) {
      const userData = {
        id: Date.now(),
        email: email,
        name: name,
        favorites: [],
        watchlist: [],
      };
      setUser(userData);
      localStorage.setItem('moviehub_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'All fields are required' };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('moviehub_user');
  };

  const addToFavorites = (movieId) => {
    if (user) {
      const updatedUser = {
        ...user,
        favorites: user.favorites.includes(movieId)
          ? user.favorites.filter((id) => id !== movieId)
          : [...user.favorites, movieId],
      };
      setUser(updatedUser);
      localStorage.setItem('moviehub_user', JSON.stringify(updatedUser));
    }
  };

  const addToWatchlist = (movieId) => {
    if (user) {
      const updatedUser = {
        ...user,
        watchlist: user.watchlist.includes(movieId)
          ? user.watchlist.filter((id) => id !== movieId)
          : [...user.watchlist, movieId],
      };
      setUser(updatedUser);
      localStorage.setItem('moviehub_user', JSON.stringify(updatedUser));
    }
  };

  const isFavorite = (movieId) => {
    return user?.favorites?.includes(movieId) || false;
  };

  const isInWatchlist = (movieId) => {
    return user?.watchlist?.includes(movieId) || false;
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    addToFavorites,
    addToWatchlist,
    isFavorite,
    isInWatchlist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
