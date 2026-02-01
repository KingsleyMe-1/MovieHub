import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import Search from "./Search";
import Loader from "./Loader";
import Pagination from "./Pagination";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [allMovies, setAllMovies] = React.useState([]);
  const [trendingMovies, setTrendingMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const navigate = useNavigate();

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
          ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}&page=${currentPage}`
          : `${API_URL}/discover/movie?sort_by=popularity.desc&page=${currentPage}`;

        const response = await fetch(endpoint, API_OPTIONS);
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setAllMovies(data.results);
        setTotalPages(data.total_pages || 1);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Failed to fetch allMovies");
        console.error("Error fetching allMovies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies(searchTerm);
  }, [searchTerm, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    const nextPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (term) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

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

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="hero-img.png" alt="Movie Logo" />
          <h1 className="hero-title">Find your favorite Movies here</h1>
          <Search setSearchTerm={handleSearch} searchTerm={searchTerm} />
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
                    <li
                      key={trendingMovie.id}
                      onClick={() => handleMovieClick(trendingMovie.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <p>{index + 1}</p>
                      <img
                        src={
                          trendingMovie.poster_path
                            ? `https://image.tmdb.org/t/p/w500/${trendingMovie.poster_path}`
                            : "no-poster.png"
                        }
                        alt="trending movie"
                        className="transition-transform duration-300 hover:scale-110 cursor-pointer"
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
              <>
                <ul>
                  {allMovies.map((movie) => (
                    <li
                      key={movie.id}
                      onClick={() => handleMovieClick(movie.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <MovieCard movie={movie} />
                    </li>
                  ))}
                </ul>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <p className="text-red-500">No "{searchTerm}" found!</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
