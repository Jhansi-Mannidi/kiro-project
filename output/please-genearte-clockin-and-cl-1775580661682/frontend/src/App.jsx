import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ClockInPage from './pages/ClockInPage';
import ClockOutPage from './pages/ClockOutPage';
import DashboardPage from './pages/DashboardPage';
import Loginpage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Loginpage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/clockin" component={ClockInPage} />
        <Route path="/clockout" component={ClockOutPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;