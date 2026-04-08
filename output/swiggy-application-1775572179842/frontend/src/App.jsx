import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import OrderSummary from './pages/OrderSummary';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/order-history" exact component={OrderHistory} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/cart" exact component={Cart} />
        <Route path="/payment" exact component={Payment} />
        <Route path="/order-summary" exact component={OrderSummary} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;