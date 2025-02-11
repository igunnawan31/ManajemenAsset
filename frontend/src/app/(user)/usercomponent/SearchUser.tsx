"use client";

import { useState } from "react";
import { IoSearch } from "react-icons/io5";

interface SearchUserProps {
  placeholder?: string;  // Fix: Proper type for placeholder
  onSearch: (query: string) => void;
}

const SearchUser: React.FC<SearchUserProps> = ({ placeholder = "Search...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative flex h-14">
      <input
        type="text"
        className="w-full py-2 pl-10 text-sm outline-none border-2 font-sans"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      <IoSearch className="absolute left-3 top-[1.2rem] h-5 w-5 text-gray-500" />
    </div>
  );
};

export default SearchUser;
