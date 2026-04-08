import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetch('/api/user', {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch((error) => console.error(error));
    }
  }, []);

  return (
    <div className="home-page">
      {user ? (
        <div>
          <h1>Welcome, {user.name}!</h1>
          <p>You are logged in.</p>
          <Link to="/logout" className="btn btn-primary">
            Logout
          </Link>
        </div>
      ) : (
        <div>
          <h1>Home Page</h1>
          <p>Please log in to access this page.</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;