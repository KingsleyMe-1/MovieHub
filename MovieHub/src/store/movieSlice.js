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
const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
      state.allMovies = [];
      state.hasMore = true;
    },
    setCategory(state, action) {
      state.category = action.payload;
      state.searchTerm = '';
      state.currentPage = 1;
      state.allMovies = [];
      state.hasMore = true;
    },
    incrementPage(state) {
      state.currentPage += 1;
    },
    resetPagination(state) {
      state.currentPage = 1;
      state.allMovies = [];
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state, action) => {
        const isLoadMore = action.payload.page > 1;
        if (isLoadMore) {
          state.loadingMore = true;
        } else {
          state.loadingMovies = true;
        }
        state.errorMessage = '';
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        const isLoadMore = action.payload.currentPage > 1;

        if (isLoadMore) {
          state.allMovies = [...state.allMovies, ...action.payload.movies];
        } else {
          state.allMovies = action.payload.movies;
        }

        state.hasMore = action.payload.currentPage < action.payload.totalPages;
        state.loadingMovies = false;
        state.loadingMore = false;
        state.errorMessage = '';
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loadingMovies = false;
        state.loadingMore = false;
        state.errorMessage = action.payload || 'Failed to fetch movies';
      })
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.loadingTrending = true;
        state.errorMessage = '';
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.trendingMovies = action.payload;
        state.loadingTrending = false;
        state.errorMessage = '';
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.loadingTrending = false;
        state.errorMessage = action.payload || 'Failed to fetch trending movies';
      });
    },
});

export const { setSearchTerm, setCategory, incrementPage, resetPagination } = moviesSlice.actions;
export default moviesSlice.reducer;