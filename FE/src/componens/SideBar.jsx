import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Pastikan Anda mengimpor Link dari react-router-dom
import '../CSS/Sidebar.css'; // Pastikan untuk mengimpor file CSS

const Sidebar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="sidebar bg-gray-800 text-white h-full p-4">
      <h2 className="text-xl font-bold">TemanTani</h2>
      <ul>
        <li>
          <Link to="/super-admin" className="text-gray-300 hover:text-white">
            Performance 
          </Link>
        </li>
        <li>
          <div onClick={toggleDropdown} className="dropdown-toggle text-gray-300 cursor-pointer hover:text-white">
            Database
          </div>
          {isDropdownOpen && (
            <ul className="dropdown-menu mt-2 bg-gray-700 rounded">
              <li>
                <Link
                  to="/super-admin/database-inventoris" 
                  className="block px-4 py-2 text-gray-300 hover:text-white"
                >
                  Inventoris 
                </Link>
              </li>
              <li>
                <Link 
                  to="/super-admin/database-sales" 
                  className="block px-4 py-2 text-gray-300 hover:text-white"
                >
                  Sales 
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="text-gray-300 hover:text-white cursor-pointer">Admin List</li>
        <li>
          <Link to="/login" className="text-gray-300 hover:text-white">
            Log Out
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;