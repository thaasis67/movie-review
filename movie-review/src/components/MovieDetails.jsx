import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const {authToken} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  console.log("MovieDetails id from URL:", id);

  useEffect(() => {
    if (!id) return; 

    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
          },
          params: {
            language: 'en-US',
          },
        });
        setMovie(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`https://movie-review-q7ef.onrender.com/api/reviews/${id}`);
        setReviews(response.data);
      }catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };


    fetchMovieDetails();
    fetchReviews();
  }, [id]); 

  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return;


    try {
      const response = await axios.post('https://movie-review-q7ef.onrender.com/api/reviews',{
        movieId: id,
        reviewText: newReview,
      },{
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setReviews(prev => [...prev, response.data]);
      setNewReview('');
    } catch (error) {
      console.error("Error submitting review:", error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-primary text-white px-5 py-12 relative z-10">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
      
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={movie.title}
        className="w-full max-w-xs rounded-2xl shadow-inner shadow-light-100/10 object-cover"
      />
      
      <div className="flex flex-col justify-center gap-6">
        <h2 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          {movie.title}
        </h2>
  
        <div className="flex items-center gap-2">
          <div className="rating flex items-center gap-1">
            <img src="/star.svg" alt="Star" className="size-5 object-contain" />
            <p className="font-bold text-lg">{movie.vote_average.toFixed(1)}</p>
          </div>
          <span className="text-gray-100 font-medium text-base">• {movie.release_date}</span>
        </div>
  
        <div className="flex flex-wrap gap-4 text-gray-100 text-base font-medium">
          <span className="capitalize">Language: {movie.original_language}</span>
        </div>
  
        <p className="text-light-200 text-base leading-relaxed">
          {movie.overview}
        </p>
      </div>
  
    </div>

    <div className="mt-12 max-w-3xl mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Reviews</h3>

      {reviews.length === 0 ? (
        <p className="text-light-300">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((rev, idx) => (
            <li key={idx} className="bg-dark-200 p-4 rounded">
              <p className="text-light-100">{rev.reviewText}</p>
              <p className="text-sm text-gray-400">- {rev.userEmail}</p>
            </li>
          ))}
        </ul>
      )}

      {authToken && (
        <div className="mt-6">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placegolder="Write your review..."
            className="w-full p-3 rounded bg-dark-100 text-white mb-2"
           />
           <button onClick={handleReviewSubmit}
           className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
           >
            Submit Review

           </button>

        </div>

      )}
    </div>
  </div>
  </>
  
  );
};

export default MovieDetails;
