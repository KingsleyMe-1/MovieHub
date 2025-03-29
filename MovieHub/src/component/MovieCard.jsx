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
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "no-poster.png"
        }
        className="movie-poster"
      />
      <h3 className="movie-title">{title}</h3>
      <div className="content">
        <div className="rating">
          <img src="star.svg" alt="Star Icon" />
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
