import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './Home';
import Shows from './Shows';
import ShowDetails from './ShowDetails';
import BookMyShow from './BookMyShow';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Logout from './Logout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact component={Home} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/show/:id" element={<ShowDetails />} />
        <Route path="/book-my-show" element={<BookMyShow />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;