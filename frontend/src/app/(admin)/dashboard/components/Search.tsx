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
    <div className=" flex h-14 poppins">
      <input
        type="text"
        className="w-full poppins py-2 pl-10 text-sm outline-none rounded-lg border border-[#202B51] font-sans"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      <IoSearch className="absolute left-3 top-[1.2rem] h-5 w-5 text-gray-500" />
    </div>
  );
};

export default Search;
