import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './moviesSlice';

export const store = configureStore({
  reducer: {
    movies: movieReducer,
  },
});
