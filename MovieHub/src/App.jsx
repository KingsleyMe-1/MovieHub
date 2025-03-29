import React, { useEffect } from "react";
import MovieCard from "./component/MovieCard";
import Search from "./component/Search";

const App = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [movies, setMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  useEffect(() => {
    const fetchMovies = async () => {
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

        const listMovies = `${API_URL}/discover/movie?sort_by=popularity.desc`;

        const response = await fetch(listMovies, API_OPTIONS);
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setMovies(data.results);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Failed to fetch movies");
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="hero-img.png" alt="Movie Logo" />
          <h1 className="hero-title">Find your favorite movies here</h1>
          <Search setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        </header>

        <section className="all-movies">
          <h2>All Movies</h2>

          {loading && <p>Loading...</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {movies.length > 0 ? (
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          ) : (
            <p>No movies found</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
