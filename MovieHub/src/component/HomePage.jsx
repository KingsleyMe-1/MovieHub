import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchMovies,
  fetchTrendingMovies,
  setSearchTerm,
  setCategory,
  incrementPage,
} from '../store/movieSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { CATEGORY_TABS, CATEGORY_TITLES } from '../constants/categories';
import MovieCard from './MovieCard';
import SkeletonLoader from './Loader';
import TrendingSkeleton from './TrendingSkeleton';
import Navbar from './NavigationBar';
import '../styles/NavigationBar.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const {
    searchTerm,
    allMovies,
    trendingMovies,
    loadingMovies,
    loadingMore,
    loadingTrending,
    currentPage,
    category,
    hasMore,
    errorMessage,
  } = useSelector((state) => state.movies);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMovies({ searchTerm, page: currentPage, category }));
  }, [dispatch, searchTerm, currentPage, category]);

  useEffect(() => {
    dispatch(fetchTrendingMovies());
  }, [searchTerm]);

  const observerTarget = useIntersectionObserver(() => {
    if (hasMore && !loadingMore && !loadingMovies) {
      dispatch(incrementPage());
    }
  });

  const handleSearch = useCallback(
    (term) => {
      dispatch(setSearchTerm(term));
    },
    [dispatch]
  );

  const handleCategoryChange = useCallback(
    (newCategory) => {
      dispatch(setCategory(newCategory));
    },
    [dispatch]
  );

  const handleMovieClick = useCallback(
    (movieId) => {
      navigate(`/movie/${movieId}`);
    },
    [navigate]
  );

  const getCategoryTitle = () => {
    return searchTerm
      ? `Search Results: ${searchTerm}`
      : `${CATEGORY_TITLES[category] || 'All'} Movies`;
  };

  return (
    <main>
      <Navbar onSearch={handleSearch} />

      <div className='category-tabs-wrapper'>
        <div className='category-tabs'>
          {CATEGORY_TABS.map((cat) => (
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
