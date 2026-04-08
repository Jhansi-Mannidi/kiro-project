import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/movies')
      .then(response => response.json())
      .then(data => setMovies(data));
  }, []);

  const handleSearch = () => {
    if (searchTerm) {
      fetch(`/api/movies?title=${searchTerm}`)
        .then(response => response.json())
        .then(data => setMovies(data));
    } else {
      setMovies([]);
    }
  };

  return (
    <div className="home-page">
      <h1>Movie Ticket Application</h1>
      <form>
        <input
          type="search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search for a movie"
        />
        <button onClick={handleSearch}>Search</button>
      </form>
      <ul className="movie-list">
        {movies.map((movie, index) => (
          <li key={index}>
            <Link to={`/movies/${movie.id}`}>
              {movie.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;