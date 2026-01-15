import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import SearchInput from "./SearchInput";
import SidebarShowCard from './SidebarShowCard';

export default function SearchSidebar({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  /// Fetch logic (debounced, no AbortController)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }


    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
            query
          )}&include_adult=false&language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
            },
          }
        );

        const data = await res.json();
        console.log(data);

        /// show only movies and tv shows (exclude actors/actresses, etc)
        const filteredMedia = (data.results || []).filter((media) => media.media_type === 'movie' || media.media_type === 'tv');
        setResults(filteredMedia);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 750); // debounce delay

    return () => clearTimeout(timeout);
  }, [query]);


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* The blurred overlay */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-[6px] z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sidebar */}
          <motion.aside
            className="fixed top-0 right-0 h-full w-[33%] min-w-96 p-4 bg-[#05000c] border-l-2 border-gray-700/50 text-gray-400 shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.5 }}
          >
            <X onClick={onClose} size={32} className='self-end mb-8 cursor-pointer hover:text-white hover:scale-[1.15] transition-all duration-400 ease-in-out active:scale-[0.85]' />
            
            <div className="flex-1 overflow-y-auto">
              <SearchInput value={query} onChange={setQuery}/>

              {/* Results from search */}
              <div className="mt-4 space-y-3">
                {results.map((show) => (
                 <SidebarShowCard key={show.id} show={show} />
                ))}
              </div>
            </div>
            
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
