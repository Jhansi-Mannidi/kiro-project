import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [featuredTracks, setFeaturedTracks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);

  useEffect(() => {
    fetch('/api/tracks/featured')
      .then(response => response.json())
      .then(data => setFeaturedTracks(data));

    fetch('/api/releases/new')
      .then(response => response.json())
      .then(data => setNewReleases(data));
  }, []);

  return (
    <div className="home-page">
      <h1>Music Application</h1>
      <section className="featured-tracks">
        <h2>Featured Tracks</h2>
        <ul>
          {featuredTracks.map((track) => (
            <li key={track.id}>
              <Link to={`/tracks/${track.id}`}>
                {track.name} by {track.artist}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="new-releases">
        <h2>New Releases</h2>
        <ul>
          {newReleases.map((release) => (
            <li key={release.id}>
              <Link to={`/releases/${release.id}`}>
                {release.name} by {release.artist}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default HomePage;