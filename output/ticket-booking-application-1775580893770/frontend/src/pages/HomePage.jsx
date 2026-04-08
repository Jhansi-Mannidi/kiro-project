import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    fetch('/api/events/upcoming')
      .then(response => response.json())
      .then(data => setUpcomingEvents(data));
  }, []);

  useEffect(() => {
    fetch('/api/events/featured')
      .then(response => response.json())
      .then(data => setFeaturedEvents(data));
  }, []);

  return (
    <div className="home-page">
      <h1>Upcoming Events</h1>
      <ul>
        {upcomingEvents.map(event => (
          <li key={event.id}>
            <Link to={`/events/${event.id}`}>{event.name}</Link>
          </li>
        ))}
      </ul>

      <h1>Featured Events</h1>
      <ul>
        {featuredEvents.map(event => (
          <li key={event.id}>
            <Link to={`/events/${event.id}`}>{event.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;