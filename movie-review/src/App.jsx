import React, {useContext} from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Search from './components/Search';
import MovieCard from './components/MovieCard';
import Spinner from './components/Spinner';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite';
import Navbar from './components/Navbar';
import axios from 'axios';
import Login from './components/Login';
import SignUp from './components/SignUp';
import MovieDetails from './components/MovieDetails';
import { Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [serverResponse, setServerResponse] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch Movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      setIsLoading(false);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };
  console.log(trendingMovies);

  const fetchServerData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api');
      setServerResponse(response.data);
    } catch (error) {
      console.error(`Error fetching server data: ${error}`);
    }
  };

  const { authToken, logout} = useContext(AuthContext);

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
    fetchServerData();
  }, []);

  return (
    <>
      <Navbar>
        <Link to="/">Home</Link>
        {authToken ? (
          <button onClick={logout}>Logout</button>
        ):(
          <Link to="/login">Login</Link>
        )}
      </Navbar>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="hero-img.png" alt="Hero banner" />
          <h1>Find any <span className="text-gradient">Movies</span> that You're looking for</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <Link to={`/movie/${movie.movie_id}`}>
                  <img src={movie.poster_url} alt={movie.title} className="cursor-pointer hover:scale-105 transition-transform"/>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
};

export default function AppRouter() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <main>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/" element={<App />} />

      </Routes>
    </main>
  );
}
