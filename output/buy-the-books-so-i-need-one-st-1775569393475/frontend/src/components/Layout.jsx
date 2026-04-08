import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="container">
      <header>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2023 Buy The Books So I Need One Store</p>
      </footer>
    </div>
  );
};

export default Layout;