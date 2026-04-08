import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  useEffect(() => {
    fetch('/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <div className="home-page">
      <h1>Welcome to Zepto Store!</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <Link to={`/categories/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
      <h2>Featured Products</h2>
      <ul>
        {products.slice(0, 4).map((product) => (
          <li key={product.id}>
            <img src={product.image} alt={product.name} />
            <p>{product.name}</p>
            <p>${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;