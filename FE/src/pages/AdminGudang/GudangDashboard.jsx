import React from 'react';
import { Link } from 'react-router-dom'; 

function GudangDashboard() {
  return (
    <div className="container">  
      <p>Ini adalah contoh dashboard sederhana.</p>
      <Link to="/login">Login</Link> 
    </div>
  );
}

export default GudangDashboard ; 