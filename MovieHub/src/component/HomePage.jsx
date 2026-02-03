import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import Search from "./Search";
import Loader from "./Loader";
import Pagination from "./Pagination";
import Navbar from "./NavigationBar";
import "../styles/NavigationBar.css";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [allMovies, setAllMovies] = React.useState([]);
  const [trendingMovies, setTrendingMovies] = React.useState([]);
  const [loadingMovies, setLoadingMovies] = React.useState(false);
  const [loadingTrending, setLoadingTrending] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [category, setCategory] = React.useState("popular");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async (query = "") => {
      setLoadingMovies(true);
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

        let endpoint;
        
        if (query) {
          endpoint = `${API_URL}/search/movie?query=${encodeURIComponent(query)}&page=${currentPage}`;
        } else {
          // Map category to API endpoint
          const categoryEndpoints = {
            popular: `${API_URL}/movie/popular?page=${currentPage}`,
            now_playing: `${API_URL}/movie/now_playing?page=${currentPage}`,
            top_rated: `${API_URL}/movie/top_rated?page=${currentPage}`,
            upcoming: `${API_URL}/movie/upcoming?page=${currentPage}`,
          };
          endpoint = categoryEndpoints[category] || categoryEndpoints.popular;
        }

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
        setLoadingMovies(false);
      }
    };
    fetchMovies(searchTerm);
  }, [searchTerm, currentPage, category]);

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

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchTerm(""); // Clear search when changing category
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setLoadingTrending(true);
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
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Failed to fetch trending movies");
        console.error("Error fetching trending movies:", error);
      } finally {
        setLoadingTrending(false);
      }
    };
    fetchTrendingMovies();
  }, []);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const getCategoryTitle = () => {
    const categoryTitles = {
      popular: "Popular",
      now_playing: "Now Playing",
      top_rated: "Top Rated",
      upcoming: "Upcoming",
    };
    return searchTerm ? `Search Results: ${searchTerm}` : `${categoryTitles[category] || "All"} Movies`;
  };

  return (
    <main>
      <Navbar 
        onSearch={handleSearch} 
        onCategoryChange={handleCategoryChange}
        currentCategory={category}
        searchTerm={searchTerm}
      />
      <div className="wrapper">
        <div>
          {!searchTerm && (
            <section className="trending">
              <h2>Trending Now</h2>

              {loadingTrending ? (
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
            <h2>{getCategoryTitle()}</h2>

            {loadingMovies ? (
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

