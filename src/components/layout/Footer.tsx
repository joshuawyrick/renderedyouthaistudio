
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">
              Rendered <span className="text-accent">Youth</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Empowering young artists by turning their creativity into wearable art. 
              Every drawing tells a story, every T-shirt supports a dream.
            </p>
          </div>
          
          {/* Explore Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/store" className="text-gray-400 text-sm hover:text-accent transition-colors duration-200">
                  Shop Designs
                </Link>
              </li>
              <li>
                <Link to="/creators" className="text-gray-400 text-sm hover:text-accent transition-colors duration-200">
                  Meet Creators
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 text-sm hover:text-accent transition-colors duration-200">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-gray-400 text-sm hover:text-accent transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 text-sm hover:text-accent transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 text-sm hover:text-accent transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Rendered Youth. Made with <span className="text-[hsl(var(--heart-red))]">❤️</span> for young artists everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
