"use client";

import { useState } from "react";
import { IoSearch } from "react-icons/io5";

interface SearchProps {
  placeholder?: string; 
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ placeholder = "Search...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full">
      <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
      <input
        type="text"
        className="w-full h-12 pl-10 pr-4 text-sm rounded-lg border border-[#202B51] outline-none font-sans"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
    </div>
  );
};

export default Search;
