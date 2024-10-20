import React from 'react';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <a href="/" className="logo">Logo</a>
        <ul className="nav-links">
          <li><a href="/">Beranda</a></li>
          <li><a href="/tentang">Tentang</a></li>
          <li><a href="/layanan">Layanan</a></li>
          <li><a href="/kontak">Kontak</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;