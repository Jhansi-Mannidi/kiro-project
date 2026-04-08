import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="container">
      <header>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2023 Blog App</p>
      </footer>
    </div>
  );
};

export default Layout;