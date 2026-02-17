import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL as BASE_URL, API_OPTIONS } from '../utils/api';

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

export const fetchWatchlistMovies = createAsyncThunk(
  'movies/fetchWatchlistMovies',
  async ( movieIds, { rejectWithValue }) => {
    try {
      if (!movieIds || movieIds.length === 0) {
        return [];
      }

      const moviePromises = movieIds.map(async (id) => {
        try {
          const response = await fetch(`${BASE_URL}/movie/${id}`, API_OPTIONS);

          if (response.ok) {
            const data = await response.json();
            return data;
          }

          return null;
        }catch (error) {
          console.error(`Error fetching movie with ID ${id}:`, error);
          return null;
        }
      });
      
      const results = await Promise.all(moviePromises);
      const validMovies = results.filter(movie => movie !== null);
      return validMovies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  searchTerm: '',
  allMovies: [],
  watchlistMovies: [],
  trendingMovies: [],
  loadingMovies: false,
  loadingTrending: false,
  loadingMore: false,
  loadingWatchlist: false,
  errorMessage: '',
  currentPage: 1,
  category: 'popular',
  hasMore: true,
};

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
    },
    clearWatchlist(state) {
      state.watchlistMovies = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state, action) => {
        const isLoadMore = action.meta.arg.page > 1;
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
      })
      .addCase(fetchWatchlistMovies.pending, (state) => {
        state.loadingWatchlist = true;
        state.errorMessage = '';
      })
      .addCase(fetchWatchlistMovies.fulfilled, (state, action) => {
        state.watchlistMovies = action.payload;
        state.loadingWatchlist = false;
        state.errorMessage = '';
      })
      .addCase(fetchWatchlistMovies.rejected, (state, action) => {
        state.loadingWatchlist = false;
        state.errorMessage = action.payload || 'Failed to fetch watchlist movies';
      });
    },
});

export const { setSearchTerm, setCategory, incrementPage, resetPagination, clearWatchlist } = moviesSlice.actions;
export default moviesSlice.reducer;