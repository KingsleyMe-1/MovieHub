import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_KEY = import.meta.env.VITE_API_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

//Async thunk for fetching movies
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ category, page, searchTerm }, { rejectWithValue }) => {
    try {
      let endpoint;
      if (searchTerm) {
        endpoint = `${BASE_URL}/search/movie?query=${encodeURIComponent(searchTerm)}&page=${page}`;
      } else {
        const categoryEndpoints = {
          popular: `${BASE_URL}/movie/popular?page=${page}`,
          now_playing: `${BASE_URL}/movie/now_playing?page=${page}`,
          top_rated: `${BASE_URL}/movie/top_rated?page=${page}`,
          upcoming: `${BASE_URL}/movie/upcoming?page=${page}`,
        };
        endpoint = categoryEndpoints[category] || categoryEndpoints.popular;
      }

      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      return {
        movies: data.results,
        totalPages: data.total_pages || 1,
        currentPage: page,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//Async thunk for fetching trending movies
export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrendingMovies',
  async (_, { rejectWithValue }) => {
    try {
      const endpoint = `${BASE_URL}/trending/movie/day`;
      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch trending movies');
      }

      return data.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//Initial state
const initialState = {
  searchTerm: '',
  allMovies: [],
  trendingMovies: [],
  loadingMovies: false,
  loadingTrending: false,
  loadingMore: false,
  errorMessage: '',
  currentPage: 1,
  category: 'popular',
  hasMore: true,
};

//Create Slice
