import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [buses, setBuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://bus-tickets-backend.com/api/buses')
      .then(response => response.json())
      .then(data => setBuses(data));
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="home-page">
      <h1>Bus Tickets</h1>
      <form>
        <input
          type="search"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by route number or name"
        />
      </form>
      <ul>
        {buses.filter(bus => bus.name.toLowerCase().includes(searchQuery.toLowerCase())).map((bus) => (
          <li key={bus.id}>
            <Link to={`/bus/${bus.id}`}>
              {bus.name} - Route {bus.routeNumber}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;