import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <header>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Movies</a></li>
            <li><a href="#">Tickets</a></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2023 Movie Ticket App</p>
      </footer>
    </div>
  );
};

export default Layout;