import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchMovies,
  fetchTrendingMovies,
  setSearchTerm,
  setCategory,
  incrementPage,
} from '../store/movieSlice';
import { useDispatch, useSelector } from 'react-redux';
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
  const observerTarget = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMovies({ searchTerm, page: currentPage, category }));
  }, [dispatch, searchTerm, currentPage, category]);

  useEffect(() => {
    dispatch(fetchTrendingMovies());
  }, [searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loadingMovies) {
          dispatch(incrementPage());
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
  }, [dispatch, hasMore, loadingMore, loadingMovies]);

  const handleSearch = (term) => {
    dispatch(setSearchTerm(term));
  };

  const handleCategoryChange = (newCategory) => {
    dispatch(setCategory(newCategory));
  };

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
