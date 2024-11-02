import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Pastikan Anda mengimpor Link dari react-router-dom
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
        <li><Link to="/super-admin">Performance </Link></li>
        <li>
          <div onClick={toggleDropdown} className="dropdown-toggle">
            Database
          </div>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li><Link to="/super-admin/database-inventoris">Inventoris </Link></li>
              <li><Link to="/super-admin/database-sales">Sales </Link></li>
              <li><Link to="/super-admin/database-customer">Customer </Link></li>
            </ul>
          )}
        </li>
        <li>Admin List</li>
      </ul>
    </div>
  );
};

export default Sidebar;
