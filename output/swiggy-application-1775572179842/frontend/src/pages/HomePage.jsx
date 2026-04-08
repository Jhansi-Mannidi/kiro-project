import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('https://api.example.com/restaurants')
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    return restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="home-page">
      <h1>Swiggy</h1>
      <input
        type="search"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search for restaurants"
      />
      <ul>
        {filteredRestaurants.map((restaurant) => (
          <li key={restaurant.id}>
            <Link to={`/restaurants/${restaurant.id}`}>
              {restaurant.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;