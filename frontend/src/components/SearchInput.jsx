import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function SearchInput({ value, onChange }) {
  return (
    <form className="relative flex items-center w-full max-w-md ease-in-out cursor-pointer">
      <Search className="absolute left-5 text-gray-400 w-5 h-5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search for shows...'
        className="bg-primary border text-gray/400 placeholder-gray-400/90 rounded-full px-4 mx-2 my-4 py-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
      />
    </form>
  );
};