import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';
import JkLogo from "../assets/JkLogo.png"

// Navigation items configuration
const NAV_ITEMS = [
  {
    label: 'Our Cars',
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Mercedes S-Class', href: '#' },
      { label: 'Mercedes V-Class', href: '#' },
      { label: 'Mercedes E-Class', href: '#' },
      { label: 'Range Rover', href: '#' },
      { label: 'BMW 7 Series', href: '#' },
    ],
  },
  {
    label: 'Our Services',
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Airport Transfers', href: '#' },
      { label: 'Business Travel', href: '#' },
      { label: 'Corporate Events', href: '#' },
      { label: 'Roadshows', href: '#' },
    ],
  },
  {
    label: 'Our Fleet',
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Executive Sedans', href: '#' },
      { label: 'Luxury SUVs', href: '#' },
      { label: 'MPVs & Vans', href: '#' },
      { label: 'Minibuses', href: '#' },
    ],
  },
  {
    label: 'Events',
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Weddings', href: '#' },
      { label: 'Proms', href: '#' },
      { label: 'Special Occasions', href: '#' },
      { label: 'Corporate Events', href: '#' },
    ],
  },
  { label: 'Blog', href: '#', hasDropdown: false },
  { label: 'About Us', href: '#', hasDropdown: false },
  { label: 'Contact Us', href: '#', hasDropdown: false },
];

function Header({ isTransparent = false, theme = 'dark' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Determine header style based on scroll and page
  const shouldBeTransparent = isTransparent && isHomePage && !isScrolled;
  const isLightTheme = theme === 'light';

  // Dynamic classes based on theme
  const headerBg = shouldBeTransparent
    ? 'bg-transparent'
    : isLightTheme
      ? 'bg-white shadow-md'
      : 'bg-gradient-to-r from-[#1a1a1a]/95 via-[#787777]/95 to-[#1a1a1a]/95 backdrop-blur-md shadow-lg';

  const textColor = shouldBeTransparent || !isLightTheme
    ? 'text-white/80 hover:text-white'
    : 'text-gray-700 hover:text-gray-900';

  const phoneIconBg = shouldBeTransparent || !isLightTheme
    ? 'bg-white/10 group-hover:bg-white/20'
    : 'bg-gray-100 group-hover:bg-gray-200';

  const logoTextColor = shouldBeTransparent || !isLightTheme
    ? 'text-white'
    : 'text-gray-900';

  const navTextColor = shouldBeTransparent || !isLightTheme
    ? 'text-white/80 hover:text-white'
    : 'text-gray-700 hover:text-gray-900';

  const borderColor = shouldBeTransparent || !isLightTheme
    ? 'via-white/20'
    : 'via-gray-200';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
      >
        {/* Top Bar */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Phone Number - Left on desktop, hidden on mobile */}
            <a
              href="tel:+442012345678"
              className={`hidden md:flex items-center gap-2 transition-colors group ${textColor}`}
            >
              <span className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${phoneIconBg}`}>
                <Phone className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm font-medium">
                +44 (0)20 1234 5678
              </span>
            </a>

            {/* Logo - Left on mobile, Center on desktop */}
            <Link to="/" className="flex items-center gap-3 group md:absolute md:left-1/2 md:-translate-x-1/2">
              {/* Logo Image */}
              <img
                src={JkLogo}
                alt="JK Executive Logo"
                className="w-24 h-18 md:w-28 md:h-20 object-contain flex-shrink-0"
              />

              {/* Logo Text - animates on scroll (hides when scrolled, shows at top) */}
              <motion.div
                className="overflow-hidden"
                initial={{ width: 'auto', opacity: 1 }}
                animate={{
                  width: isScrolled ? 0 : 'auto',
                  opacity: isScrolled ? 0 : 1,
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <span className={`text-2xl md:text-3xl font-light tracking-wider whitespace-nowrap block ${logoTextColor}`}>
                  <span className="font-semibold">JK</span> Executive
                </span>
              </motion.div>
            </Link>

            {/* Right side container */}
            <div className="flex items-center gap-3">
              {/* Mobile Book Now Button - Shows when scrolled (replaces logo text space) */}
              <AnimatePresence>
                {isScrolled && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="md:hidden"
                  >
                    <Link
                      to="/booking"
                      className="px-4 py-2 text-black font-semibold text-xs uppercase tracking-wider rounded transition-all duration-300 whitespace-nowrap"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                      }}
                    >
                      Book Now
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Book Now Button (Desktop only) */}
              <Link
                to="/booking"
                className="hidden md:block px-4 py-2.5 md:px-6 text-black font-semibold text-sm uppercase tracking-wider rounded transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  boxShadow: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(var(--color-primary-rgb), 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Book Now
              </Link>

              {/* Mobile Menu Button (Right side on mobile) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 ${shouldBeTransparent || !isLightTheme ? 'text-white' : 'text-gray-900'}`}
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation Bar - Desktop */}
          <nav className="hidden lg:flex items-center justify-center gap-1 pb-4">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className={`nav-link-underline flex items-center gap-1 px-4 py-2 text-sm transition-colors uppercase tracking-wider font-medium ${navTextColor}`}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''
                        }`}
                    />
                  )}
                </a>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.hasDropdown && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full left-0 mt-2 min-w-[200px] rounded-lg shadow-xl overflow-hidden ${isLightTheme
                        ? 'bg-white border border-gray-200'
                        : 'bg-[#1a1a1a] border border-white/10'
                        }`}
                    >
                      {item.dropdownItems.map((dropdownItem) => (
                        <a
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className={`block px-4 py-3 text-sm transition-colors ${isLightTheme
                            ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          {dropdownItem.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Bottom Border */}
          <div className="flex justify-center">
            <div className={`w-[80%] h-px bg-gradient-to-r from-transparent to-transparent ${borderColor}`} />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#1a1a1a] z-50 lg:hidden flex flex-col"
          >
            {/* Close Button - Fixed at top */}
            <div className="flex justify-end p-4 flex-shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white transition-colors"
                style={{ hover: { color: 'var(--color-primary)' } }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-8">
              {/* Mobile Nav Items */}
              {NAV_ITEMS.map((item) => (
                <MobileNavItem key={item.label} item={item} />
              ))}

              {/* Mobile CTA */}
              <Link
                to="/booking"
                className="block mt-8 px-6 py-3 text-black font-semibold text-center uppercase tracking-wider rounded transition-colors"
                style={{ backgroundColor: 'var(--color-primary)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Now
              </Link>

              {/* Mobile Phone */}
              <a
                href="tel:+442012345678"
                className="flex items-center justify-center gap-2 mt-6 text-white/70 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+44 (0)20 1234 5678</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Mobile Navigation Item Component
function MobileNavItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.hasDropdown) {
    return (
      <a
        href={item.href}
        className="block py-3 text-white/80 hover:text-white border-b border-white/10 uppercase tracking-wider text-sm font-medium"
      >
        {item.label}
      </a>
    );
  }

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 text-white/80 hover:text-white uppercase tracking-wider text-sm font-medium"
      >
        {item.label}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-4">
              {item.dropdownItems.map((dropdownItem) => (
                <a
                  key={dropdownItem.label}
                  href={dropdownItem.href}
                  className="block py-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  {dropdownItem.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Header;