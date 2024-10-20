import React from "react";
import Navbar from "../../componens/NavBar"; // Perbaiki path ke file Navbar.js 
import "../../CSS/Navbar.css"; // Pastikan path ke file Navbar.css benar
import "../../CSS/Body.css"; // Pastikan path ke file Body.css benar
import FormCust from "../../componens/FormCust"; // Pastikan path ke file FormCust.jsx benar

function LandingPage() {
  return (
    <div className="body">
      <Navbar />
      <FormCust />
    </div>
  );
}

export default LandingPage;