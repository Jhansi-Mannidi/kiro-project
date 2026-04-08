import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <nav>
          <ul>
            <li><a href="#">Clock In</a></li>
            <li><a href="#">Clock Out</a></li>
            <li><a href="#">Reports</a></li>
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