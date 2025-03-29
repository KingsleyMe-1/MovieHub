import React, { useEffect } from "react";
import MovieCard from "./component/MovieCard";
import Search from "./component/Search";

const App = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [allMovies, setAllMovies] = React.useState([]);
  const [trendingMovies, setTrendingMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Fetch All Movies from TMDB API
  useEffect(() => {
    const fetchAllMovies = async () => {
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

        setAllMovies(data.results);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Failed to fetch allMovies");
        console.error("Error fetching allMovies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMovies();
  }, []);

  // Fetch Trending Movies from TMDB API
  useEffect(() => {
    const fetchTrendingMovies = async () => {
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

        const listMovies = `${API_URL}/trending/movie/day`;

        const response = await fetch(listMovies, API_OPTIONS);
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setTrendingMovies(data.results);
        console.log(data.results);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Failed to fetch trending movies");
        console.error("Error fetching trending movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="hero-img.png" alt="Movie Logo" />
          <h1 className="hero-title">Find your favorite allMovies here</h1>
          <Search setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        </header>

        <section className="trending">
          <h2>Trending Movies</h2>

          {loading && <Loader />}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {trendingMovies.length > 0 ? (
            <ul>
              {trendingMovies.map((trendingMovie, index) => (
                <li key={trendingMovie.id}>
                  <p>{index + 1}</p>
                  <img
                    src={
                      trendingMovie.poster_path
                        ? `https://image.tmdb.org/t/p/w500/${trendingMovie.poster_path}`
                        : "no-poster.png"
                    }
                    alt="trending movie"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No trending movies found</p>
          )}
        </section>

        <section className="all-movies">
          <h2>All Movies</h2>

          {loading && <Loader />}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {allMovies.length > 0 ? (
            <ul>
              {allMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          ) : (
            <p>No allMovies found</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
