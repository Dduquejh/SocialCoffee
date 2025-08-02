
import React, { useState } from 'react';
import { FaShoppingCart, FaHome, FaStore, FaComments, FaUserAlt } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img src="/src/assets/Icon.png" alt="Logo" className="h-15 w-auto mr-2" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center w-auto">
            <a href="/home" className="flex items-center gap-2 text-gray-900 hover:text-blue-600">
              <FaHome className="transition-transform duration-200 group-hover:scale-110"/>
              Inicio
            </a>

            <a href="/store" className="flex items-center gap-2 text-gray-900 hover:text-blue-600">
              <FaStore className="transition-transform duration-200 group-hover:scale-110" />
              Tienda
            </a>
            <a href="/forum" className="flex items-center gap-2 text-gray-900 hover:text-blue-600">
              <FaComments  className="transition-transform duration-200 group-hover:scale-110"/>
              Foro
            </a>
            <a href="/shopping-cart" className="flex items-center gap-2 text-gray-900 hover:text-blue-600">
              <FaShoppingCart className="transition-transform duration-200 group-hover:scale-110" />
              Carrito
            </a>
            <a href="/profile" className="flex items-center gap-2 text-gray-900 hover:text-blue-600">
              <FaUserAlt className="transition-transform duration-200 group-hover:scale-110"/>
              Perfil
            </a>

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-3 space-y-1">
          <a href="/home" className="flex items-center gap-2 text-gray-900 hover:text-blue-600">
              <FaHome className="transition-transform duration-200 group-hover:scale-110"/>
              Inicio
            </a>

            <a href="/store" className="flex items-center gap-2 text-gray-900 hover:text-blue-600">
              <FaStore className="transition-transform duration-200 group-hover:scale-110" />
              Tienda
            </a>
            <a href="/forum" className="flex items-center gap-2 text-gray-900 hover:text-blue-600">
              <FaComments  className="transition-transform duration-200 group-hover:scale-110"/>
              Foro
            </a>
            <a href="/shopping-cart" className="flex items-center gap-2 text-gray-900 hover:text-blue-600">
              <FaShoppingCart className="transition-transform duration-200 group-hover:scale-110" />
              Carrito
            </a>
            <a href="/profile" className="flex items-center gap-2 text-gray-900 hover:text-blue-600">
              <FaUserAlt className="transition-transform duration-200 group-hover:scale-110"/>
              Perfil
            </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
