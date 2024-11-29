import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    database: false,
    oprasional: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu], // Toggle the current menu
    }));
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-48 h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-8">TemanTani</h2>
      
      <ul className="space-y-6">
        <li>
          <Link 
            to="/super-admin" 
            className="text-gray-300 bg-transparent hover:text-white focus:ring-0 font-medium rounded-lg text-m px-5 py-2.5 w-full text-left"
          >
            Performance 
          </Link>
        </li>
        <li>
          <button onClick={() => toggleMenu('database')} className="flex items-center w-full text-left py-2 bg-transparent text-gray-300 hover:text-white focus:outline-none">
            <span className="flex-1">Database</span>
            <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
          </button>
          {openMenus.database && (
            <ul className="mt-2 bg-transparent rounded pl-4">
              <li>
                <Link to="/super-admin/database-inventoris" className="block px-4 py-2 text-gray-300 hover:text-white focus:outline-none">
                  Inventoris 
                </Link>
              </li>
              <li>
                <Link to="/super-admin/database-sales" className="block px-4 py-2 text-gray-300 hover:text-white focus:outline-none">
                  Penjualan 
                </Link>
              </li>
            </ul>
          )}
        </li>
        
        <li>
          <button onClick={() => toggleMenu('oprasional')} className="flex items-center w-full text-left py-2 bg-transparent text-gray-300 hover:text-white focus:outline-none">
            <span className="flex-1">Operasional</span>
            <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
          </button>
          {openMenus.oprasional && (
            <ul className="mt-2 bg-transparent rounded pl-4">
              <li>
                <Link to="/super-admin/admin" className="block px-4 py-2 text-gray-300 hover:text-white focus:outline-none">
                  Daftar Admin
                </Link>
              </li>
              <li>
                <Link to="/super-admin/template" className="block px-4 py-2 text-gray-300 hover:text-white focus:outline-none">
                  Template
                </Link>
              </li>
            </ul>
          )}
        </li>
        
        <li>
          <button 
            className="flex items-center w-full text-left py-2 bg-transparent text-gray-300 hover:text-white focus:outline-none rounded-lg text-m px-5"
            onClick={() => window.location.href = '/login'} // Navigate for Log Out
          >
            Log Out
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;