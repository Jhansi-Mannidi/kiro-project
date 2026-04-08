import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import Reviews from './components/Reviews';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact component={Home} />
        <Route path="/restaurants" exact component={Restaurants} />
        <Route path="/restaurant/:id" exact component={RestaurantDetails}>
          <Route path="reviews" element={<Reviews />} />
        </Route>
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/profile" exact component={Profile} />
        <Route component={NotFound} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;