export const ACTIONS ={
    SET_SEARCH_TERM: 'SET_SEARCH_TERM',
    SET_CATEGORY: 'SET_CATEGORY',
    SET_LOADING_MOVIES: 'SET_LOADING_MOVIES',
    SET_LOADING_MORE: 'SET_LOADING_MORE',
    SET_LOADING_TRENDING: 'SET_LOADING_TRENDING',
    SET_MOVIES : 'SET_MOVIES',
    APPEND_MOVIES: 'APPEND_MOVIES',
    SET_TRENDING_MOVIES: 'SET_TRENDING_MOVIES',
    SET_ERROR: 'SET_ERROR',
    INCREMENT_PAGE: 'INCREMENT_PAGE',
    RESET_PAGINATION: 'RESET_PAGINATION',
    FETCH_MOVIE_SUCCESS: 'FETCH_MOVIE_SUCCESS',
    FETCH_TRENDING_SUCCESS: 'FETCH_TRENDING_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',
};


//Initial State
export const initialState = {
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



//Reducer function
export const movieReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_SEARCH_TERM:
            return { ...state, searchTerm: action.payload, currentPage: 1, allMovies: [], hasMore: true };
        case ACTIONS.SET_CATEGORY:
            return { ...state, category: action.payload, searchTerm: '', currentPage: 1, allMovies: [], hasMore: true };
        case ACTIONS.SET_LOADING_MOVIES:
            return { ...state, loadingMovies: action.payload };
        case ACTIONS.SET_LOADING_MORE:
            return { ...state, loadingMore: action.payload };
        case ACTIONS.SET_LOADING_TRENDING:
            return { ...state, loadingTrending: action.payload };
        case ACTIONS.SET_MOVIES:
            return { ...state, allMovies: action.payload };
        case ACTIONS.APPEND_MOVIES:
            return { ...state, allMovies: [...state.allMovies, ...action.payload] };
        case ACTIONS.SET_TRENDING_MOVIES:
            return { ...state, trendingMovies: action.payload };
        case ACTIONS.SET_ERROR:
            return { ...state, errorMessage: action.payload };
        case ACTIONS.INCREMENT_PAGE:
            return { ...state, currentPage: state.currentPage + 1 };
        case ACTIONS.RESET_PAGINATION:
            return { ...state, currentPage: 1, allMovies: [], hasMore: true };
        case ACTIONS.FETCH_MOVIE_SUCCESS:
            return { ...state, allMovies: action.payload.movies, hasMore: action.payload.hasMore, loadingMovies: false, loadingMore: false };
        case ACTIONS.FETCH_TRENDING_SUCCESS:
            return { ...state, trendingMovies: action.payload, loadingTrending: false };
        case ACTIONS.FETCH_ERROR:
            return { ...state, errorMessage: action.payload, loadingMovies: false, loadingMore: false, loadingTrending: false };
        default:
            return state;
    }
};