import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="home-page">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="product-list">
          {products.map(product => (
            <li key={product.id}>
              <Link to={`/products/${product.id}`}>
                <ProductCard product={product} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;