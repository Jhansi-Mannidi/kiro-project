import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://localhost:3001/movies')
      .then(response => response.json())
      .then(data => setMovies(data));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="home-page">
      <h1>Movie Tickets</h1>
      <form>
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for movies"
        />
      </form>
      <ul>
        {movies.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase())).map((movie) => (
          <li key={movie.id}>
            <Link to={`/movies/${movie.id}`}>
              {movie.title} ({movie.genre})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;