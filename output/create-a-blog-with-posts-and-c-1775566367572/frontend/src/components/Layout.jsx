import React from 'react';
import Header from './Header';
import MainContent from './MainContent';

const Layout = () => {
  return (
    <div className="container">
      <Header />
      <main>
        <MainContent />
      </main>
      <footer>
        Copyright &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Layout;