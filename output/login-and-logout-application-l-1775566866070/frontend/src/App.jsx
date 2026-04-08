import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';
import Logout from './pages/Logout';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/register" component={Register} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;