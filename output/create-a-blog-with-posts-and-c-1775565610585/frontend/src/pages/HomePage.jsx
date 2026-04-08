import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="home-page">
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content.substring(0, 100)}...</p>
            <button onClick={() => {
              axios.get(`http://localhost:3001/api/comments?postId=${post.id}`)
                .then(response => {
                  setComments(response.data);
                })
                .catch(error => {
                  console.error(error);
                });
            }}>
              View Comments ({post.comments.length})
            </button>
          </li>
        ))}
      </ul>
      {comments.map((comment) => (
        <div key={comment.id}>
          <h3>{comment.name}</h3>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default HomePage;