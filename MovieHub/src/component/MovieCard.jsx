import React from "react";

const MovieCard = () => {
  return (
    <div className="movie-card">
      <h2 className="movie-title">Movie Title</h2>
      <img
        src="https://via.placeholder.com/150"
        alt="Movie Poster"
        className="movie-poster"
      />
      <p className="movie-description">
        This is a brief description of the movie.
      </p>
      <button className="movie-button">Watch Now</button>
    </div>
  );
};

export default MovieCard;
