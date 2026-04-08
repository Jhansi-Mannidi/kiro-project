import React from 'react';
import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <main>
        <MainContent />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;