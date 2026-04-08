import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="home-page">
      <h1>Product Listing</h1>
      <input
        type="search"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search products..."
      />
      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;