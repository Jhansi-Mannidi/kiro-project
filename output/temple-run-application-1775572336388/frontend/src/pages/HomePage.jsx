import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [highScores, setHighScores] = useState([]);
  const [newestRuns, setNewestRuns] = useState([]);

  useEffect(() => {
    fetch('/api/high-scores')
      .then(response => response.json())
      .then(data => setHighScores(data));

    fetch('/api/newest-runs')
      .then(response => response.json())
      .then(data => setNewestRuns(data));
  }, []);

  return (
    <div className="home-page">
      <h1>Temple Run</h1>
      <p>Join the adventure!</p>
      <ul>
        {highScores.map((score, index) => (
          <li key={index}>
            <span>{score.playerName}</span>
            <span> - {score.score} points</span>
          </li>
        ))}
      </ul>
      <h2>Newest Runs:</h2>
      <ul>
        {newestRuns.map((run, index) => (
          <li key={index}>
            <Link to={`/runs/${run.id}`}>{run.name}</Link>
          </li>
        ))}
      </ul>
      <p><Link to="/start-run">Start a new run!</Link></p>
    </div>
  );
};

export default HomePage;