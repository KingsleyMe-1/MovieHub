import React from "react";

const MovieCard = ({
  movie: {
    title,
    poster_path,
    id,
    vote_average,
    original_language,
    release_date,
  },
}) => {
  const handleImageError = (e) => {
    e.target.style.display = "none";
  };

  return (
    <div className="movie-card">
      {poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          className="movie-poster"
          onError={handleImageError}
          alt={title}
        />
      )}
      <h3 className="movie-title">{title}</h3>
      <div className="content">
        <div className="rating">
          <img src="/star.svg" alt="Star Icon" />
          <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
        </div>

        <span>•</span>
        <p className="lang">{original_language}</p>

        <span>•</span>
        <p className="year">
          {release_date ? release_date.split("-")[0] : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
