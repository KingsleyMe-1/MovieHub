import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import SkeletonLoader from './Loader';
import TrendingSkeleton from './TrendingSkeleton';
import Navbar from './NavigationBar';
import '../styles/NavigationBar.css';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [allMovies, setAllMovies] = React.useState([]);
  const [trendingMovies, setTrendingMovies] = React.useState([]);
  const [loadingMovies, setLoadingMovies] = React.useState(false);
  const [loadingTrending, setLoadingTrending] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [category, setCategory] = React.useState('popular');
  const [hasMore, setHasMore] = React.useState(true);
  const observerTarget = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async (query = '', isLoadMore = false) => {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoadingMovies(true);
      }
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

        let endpoint;

        if (query) {
          endpoint = `${API_URL}/search/movie?query=${encodeURIComponent(query)}&page=${currentPage}`;
        } else {
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
          throw new Error('Network response was not ok');
        }

        if (isLoadMore && currentPage > 1) {
          setAllMovies((prevMovies) => [...prevMovies, ...data.results]);
        } else {
          setAllMovies(data.results);
        }

        setHasMore(currentPage < (data.total_pages || 1));
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Failed to fetch allMovies');
        console.error('Error fetching allMovies:', error);
      } finally {
        setLoadingMovies(false);
        setLoadingMore(false);
      }
    };
    const isLoadMore = currentPage > 1;
    fetchMovies(searchTerm, isLoadMore);
  }, [searchTerm, currentPage, category]);

  useEffect(() => {
    setCurrentPage(1);
    setAllMovies([]);
    setHasMore(true);
  }, [searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loadingMovies) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadingMovies]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchTerm('');
  };

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      setLoadingTrending(true);
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

        const listMovies = `${API_URL}/trending/movie/day`;

        const response = await fetch(listMovies, API_OPTIONS);
        const data = await response.json();
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        setTrendingMovies(data.results);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Failed to fetch trending movies');
        console.error('Error fetching trending movies:', error);
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
      popular: 'Popular',
      now_playing: 'Now Playing',
      top_rated: 'Top Rated',
      upcoming: 'Upcoming',
    };
    return searchTerm
      ? `Search Results: ${searchTerm}`
      : `${categoryTitles[category] || 'All'} Movies`;
  };

  return (
    <main>
      <Navbar onSearch={handleSearch} />

      <div className='category-tabs-wrapper'>
        <div className='category-tabs'>
          {[
            { id: 'popular', label: 'Popular' },
            { id: 'now_playing', label: 'Now playing' },
            { id: 'top_rated', label: 'Top rated' },
            { id: 'upcoming', label: 'Upcoming' },
          ].map((cat) => (
            <button
              key={cat.id}
              className={`category-tab-btn ${!searchTerm && category === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className='wrapper'>
        <div>
          {!searchTerm && (
            <section className='trending'>
              <h2>Trending Now</h2>

              {loadingTrending ? (
                <TrendingSkeleton count={8} />
              ) : errorMessage ? (
                <p className='text-red-500'>{errorMessage}</p>
              ) : (
                <ul>
                  {trendingMovies.map((trendingMovie, index) => (
                    <li
                      key={trendingMovie.id}
                      onClick={() => handleMovieClick(trendingMovie.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <p>{index + 1}</p>
                      <img
                        src={
                          trendingMovie.poster_path
                            ? `https://image.tmdb.org/t/p/w500/${trendingMovie.poster_path}`
                            : 'no-poster.png'
                        }
                        alt='trending movie'
                        className='transition-transform duration-300 hover:scale-110 cursor-pointer'
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section className='all-movies'>
            <h2>{getCategoryTitle()}</h2>

            {loadingMovies && allMovies.length === 0 ? (
              <SkeletonLoader count={12} />
            ) : errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ) : allMovies.length > 0 ? (
              <>
                <ul>
                  {allMovies.map(
                    (movie) =>
                      movie.poster_path && (
                        <li
                          key={movie.id}
                          onClick={() => handleMovieClick(movie.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <MovieCard movie={movie} />
                        </li>
                      )
                  )}
                </ul>

                {hasMore && (
                  <div ref={observerTarget} className='loading-more'>
                    {loadingMore && (
                      <div className='flex justify-center items-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
                      </div>
                    )}
                  </div>
                )}

                {!hasMore && allMovies.length > 0 && (
                  <p className='text-green-500 text-center mt-4'>No more movies to load.</p>
                )}
              </>
            ) : (
              <p className='text-red-500'>No "{searchTerm}" found!</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
