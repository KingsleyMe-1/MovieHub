import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './component/HomePage';
import MovieDetails from './component/MovieDetails';
import SignIn from './component/SignIn';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/movie/:movieId' element={<MovieDetails />} />
          <Route path='/signin' element={<SignIn />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
