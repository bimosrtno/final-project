import React, { useState } from 'react';
import '../CSS/Sidebar.css'; // Pastikan untuk mengimpor file CSS

const Sidebar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>Performance</li>
        <li>
          <div onClick={toggleDropdown} className="dropdown-toggle">
            Database
          </div>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li>Inventoris</li>
              <li>Sales</li>
            </ul>
          )}
        </li>
        <li>Admin List</li>
      </ul>
    </div>
  );
};

export default Sidebar;
