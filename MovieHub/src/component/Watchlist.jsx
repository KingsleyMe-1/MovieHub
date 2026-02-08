import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWatchlistMovies, clearWatchlist } from '../store/movieSlice';
import { useAuth } from '../context/AuthContext';
import Navbar from './NavigationBar';
import MovieCard from './MovieCard';
import SkeletonLoader from './Loader';
import '../styles/NavigationBar.css';
import '../styles/Watchlist.css';

const Watchlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, addToWatchlist } = useAuth();
  const { watchlistMovies, loadingWatchlist, errorMessage } = useSelector((state) => state.movies);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (user.watchlist && user.watchlist.length > 0) {
      dispatch(fetchWatchlistMovies(user.watchlist));
    } else {
      dispatch(clearWatchlist());
    }
  }, [user, navigate, dispatch]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleRemoveFromWatchlist = (e, movieId) => {
    e.stopPropagation();
    addToWatchlist(movieId);
  };

  if (!user) {
    return null;
  }

  return (
    <main>
      <Navbar />

      <div className='wrapper'>
        <div className='watchlist-container'>
          <div className='watchlist-header'>
            <h2>My Watchlist</h2>
          </div>

          {loadingWatchlist ? (
            <div className='all-movies'>
              <SkeletonLoader count={12} />
            </div>
          ) : errorMessage ? (
            <p className='error-message'>{errorMessage}</p>
          ) : watchlistMovies.length === 0 ? (
            <div className='empty-watchlist'>
              <div className='empty-icon'>
                <svg viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z' />
                </svg>
              </div>
              <h3>Your watchlist is empty</h3>
              <p>Add movies to your watchlist to watch them later</p>
              <button className='browse-btn' onClick={() => navigate('/')}>
                Browse Movies
              </button>
            </div>
          ) : (
            <section className='all-movies'>
              <ul className='mt-4'>
                {watchlistMovies.map((movie) => (
                  <li
                    key={movie.id}
                    onClick={() => handleMovieClick(movie.id)}
                    className='watchlist-item'
                  >
                    <button
                      className='remove-btn'
                      onClick={(e) => handleRemoveFromWatchlist(e, movie.id)}
                      aria-label='Remove from watchlist'
                      title='Remove from watchlist'
                    >
                      <svg viewBox='0 0 24 24' fill='currentColor'>
                        <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
                      </svg>
                    </button>
                    <MovieCard movie={movie} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default Watchlist;

