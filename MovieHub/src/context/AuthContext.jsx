import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import puter from '@heyputer/puter.js';

/** Path for user's watchlist and favorites in Puter cloud storage (relative to user's app root). */
const MOVIEHUB_DATA_PATH = 'moviehub_data.json';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const defaultUserData = () => ({ favorites: [], watchlist: [] });

/**
 * Read favorites and watchlist from Puter cloud storage (puter.fs.read).
 * Returns default empty data if file does not exist or read fails.
 */
async function loadUserDataFromCloud() {
  if (!puter.auth.isSignedIn()) return defaultUserData();
  try {
    const blob = await puter.fs.read(MOVIEHUB_DATA_PATH);
    const text = await blob.text();
    const parsed = JSON.parse(text);
    return {
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      watchlist: Array.isArray(parsed.watchlist) ? parsed.watchlist : [],
    };
  } catch (error) {
    if (error?.code !== 'NOT_FOUND' && error?.message?.toLowerCase?.() !== 'not found') {
      console.error('Error reading MovieHub data from cloud:', error);
    }
    return defaultUserData();
  }
}

/**
 * Write favorites and watchlist to Puter cloud storage (puter.fs.write).
 */
async function saveUserDataToCloud(data) {
  if (!puter.auth.isSignedIn()) return;
  try {
    await puter.fs.write(MOVIEHUB_DATA_PATH, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving MovieHub data to cloud:', error);
    throw error;
  }
}

/**
 * Delete the MovieHub data file from Puter cloud (e.g. when user clears all data).
 */
async function deleteUserDataFromCloud() {
  if (!puter.auth.isSignedIn()) return;
  try {
    await puter.fs.delete(MOVIEHUB_DATA_PATH);
  } catch (error) {
    if (error?.code !== 'NOT_FOUND' && error?.message?.toLowerCase?.() !== 'not found') {
      console.error('Error deleting MovieHub data from cloud:', error);
    }
  }
}

/**
 * Map Puter user object to our app user shape, with cloud-loaded favorites and watchlist.
 */
function mapPuterUserToAppUser(puterUser, cloudData) {
  const data = cloudData ?? defaultUserData();
  return {
    id: puterUser?.uuid,
    uuid: puterUser?.uuid,
    email: puterUser?.email ?? puterUser?.username ?? '',
    name: puterUser?.username ?? puterUser?.name ?? 'User',
    favorites: data.favorites,
    watchlist: data.watchlist,
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [cloudError, setCloudError] = useState(null);

  /** Ref so queued saves always read the latest state (avoids concurrent writes overwriting each other). */
  const userRef = useRef(null);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  /** Sequential save queue: each save runs after the previous one and writes current userRef state. */
  const savePromiseRef = useRef(Promise.resolve());
  const enqueueCloudSave = useCallback(() => {
    const promise = savePromiseRef.current.then(async () => {
      const u = userRef.current;
      if (!u?.uuid) return;
      await saveUserDataToCloud({ favorites: u.favorites, watchlist: u.watchlist });
    });
    savePromiseRef.current = promise;
    return promise;
  }, []);

  const syncUserFromPuter = useCallback(async () => {
    if (!puter.auth.isSignedIn()) {
      setUser(null);
      setCloudError(null);
      return;
    }
    try {
      const [puterUser, cloudData] = await Promise.all([
        puter.auth.getUser(),
        loadUserDataFromCloud(),
      ]);
      const appUser = mapPuterUserToAppUser(puterUser, cloudData);
      setUser(appUser);
      setAuthError(null);
      setCloudError(null);
    } catch (error) {
      console.error('Error syncing user:', error);
      setUser(null);
      setAuthError(error?.msg || error?.message || 'Failed to get user');
    }
  }, []);

  useEffect(() => {
    // Remove legacy PII from localStorage (no longer used; reduces breach risk)
    try {
      localStorage.removeItem('moviehub_user');
    } catch (_) {}

    const init = async () => {
      if (puter.auth.isSignedIn()) {
        await syncUserFromPuter();
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    init();
  }, [syncUserFromPuter]);

  /**
   * Sign in via Puter (opens popup). Must be called from a user gesture.
   */
  const signIn = async () => {
    setAuthError(null);
    try {
      await puter.auth.signIn();
      await syncUserFromPuter();
      return { success: true };
    } catch (error) {
      const msg = error?.msg || error?.message || 'Sign in failed';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const signOut = () => {
    puter.auth.signOut();
    setUser(null);
    setAuthError(null);
    setCloudError(null);
  };

  const addToFavorites = async (movieId) => {
    if (!user?.uuid) return;
    const nextFavorites = user.favorites.includes(movieId)
      ? user.favorites.filter((id) => id !== movieId)
      : [...user.favorites, movieId];
    const nextUser = { ...user, favorites: nextFavorites };
    setUser(nextUser);
    userRef.current = nextUser;
    try {
      await enqueueCloudSave();
      setCloudError(null);
    } catch (err) {
      setCloudError('Failed to sync favorites to cloud');
    }
  };

  const addToWatchlist = async (movieId) => {
    if (!user?.uuid) return;
    const nextWatchlist = user.watchlist.includes(movieId)
      ? user.watchlist.filter((id) => id !== movieId)
      : [...user.watchlist, movieId];
    const nextUser = { ...user, watchlist: nextWatchlist };
    setUser(nextUser);
    userRef.current = nextUser;
    try {
      await enqueueCloudSave();
      setCloudError(null);
    } catch (err) {
      setCloudError('Failed to sync watchlist to cloud');
    }
  };

  const isFavorite = (movieId) => {
    return user?.favorites?.includes(movieId) ?? false;
  };

  const isInWatchlist = (movieId) => {
    return user?.watchlist?.includes(movieId) ?? false;
  };

  const value = {
    user,
    loading,
    authError,
    cloudError,
    signIn,
    signOut,
    addToFavorites,
    addToWatchlist,
    isFavorite,
    isInWatchlist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
