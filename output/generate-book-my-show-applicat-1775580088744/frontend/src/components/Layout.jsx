import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="container">
      <header>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Shows</a></li>
            <li><a href="#">Bookings</a></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2023 Generate Book My Show</p>
      </footer>
    </div>
  );
};

export default Layout;