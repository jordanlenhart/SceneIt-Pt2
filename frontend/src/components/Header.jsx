import { useState, useEffect } from "react";
import { TextSearch } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import SearchSidebar from "./SearchSidebar";


export default function Header() {
  const { user, setUser } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  /// Scroll threshold for header style
  useEffect(() => {
    const handleScroll = () => {
      const threshold = 8;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <>
      <header
        id="header"
        className={`min-w-md fixed top-0 left-0 right-0 z-50 transition-[width,margin,padding,transform,background-color,border-radius] duration-700 ease-in-out ${isScrolled
          ? "w-[92%] bg-[#05000c] text-gray-100 mt-6 px-10 py-6 shadow-[0px_2px_18px_4px_rgba(255,255,255,0.48)] rounded-2xl border-3 border-white/30 mx-auto"
          : "w-full backdrop-blur-sm text-gray-900 py-8 px-20 bg-transparent"
          }`}
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink to='/' className="text-4xl font-bold text-gray-700 dark:text-white cursor-pointer flex items-center gap-2">
            <img src="/sceneit.png" width={35} alt="SceneIt" />
            <span className='hidden lg:inline'>SceneIt</span>
          </NavLink>

          {/* Nav */}
          <nav
            className={`${isScrolled
              ? "text-gray-200 dark:text-gray-300"
              : "text-gray-700 dark:text-gray-200"
              }`}
          >
            <ul className="flex space-x-8 items-center text-gray-700 dark:text-gray-300 transition-all duration-200">
              {/* Browse */}
              <NavLink to='/search' className='font-semibold text-lg cursor-pointer hover:underline'>
                <li>Browse</li>
              </NavLink>

              {/* Conditional Auth Logic */}
              {!user ? (
                <NavLink to='/auth' className='font-semibold text-lg cursor-pointer hover:underline'>
                  <li>Login</li>
                </NavLink>
              ) : (
                <NavLink to={`/${user.username}`} className='font-semibold text-lg cursor-pointer hover:underline'>
                  <li>@{user.username}</li>
                </NavLink>
              )}

              {/* Search Icon */}
              <li>
                <TextSearch
                  onClick={() => setIsSidebarOpen(true)}
                  size={24}
                  className='cursor-pointer hover:scale-[1.15] transition-all duration-300 hover:text-green-400'
                />
              </li>
            </ul>

          </nav>
        </div>
      </header>

      <SearchSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
