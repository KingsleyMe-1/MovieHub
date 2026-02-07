import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/MovieDetails.css';
import SimilarMovies from './SimilarMovies';
import MovieDetailsLoader from './MovieDetailsLoader';

const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { user, addToWatchlist, addToFavorites, isInWatchlist, isFavorite } = useAuth();
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movieId]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const API_KEY = import.meta.env.VITE_API_TMDB_KEY;
        const API_URL = 'https://api.themoviedb.org/3';
        const API_OPTIONS = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        };

        const endpoint = `${API_URL}/movie/${movieId}?append_to_response=credits,reviews,videos`;
        const response = await fetch(endpoint, API_OPTIONS);
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }

        setMovieData(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch movie details');
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  if (loading) {
    return <MovieDetailsLoader />;
  }

  if (error) {
    return (
      <div className='details-page'>
        <div className='error-container'>
          <p className='error-message'>{error}</p>
          <button onClick={() => navigate(-1)} className='back-btn'>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movieData) {
    return null;
  }

  const {
    title,
    overview,
    poster_path,
    backdrop_path,
    release_date,
    runtime,
    vote_average,
    vote_count,
    budget,
    revenue,
    original_language,
    genres,
    credits,
    reviews,
  } = movieData;

  const directorInfo = credits?.crew?.find((person) => person.job === 'Director')?.name;
  const cast = credits?.cast?.slice(0, 6) || [];
  const trailer = movieData.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const handleDisabledWatchlistClick = () => {
    showToast('Sign in to Add to Watchlist');
  };

  const handleDisabledFavoritesClick = () => {
    showToast('Sign in to Add to Favorites');
  };

  const handleAddToWatchlist = () => {
    if (!user) {
      return;
    }
    addToWatchlist(parseInt(movieId));
  };

  const handleAddToFavorites = () => {
    if (!user) {
      return;
    }
    addToFavorites(parseInt(movieId));
  };

  return (
    <div className='details-page'>
      <button className='back-btn' onClick={() => navigate(-1)}>
        ← Back
      </button>

      {backdrop_path && (
        <div className='movie-backdrop'>
          <img src={`https://image.tmdb.org/t/p/w1280/${backdrop_path}`} alt={title} />
          <div className='backdrop-overlay'></div>
        </div>
      )}

      <div className='details-container'>
        <div className='details-header'>
          {poster_path && (
            <div className='poster-section'>
              <img
                src={`https://image.tmdb.org/t/p/w342/${poster_path}`}
                alt={title}
                className='detail-poster'
              />
            </div>
          )}

          <div className='info-section'>
            <h1 className='detail-title'>{title}</h1>

            <div className='action-buttons'>
              <div
                className='action-btn-wrapper'
                onClick={!user ? handleDisabledWatchlistClick : undefined}
              >
                <button
                  className={`action-btn watchlist-btn ${isInWatchlist(parseInt(movieId)) ? 'active' : ''}`}
                  onClick={handleAddToWatchlist}
                  disabled={!user}
                >
                  <svg className='btn-icon' viewBox='0 0 24 24' fill='currentColor'>
                    {isInWatchlist(parseInt(movieId)) ? (
                      <path d='M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z' />
                    ) : (
                      <path d='M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z' />
                    )}
                  </svg>
                  <span className='btn-text'>
                    {isInWatchlist(parseInt(movieId)) ? 'In Watchlist' : 'Add to Watchlist'}
                  </span>
                </button>
                {!user && <span className='custom-tooltip'>Sign in to Add to Watchlist</span>}
              </div>
              <div
                className='action-btn-wrapper'
                onClick={!user ? handleDisabledFavoritesClick : undefined}
              >
                <button
                  className={`action-btn favorite-btn ${isFavorite(parseInt(movieId)) ? 'active' : ''}`}
                  onClick={handleAddToFavorites}
                  disabled={!user}
                >
                  <svg className='btn-icon' viewBox='0 0 24 24' fill='currentColor'>
                    {isFavorite(parseInt(movieId)) ? (
                      <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                    ) : (
                      <path d='M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z' />
                    )}
                  </svg>
                  <span className='btn-text black'>
                    {isFavorite(parseInt(movieId)) ? 'Liked' : 'Add to Favorites'}
                  </span>
                </button>
                {!user && <span className='custom-tooltip'>Sign in to Add to Favorites</span>}
              </div>
            </div>

            {toast.show && (
              <div className='auth-toast'>
                <svg className='toast-icon' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' />
                </svg>
                <span>{toast.message}</span>
              </div>
            )}

            <div className='basic-info'>
              <div className='info-item'>
                <span className='label'>Release Date:</span>
                <span className='value'>
                  {release_date ? new Date(release_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              <div className='info-item'>
                <span className='label'>Runtime:</span>
                <span className='value'>{runtime ? `${runtime} min` : 'N/A'}</span>
              </div>

              <div className='info-item'>
                <span className='label'>Language:</span>
                <span className='value'>{original_language?.toUpperCase()}</span>
              </div>

              <div className='info-item'>
                <span className='label'>Rating:</span>
                <span className='value rating'>
                  ⭐ {vote_average ? vote_average.toFixed(1) : 'N/A'} / 10
                </span>
              </div>

              <div className='info-item'>
                <span className='label'>Votes:</span>
                <span className='value'>{vote_count?.toLocaleString() || 'N/A'}</span>
              </div>
            </div>

            {genres && genres.length > 0 && (
              <div className='genres-section'>
                <span className='label'>Genres:</span>
                <div className='genres-list'>
                  {genres.map((genre) => (
                    <span key={genre.id} className='genre-tag'>
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {directorInfo && (
              <div className='info-item'>
                <span className='label'>Director:</span>
                <span className='value'>{directorInfo}</span>
              </div>
            )}
          </div>
        </div>

        <div className='overview-section'>
          <h2>Overview</h2>
          <p>{overview || 'No overview available.'}</p>
        </div>

        {trailer && (
          <div className='trailer-section'>
            <div className='video-container'>
              <iframe
                className='trailer-video'
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=1&modestbranding=1&mute=1`}
                title={`${title} Trailer`}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {(budget > 0 || revenue > 0) && (
          <div className='financial-section'>
            <h2>Production Details</h2>
            <div className='financial-info'>
              {budget && budget > 0 ? (
                <div className='financial-item'>
                  <span className='label'>Budget:</span>
                  <span className='value'>${(budget / 1000000).toFixed(1)}M</span>
                </div>
              ) : null}
              {revenue && revenue > 0 ? (
                <div className='financial-item'>
                  <span className='label'>Revenue:</span>
                  <span className='value'>${(revenue / 1000000).toFixed(1)}M</span>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {cast && cast.length > 0 && (
          <div className='cast-section'>
            <h2>Cast</h2>
            <div className='cast-list'>
              {cast
                .filter((actor) => actor && actor.name)
                .map((actor) => (
                  <div key={actor.id} className='cast-item'>
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200/${actor.profile_path}`}
                        alt={actor.name}
                        className='cast-image'
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className='cast-image-placeholder'>
                        <span>No Image</span>
                      </div>
                    )}
                    <div className='cast-info'>
                      <p className='cast-name'>{actor.name || 'Unknown'}</p>
                      <p className='cast-role'>{actor.character || 'N/A'}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {reviews && reviews.results && reviews.results.length > 0 && (
          <div className='reviews-section'>
            <h2>Top Review</h2>
            <div className='review'>
              <p className='review-author'>
                <strong>{reviews.results[0].author || 'Anonymous'}</strong>
              </p>
              <p className='review-content'>
                {reviews.results[0].content
                  ? reviews.results[0].content.substring(0, 300) +
                    (reviews.results[0].content.length > 300 ? '...' : '')
                  : 'No review content available.'}
              </p>
              {reviews.results[0].url && (
                <a
                  href={reviews.results[0].url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='read-more'
                >
                  Read Full Review
                </a>
              )}
            </div>
          </div>
        )}

        <SimilarMovies movieId={movieId} />
      </div>
    </div>
  );
};

export default MovieDetails;

