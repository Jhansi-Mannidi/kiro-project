import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/posts')
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="home-page">
      <h1>Blog Posts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <Link to={`/posts/${post.id}`}>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;