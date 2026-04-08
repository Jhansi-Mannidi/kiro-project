import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/api/posts')
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="home-page">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content.substring(0, 150)}...</p>
              <button onClick={() => console.log(post)}>Read More</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;