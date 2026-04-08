import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="container">
      <header>
        <nav>
          <ul>
            <li><a href="#">Clock In/Out</a></li>
            <li><a href="#">Employee List</a></li>
            <li><a href="#">Settings</a></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2023 Clock In/Out App</p>
      </footer>
    </div>
  );
};

export default Layout;