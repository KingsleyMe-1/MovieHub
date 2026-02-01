import React, { useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import MovieCard from "./component/MovieCard";
import Search from "./component/Search";
import Loader from "./component/Loader";

const App = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [allMovies, setAllMovies] = React.useState([]);
  const [searchMovies, setSearchMovies] = React.useState([]);
  const [trendingMovies, setTrendingMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Fetch All Movies from TMDB API
  useEffect(() => {
    const fetchMovies = async (query = "") => {
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

        const endpoint = query
          ? `${API_URL}/search/movie?query=${query}`
          : `${API_URL}/discover/movie?sort_by=popularity.desc`;

        const response = await fetch(endpoint, API_OPTIONS);
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
    fetchMovies(searchTerm);
  }, [searchTerm]);

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

  // // Fetch Search Movies from TMDB API
  // useEffect(() => {
  //   setLoading(true);

  //   const fetchSearchMovies = async (searchterm = "") => {
  //     try {
  //       const API_KEY = import.meta.env.VITE_API_TMDB_KEY;
  //       const API_URL = "https://api.themoviedb.org/3";
  //       const API_OPTIONS = {
  //         method: "GET",
  //         headers: {
  //           accept: "application/json",
  //           Authorization: `Bearer ${API_KEY}`,
  //         },
  //       };

  //       const searchMovies = `${API_URL}/search/movie?query=${searchTerm}`;

  //       const response = await fetch(searchMovies, API_OPTIONS);
  //       const data = await response.json();
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }

  //       setSearchMovies(data.results);
  //       setErrorMessage("");
  //     } catch (error) {
  //       setErrorMessage("Failed to fetch search movies");
  //       console.error("Error fetching search movies:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSearchMovies(searchTerm);
  // }, [searchTerm]);

  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="hero-img.png" alt="Movie Logo" />
          <h1 className="hero-title">Find your favorite Movies here</h1>
          <Search setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        </header>

        <div>
          {!searchTerm && (
            <section className="trending">
              <h2>Trending Movies</h2>

              {loading ? (
                <Loader />
              ) : errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
              ) : (
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
              )}
            </section>
          )}

          <section className="all-movies">
            <h2>All Movies</h2>

            {loading ? (
              <Loader />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : allMovies.length > 0 ? (
              <ul>
                {allMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            ) : (
              <p className="text-red-500">No "{searchTerm}" found!</p>
            )}
          </section>
        </div>
      </div>
      <SpeedInsights />
    </main>
  );
};

export default App;
