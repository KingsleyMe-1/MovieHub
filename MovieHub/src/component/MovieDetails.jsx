import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/MovieDetails.css";
import SimilarMovies from "./SimilarMovies";

const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const API_KEY = import.meta.env.VITE_API_TMDB_KEY;
        const API_URL = "https://api.themoviedb.org/3";
        const API_OPTIONS = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        };

        const endpoint = `${API_URL}/movie/${movieId}?append_to_response=credits,reviews,videos`;
        const response = await fetch(endpoint, API_OPTIONS);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }

        setMovieData(data);
        setError("");
      } catch (err) {
        setError("Failed to fetch movie details");
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  if (loading) {
    return (
      <div className="details-page">
        <div className="loader-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => navigate(-1)} className="back-btn">
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

  const directorInfo = credits?.crew
    ?.find((person) => person.job === "Director")
    ?.name;
  const cast = credits?.cast?.slice(0, 6) || [];
  const trailer = movieData.videos?.results?.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  const handleAddToWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
    const message = !isInWatchlist
      ? "Added to Watchlist"
      : "Removed from Watchlist";
    console.log(message, movieId);
  };

  const handleAddToFavorites = () => {
    setIsFavorite(!isFavorite);
    const message = !isFavorite ? "Added to Favorites" : "Removed from Favorites";
    console.log(message, movieId);
  };

  return (
    <div className="details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Backdrop */}
      {backdrop_path && (
        <div className="movie-backdrop">
          <img
            src={`https://image.tmdb.org/t/p/w1280/${backdrop_path}`}
            alt={title}
          />
          <div className="backdrop-overlay"></div>
        </div>
      )}

      <div className="details-container">
        {/* Poster and Basic Info */}
        <div className="details-header">
          {poster_path && (
            <div className="poster-section">
              <img
                src={`https://image.tmdb.org/t/p/w342/${poster_path}`}
                alt={title}
                className="detail-poster"
              />
            </div>
          )}

          <div className="info-section">
            <h1 className="detail-title">{title}</h1>

            <div className="action-buttons">
              <button
                className={`action-btn watchlist-btn ${isInWatchlist ? "active" : ""}`}
                onClick={handleAddToWatchlist}
                title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                <i className={`${isInWatchlist ? "fa-solid" : "fa-regular"} fa-bookmark btn-icon`}></i>
                <span className="btn-text">
                  {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </span>
              </button>
              <button
                className={`action-btn favorite-btn ${isFavorite ? "active" : ""}`}
                onClick={handleAddToFavorites}
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <i className={`${isFavorite ? "fa-solid" : "fa-regular"} fa-heart btn-icon`}></i>
                <span className="btn-text black">
                  {isFavorite ? "Liked" : "Add to Favorites"}
                </span>
              </button>
            </div>

            <div className="basic-info">
              <div className="info-item">
                <span className="label">Release Date:</span>
                <span className="value">
                  {release_date
                    ? new Date(release_date).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              <div className="info-item">
                <span className="label">Runtime:</span>
                <span className="value">
                  {runtime ? `${runtime} min` : "N/A"}
                </span>
              </div>

              <div className="info-item">
                <span className="label">Language:</span>
                <span className="value">{original_language?.toUpperCase()}</span>
              </div>

              <div className="info-item">
                <span className="label">Rating:</span>
                <span className="value rating">
                  ⭐ {vote_average ? vote_average.toFixed(1) : "N/A"} / 10
                </span>
              </div>

              <div className="info-item">
                <span className="label">Votes:</span>
                <span className="value">{vote_count?.toLocaleString() || "N/A"}</span>
              </div>
            </div>

            {genres && genres.length > 0 && (
              <div className="genres-section">
                <span className="label">Genres:</span>
                <div className="genres-list">
                  {genres.map((genre) => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {directorInfo && (
              <div className="info-item">
                <span className="label">Director:</span>
                <span className="value">{directorInfo}</span>
              </div>
            )}
          </div>
        </div>

        {/* Overview */}
        <div className="overview-section">
          <h2>Overview</h2>
          <p>{overview || "No overview available."}</p>
        </div>

        {/* Trailer Video */}
        {trailer && (
          <div className="trailer-section">
            <div className="video-container">
              <iframe
                className="trailer-video"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=1&modestbranding=1&mute=1`}
                title={`${title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Budget and Revenue */}
        {(budget > 0 || revenue > 0) && (
          <div className="financial-section">
            <h2>Production Details</h2>
            <div className="financial-info">
              {budget && budget > 0 ? (
                <div className="financial-item">
                  <span className="label">Budget:</span>
                  <span className="value">${(budget / 1000000).toFixed(1)}M</span>
                </div>
              ) : null}
              {revenue && revenue > 0 ? (
                <div className="financial-item">
                  <span className="label">Revenue:</span>
                  <span className="value">
                    ${(revenue / 1000000).toFixed(1)}M
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Cast */}
        {cast && cast.length > 0 && (
          <div className="cast-section">
            <h2>Cast</h2>
            <div className="cast-list">
              {cast
                .filter((actor) => actor && actor.name)
                .map((actor) => (
                  <div key={actor.id} className="cast-item">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200/${actor.profile_path}`}
                        alt={actor.name}
                        className="cast-image"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="cast-image-placeholder">
                        <span>No Image</span>
                      </div>
                    )}
                    <div className="cast-info">
                      <p className="cast-name">{actor.name || "Unknown"}</p>
                      <p className="cast-role">{actor.character || "N/A"}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews && reviews.results && reviews.results.length > 0 && (
          <div className="reviews-section">
            <h2>Top Review</h2>
            <div className="review">
              <p className="review-author">
                <strong>{reviews.results[0].author || "Anonymous"}</strong>
              </p>
              <p className="review-content">
                {reviews.results[0].content
                  ? reviews.results[0].content.substring(0, 300) +
                    (reviews.results[0].content.length > 300 ? "..." : "")
                  : "No review content available."}
              </p>
              {reviews.results[0].url && (
                <a
                  href={reviews.results[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more"
                >
                  Read Full Review
                </a>
              )}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        <SimilarMovies movieId={movieId} />
      </div>
    </div>
  );
};

export default MovieDetails;
