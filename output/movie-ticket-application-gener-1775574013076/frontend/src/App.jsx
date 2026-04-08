import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './Home';
import Movies from './Movies';
import Showtimes from './Showtimes';
import Tickets from './Tickets';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact component={Home} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/showtimes/:movieId" element={<Showtimes />} />
        <Route path="/tickets/:showtimeId" element={<Tickets />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;