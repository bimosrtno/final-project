// src/NavBar.jsx
import React from 'react';
import SearchBar from './SearchBar';

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between p-1">
        <a href="/" className="text-lg font-bold">TemanTani</a>
        <div className="flex space-x-3">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;