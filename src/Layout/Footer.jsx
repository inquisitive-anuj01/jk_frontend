import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

function Footer() {
  // Style for footer links hover effect
  const linkHoverStyle = {
    transition: 'color 0.3s ease'
  };

  const handleLinkHover = (e, isEnter) => {
    e.currentTarget.style.color = isEnter ? 'var(--color-primary)' : '';
  };

  return (
    <footer className="bg-[#0d0d0d] text-white/80">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg
                  viewBox="0 0 40 40"
                  className="w-8 h-8"
                  style={{ color: 'var(--color-primary)' }}
                  fill="currentColor"
                >
                  <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 14h4v12h-4zM18 14h4l2 5-2 5v2h-4v-2l2-5-2-5z" />
                  <circle cx="20" cy="20" r="4" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
              <span className="text-xl font-light text-white tracking-wider">
                <span className="font-semibold">JK</span> Executive
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 mb-6">
              London's premier chauffeur service. Experience luxury, reliability,
              and professionalism with every journey.
            </p>
            <div className="flex gap-4">
              {/* Social Icons */}
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--color-primary-rgb), 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              >
                <span className="text-xs">FB</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--color-primary-rgb), 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              >
                <span className="text-xs">IG</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--color-primary-rgb), 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              >
                <span className="text-xs">TW</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/booking" className="text-sm transition-colors" style={linkHoverStyle} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>Book a Ride</Link></li>
              <li><a href="#" className="text-sm transition-colors" style={linkHoverStyle} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>Our Fleet</a></li>
              <li><a href="#" className="text-sm transition-colors" style={linkHoverStyle} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>Services</a></li>
              <li><a href="#" className="text-sm transition-colors" style={linkHoverStyle} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>About Us</a></li>
              <li><a href="#" className="text-sm transition-colors" style={linkHoverStyle} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-6">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm transition-colors" style={linkHoverStyle} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>Airport Transfers</a></li>
              <li><a href="#" className="text-sm transition-colors" style={linkHoverStyle} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>Business Travel</a></li>
              <li><a href="#" className="text-sm transition-colors" style={linkHoverStyle} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>Wedding Cars</a></li>
              <li><a href="#" className="text-sm transition-colors" style={linkHoverStyle} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>Event Transport</a></li>
              <li><a href="#" className="text-sm transition-colors" style={linkHoverStyle} onMouseEnter={(e) => handleLinkHover(e, true)} onMouseLeave={(e) => handleLinkHover(e, false)}>Corporate Accounts</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-1" style={{ color: 'var(--color-primary)' }} />
                <div>
                  <p className="text-sm">+44 (0)20 1234 5678</p>
                  <p className="text-xs text-white/50">Available 24/7</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1" style={{ color: 'var(--color-primary)' }} />
                <div>
                  <p className="text-sm">info@jkexecutive.co.uk</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1" style={{ color: 'var(--color-primary)' }} />
                <div>
                  <p className="text-sm">London, United Kingdom</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © 2026 JK Executive. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;