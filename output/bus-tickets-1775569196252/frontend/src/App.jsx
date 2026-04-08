import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Tickets from './Tickets';
import TicketDetails from './TicketDetails';
import CreateTicket from './CreateTicket';
import EditTicket from './EditTicket';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/tickets" component={Tickets} />
        <Route path="/ticket/:id" component={TicketDetails} />
        <Route path="/create-ticket" component={CreateTicket} />
        <Route path="/edit-ticket/:id" component={EditTicket} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;