import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, API_OPTIONS } from '../utils/api';
import MovieCard from './MovieCard';
import Loader from './Loader';

const SimilarMovies = ({ movieId }) => {
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      setLoading(true);
      try {
        const endpoint = `${API_BASE_URL}/movie/${movieId}/similar?language=en-US&page=1`;
        const response = await fetch(endpoint, API_OPTIONS);
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch similar movies');
        }

        setSimilarMovies(data.results || []);
        setError('');
      } catch (err) {
        setError('Failed to fetch similar movies');
        console.error('Error fetching similar movies:', err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchSimilarMovies();
    }
  }, [movieId]);

  if (loading) {
    return (
      <div className='similar-movies-section'>
        <h2>Similar Movies</h2>
        <Loader />
      </div>
    );
  }

  if (error || similarMovies.length === 0) {
    return null;
  }

  return (
    <div className='similar-movies-section'>
      <h2>Similar Movies</h2>
      <div className='movies-grid'>
        {similarMovies
          .filter((movie) => movie && movie.poster_path)
          .slice(0, 12)
          .map((movie) => (
            <div
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SimilarMovies;

