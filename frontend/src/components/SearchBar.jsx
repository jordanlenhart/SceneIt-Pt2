import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchBar = ({ placeholder = "Search for shows..." }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Navigate to the /search page with query in the URL
    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    setQuery(""); // optional: clear after search
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-md"
    >
      <Search className="absolute left-3 text-gray-400 w-5 h-5 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="bg-primary border text-white placeholder-gray-300 rounded-full px-4 py-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
      />
    </form>
  );
};

export default SearchBar;
