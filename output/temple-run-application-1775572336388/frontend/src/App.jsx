import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import About from './pages/About';
import Error404 from './pages/Error404';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact component={Home} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;