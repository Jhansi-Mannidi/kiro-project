import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './Home';
import Movies from './Movies';
import MovieDetails from './MovieDetails';
import Tickets from './Tickets';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact component={Home} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;