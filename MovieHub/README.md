# 🎬 MovieHub

A modern, feature-rich movie discovery web application built with React and powered by The Movie Database (TMDB) API. Browse, search, and explore thousands of movies with a sleek, responsive interface.

![React](https://img.shields.io/badge/React-19.0.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11.2-764ABC)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0.17-38B2AC)

## ✨ Features

### 🎯 Core Features
- **Search Functionality** - Search through thousands of movies with real-time results
- **Category Browsing** - Browse movies by Popular, Now Playing, Top Rated, and Upcoming
- **Trending Movies** - Dedicated section for trending movies (updated daily/weekly)
- **Infinite Scroll** - Seamless content loading as you scroll
- **Movie Details** - Comprehensive movie information including:
  - Overview, ratings, and release date
  - Cast and crew information
  - Movie trailers (YouTube integration)
  - Budget and revenue data
  - User reviews
  - Runtime and language information
- **Similar Movies** - Smart movie recommendations based on current selection
- **Responsive Design** - Fully responsive across all devices (mobile, tablet, desktop)

### 👤 User Features
- **Authentication System** - Sign In and Sign Up functionality
- **Watchlist** - Add movies to your personal watchlist
- **Favorites** - Mark movies as favorites for quick access
- **User Profile** - Personalized user experience with local storage persistence

### 🎨 UI/UX Features
- **Skeleton Loaders** - Elegant loading states for better user experience
- **Toast Notifications** - Real-time feedback for user actions
- **Smooth Animations** - Polished transitions and animations
- **Navigation Bar** - Intuitive navigation with user profile integration
- **Category Tabs** - Easy switching between movie categories
- **Pagination** - Smart pagination with infinite scroll support

## 🛠️ Tech Stack

### Frontend Framework & Libraries
- **React 19.0.0** - Modern React with latest features
- **Vite 6.2.0** - Lightning-fast build tool and development server
- **React Router DOM 7.13.0** - Client-side routing

### State Management
- **Redux Toolkit 2.11.2** - Efficient state management
- **React Redux 9.2.0** - React bindings for Redux
- **Context API** - Authentication and user state management

### Styling
- **TailwindCSS 4.0.17** - Utility-first CSS framework
- **Custom CSS** - Component-specific styling
- **FontAwesome 7.1.0** - Icon library

### Code Quality & Tools
- **ESLint 9.21.0** - Code linting
- **Prettier 3.8.1** - Code formatting
- **ESLint Config Prettier** - ESLint and Prettier integration

### API Integration
- **TMDB API** - The Movie Database API for movie data

## 🌟 Best Parts of MovieHub

### 1. **Performance Optimized**
- Implements **infinite scroll** instead of traditional pagination, providing a seamless browsing experience
- Utilizes **lazy loading** for images and content
- **Vite** ensures blazing-fast development and optimized production builds

### 2. **User Experience Excellence**
- **Skeleton loaders** provide visual feedback during data fetching, eliminating blank screens
- **Toast notifications** give instant feedback for user actions (adding to watchlist/favorites)
- **Smooth navigation** between pages with React Router
- **Responsive design** works flawlessly on all screen sizes

### 3. **Smart State Management**
- **Redux Toolkit** with async thunks for efficient API calls and state updates
- **Context API** for authentication state, keeping it separate from app state
- **Local storage integration** for persistent user data across sessions

### 4. **Rich Content Discovery**
- **Multiple discovery methods**: Search, categories, trending, and similar movies
- **Comprehensive movie details** with trailers, reviews, cast, and crew
- **Category tabs** for easy exploration of different movie types
- **Similar movie recommendations** help users discover new content

### 5. **Modern Development Practices**
- **Component-based architecture** for maintainability
- **Custom hooks** for reusable logic
- **Async/await** for clean API calls
- **ESLint and Prettier** for consistent code quality
- **Environment variables** for secure API key management

### 6. **Robust Error Handling**
- Graceful error states with user-friendly messages
- Loading states for all async operations
- Fallback UI for missing data

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- TMDB API Key ([Get it here](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository
```bash
git clone https://github.com/KingsleyMe-1/MovieHub.git
cd MovieHub
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root directory
```env
VITE_API_TMDB_KEY=your_tmdb_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 📁 Project Structure

```
MovieHub/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and media files
│   ├── component/      # React components
│   │   ├── HomePage.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── MovieCard.jsx
│   │   ├── NavigationBar.jsx
│   │   ├── Search.jsx
│   │   ├── SignIn.jsx
│   │   ├── SimilarMovies.jsx
│   │   ├── Pagination.jsx
│   │   └── Loaders (Skeleton, MovieDetailsLoader, etc.)
│   ├── context/        # React Context providers
│   │   └── AuthContext.jsx
│   ├── store/          # Redux store and slices
│   │   ├── store.js
│   │   └── movieSlice.js
│   ├── styles/         # CSS files
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
├── .env.local          # Environment variables
├── index.html          # HTML template
├── package.json        # Dependencies
└── vite.config.js      # Vite configuration
```

## 🎨 Features in Detail

### Infinite Scroll
Uses Intersection Observer API to detect when the user reaches the bottom of the page and automatically loads more content.

### Category Filtering
Four main categories to explore:
- **Popular** - Currently popular movies
- **Now Playing** - Movies currently in theaters
- **Top Rated** - Highest-rated movies of all time
- **Upcoming** - Soon-to-be-released movies

### Movie Details Page
Includes:
- High-quality backdrop and poster images
- Movie overview and metadata
- Cast and director information
- Official trailers (YouTube embedded)
- User reviews
- Similar movie recommendations

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [React](https://react.dev/) team for the amazing framework
- [Vite](https://vitejs.dev/) for the fast build tool
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework

---

Made with ❤️ by [KingsleyMe-1](https://github.com/KingsleyMe-1)

## 🤖 Puter.js AI Assistant

This project includes an in-app AI assistant integrated with the Puter.js client library (`@heyputer/puter.js`). The assistant appears as an AI button in the navigation bar and opens a right-hand sidebar for chat-style prompts and responses.

- Where the code lives: `src/component/NavigationBar.jsx` (UI + chat logic), `src/context/AuthContext.jsx` (Puter auth integration), and `src/styles/NavigationBar.css` (styling + themed scrollbar).
- How to use: Sign in via the app (Puter auth). Click the AI button beside the hamburger icon to open the AI sidebar, type a prompt, and press Enter to send. Responses render in the sidebar (supports **bold**, `##` headings and clickable links).
- Implementation notes:
  - The assistant uses the Puter client and calls `puter.ai.chat(prompt, options)` (the code prefers lightweight models such as `gpt-5-nano` or `openai/gpt-5.2-chat` depending on your configuration).
  - The app extracts the assistant `content` field from driver responses (for example `result.result.message.content`) and displays only that text in the UI.
  - If available, the code also calls `puter.print(text)` to mirror the response inside Puter's UI surface.
  - The AI button is disabled and visually indicated when a user is not signed in; Puter auth is required for `puter.ai.chat` to work.
- Debugging: In development builds the raw Puter response is logged to the console to help diagnose any response-shape differences.

Note: Puter auth/session is handled client-side by the app. If your Puter setup requires build-time keys or special configuration, ensure those values are provided at build time (Vite `VITE_*` env variables when building inside Docker or CI). The Dockerfile in this repo performs a production build and serves the static output with nginx.

