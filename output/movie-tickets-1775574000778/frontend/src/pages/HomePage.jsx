import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/movies')
      .then(response => response.json())
      .then(data => setMovies(data));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetch('/api/movies/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ searchTerm }),
    })
      .then(response => response.json())
      .then(data => setMovies(data));
  };

  return (
    <div className="home-page">
      <h1>Movie Tickets</h1>
      <form onSubmit={handleSearch}>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search for a movie..."
        />
        <button type="submit">Search</button>
      </form>
      <ul className="movie-list">
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link to={`/movies/${movie.id}`}>
              {movie.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;