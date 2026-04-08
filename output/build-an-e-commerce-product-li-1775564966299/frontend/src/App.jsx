import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/products" exact component={ProductList} />
        <Route path="/product/:id" exact component={ProductDetails} />
        <Route path="/cart" exact component={Cart} />
        <Route path="/checkout" exact component={Checkout} />
        <Route path="/order-history" exact component={OrderHistory} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;