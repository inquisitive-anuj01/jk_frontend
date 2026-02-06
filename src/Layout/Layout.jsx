import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children, isHeroPage = false, headerTheme = 'dark' }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isTransparent={isHeroPage} theme={headerTheme} />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;