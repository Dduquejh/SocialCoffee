import React, { useState } from 'react';
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaHome,
  FaStore,
  FaComments,
} from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/home', label: 'Inicio', icon: <FaHome /> },
    { href: '/store', label: 'Tienda', icon: <FaStore /> },
    { href: '/blog', label: 'Blog', icon: <FaComments /> },
    { href: '/shopping-cart', label: 'Carrito', icon: <FaShoppingCart /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#F5F0E6] shadow-md px-4 py-3 rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/Icon.png"
                alt="Logo SocialCoffee"
                className="h-12 w-auto"
              />
              <span className="text-xl font-bold text-gray-800">SocialCoffee</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-lg font-medium">
            {navItems.map(({ href, label, icon }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2 text-gray-800 hover:text-[#F4A698] transition-colors duration-200"
              >
                <span className="text-xl">{icon}</span>
                {label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-800 hover:text-[#F5E1C0] focus:outline-none text-2xl"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-3 text-lg font-medium">
          {navItems.map(({ href, label, icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-3 text-gray-800 hover:text-[#F5E1C0] transition-colors duration-200"
            >
              <span className="text-xl">{icon}</span>
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
