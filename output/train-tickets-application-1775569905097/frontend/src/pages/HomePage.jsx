import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [trainTickets, setTrainTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://example.com/api/train-tickets')
      .then(response => response.json())
      .then(data => setTrainTickets(data));
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <h1>Train Tickets</h1>
      <form>
        <input
          type="search"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by train number or destination"
        />
      </form>
      <ul>
        {trainTickets.filter(
          (ticket) =>
            ticket.trainNumber.includes(searchQuery) ||
            ticket.destination.toLowerCase().includes(searchQuery)
        ).map((ticket) => (
          <li key={ticket.id}>
            <Link to={`/train-tickets/${ticket.id}`}>
              {ticket.trainNumber} - {ticket.destination}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;