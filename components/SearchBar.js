// components/SearchBar.js

import { useState } from 'react';
import { useRouter } from 'next/router';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="max-w-[680px] flex sm:flex-row justify-center m-auto">
    <form onSubmit={handleSearch} className="flex">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="flex border border-gray-300 p-2 rounded text-black"
      />
      <button type="submit" className="ml-3 p-2 rounded-r-md flex items-center justify-center">🔍</button>
    </form>
    </div>
  );
};

export default SearchBar;