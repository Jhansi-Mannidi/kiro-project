import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ClockInPage from './pages/ClockInPage';
import ClockOutPage from './pages/ClockOutPage';
import DashboardPage from './pages/DashboardPage';
import Loginpage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact component={Loginpage} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clockin" element={<ClockInPage />} />
        <Route path="/clockout" element={<ClockOutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;