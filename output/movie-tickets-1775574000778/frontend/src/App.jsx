import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import MovieList from './MovieList';
import MovieDetails from './MovieDetails';
import TicketForm from './TicketForm';
import Tickets from './Tickets';
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/movies" component={MovieList} />
        <Route path="/movies/:id" component={MovieDetails} />
        <Route path="/tickets" component={Tickets} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;