import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [flights, setFlights] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://example.com/api/flights')
      .then(response => response.json())
      .then(data => setFlights(data));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchQuery(event.target.searchQuery.value);
  };

  return (
    <div className="home-page">
      <h1>Flight Tickets</h1>
      <form onSubmit={handleSearch}>
        <input type="search" name="searchQuery" placeholder="Search by destination or airline" />
        <button type="submit">Search</button>
      </form>
      <ul>
        {flights.map((flight) => (
          <li key={flight.id}>
            <Link to={`/flights/${flight.id}`}>
              {flight.destination} - {flight.airline}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;