import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        const data = await response.json();
        setBooks(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="home-page">
      <h1>Buy the Books So I Need One Store</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <Link to={`/book/${book.id}`}>
                {book.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;