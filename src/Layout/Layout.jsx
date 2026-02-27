import React from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

function Layout({ children, isHeroPage = false, headerTheme = 'dark' }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isTransparent={isHeroPage} theme={headerTheme} />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default Layout;