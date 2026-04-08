import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="home-page">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/post/${post.slug}`}>
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