import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import RegisterModal from './Register'; // import your modal
import { Link, useNavigate } from 'react-router-dom';
import SearchInput from "./SearchInput";


const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // modal state

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (query) => {
    if (!query.trim()) return;
    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    setIsMenuOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsMenuOpen(false); // optional: close mobile menu when opening modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <nav className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-1">
                <img src='/sceneit.png' width={35} alt="SceneIt" />
                <span className="font-medium text-3xl">SceneIt</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-10">
                <a
                  href="#"
                  className="hover:text-secondary transition-colors duration-200 font-normal"
                >
                  Log In
                </a>
                <button
                  onClick={openModal}
                  className="hover:text-secondary transition-colors duration-200 font-normal"
                >
                  Create an Account
                </button>
                <Link
                  to="/"
                  className="hover:text-secondary transition-colors duration-200 font-normal"
                >
                  Shows
                </Link>
                <a
                  href=""
                  className="hover:text-secondary transition-colors duration-200 font-normal"
                >
                  Playlists
                </a>
              </div>
            </div>

            {/* Search Bar */}
                <div className="hidden md:block">
            <SearchInput placeholder="Search" onSearch={handleSearch} />
          </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-300 hover:text-white focus:outline-none focus:text-white transition-colors duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-700">
              <div className="relative mb-4 px-3">
               <SearchInput placeholder="Search" onSearch={handleSearch} />
              </div>
              <a
                href="#"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-600 transition-all duration-200"
              >
                Log In
              </a>
              <button
                onClick={openModal}
                className="text-gray-300 block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-slate-600 transition-all duration-200"
              >
                Create an Account
              </button>
              <Link
                to=""
                className="hover:text-secondary transition-colors duration-200 font-normal"
              >
                Shows
              </Link>
              <a
                href=""
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-600 transition-all duration-200"
              >
                Playlists
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Register Modal */}
      <RegisterModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Nav;