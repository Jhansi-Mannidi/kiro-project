import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [shows, setShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/shows')
      .then(response => response.json())
      .then(data => setShows(data));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="home-page">
      <h1>Book My Show</h1>
      <form>
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for shows..."
        />
      </form>
      <ul>
        {shows.filter((show) => show.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((show) => (
            <li key={show.id}>
              <Link to={`/shows/${show.id}`}>
                {show.name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default HomePage;