import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--color-dark)' }}>
      <div className="text-center max-w-2xl w-full">
        {/* 404 Text with Gold Gradient */}
        <h1 
          className="font-bold mb-4 leading-none"
          style={{ 
            fontSize: 'clamp(4rem, 15vw, 12rem)',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          404
        </h1>
        
        {/* Subtitle */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 sm:mb-6">
          Page Not Found
        </h2>
        
        {/* Description */}
        <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 px-2 max-w-lg mx-auto leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-dark transition-all duration-300 transform hover:scale-105 btn-glow text-sm sm:text-base"
            style={{ 
              backgroundColor: 'var(--color-primary)',
              boxShadow: '0 0 20px rgba(215, 183, 94, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-primary-hover)';
              e.target.style.boxShadow = '0 0 30px rgba(215, 183, 94, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--color-primary)';
              e.target.style.boxShadow = '0 0 20px rgba(215, 183, 94, 0.3)';
            }}
          >
            Back to Home
          </Link>
          
          <Link
            to="/fleet"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold border-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            style={{ 
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-primary)';
              e.target.style.color = 'var(--color-dark)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'var(--color-primary)';
            }}
          >
            View Our Fleet
          </Link>
        </div>
        
        {/* Decorative Elements */}
        <div className="mt-12 sm:mt-16 flex justify-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
          ></div>
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--color-primary-light)' }}
          ></div>
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--color-primary)' }}
          ></div>
        </div>
        
        {/* Contact Link */}
        <p className="mt-8 sm:mt-10 text-gray-500 text-xs sm:text-sm px-4">
          Need assistance?{' '}
          <Link 
            to="/contact" 
            className="text-primary hover:underline transition-colors"
            style={{ color: 'var(--color-primary)' }}
          >
            Contact Us
          </Link>
        </p>
      </div>
    </div>
  );
}

export default NotFound;
