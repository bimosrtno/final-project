import React, { useState } from "react"; // Import usage useState
import { Helmet } from "react-helmet";
import Navbar from "../../componens/NavBar"; // Perbaiki path ke file Navbar.js 
import "../../CSS/Navbar.css"; // Pastikan path ke file Navbar.css benar
import "../../CSS/Body.css"; // Pastikan path ke file Body.css benar
import FormCust from "../../componens/FormCust"; // Pastikan path ke file FormCust.jsx benar

const LandingPage = () => {
  // State untuk mengelola visibilitas formulir
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(true); // Set showForm menjadi true untuk menampilkan modal
  };

  const handleCloseModal = () => {
    setShowForm(false); // Menutup modal
  };

  return (
    <div>
      <Helmet>  
        <title>TemanTani</title>
      </Helmet>
      <Navbar />
      <div className="flex flex-col items-center justify-start min-h-screen bg-blue-500 text-white text-center p-4 pt-16"> {/* Ganti h-screen dengan min-h-screen dan padding top */}
        <h1 className="text-4xl font-bold mb-4">Selamat Datang di TemanTani</h1>
        <p className="text-xl mb-8 text-justify">
          TemanTani telah berkomitmen untuk menjadi pionir dalam industri pupuk, 
          menyediakan solusi yang inovatif dan ramah lingkungan sejak didirikan. 
          Kami memahami tantangan yang dihadapi petani dalam aksesibilitas dan 
          keberlanjutan produk pertanian, oleh karena itu kami berkolaborasi dengan 
          berbagai stakeholders untuk mengembangkan pupuk berkualitas tinggi yang 
          memenuhi kebutuhan spesifik tanaman dan menjaga ekosistem. Dengan memanfaatkan 
          teknologi modern, kami tidak hanya menyediakan produk pupuk, tetapi juga 
          menawarkan konsultasi untuk meningkatkan hasil pertanian, memastikan bahwa 
          petani kami dapat memaksimalkan potensi lahan mereka dengan cara yang 
          berkelanjutan. Bergabunglah dengan kami untuk menjadi bagian dari revolusi 
          pertanian yang lebih baik dan lebih efisien.
        </p>
        <button 
          onClick={handleButtonClick} 
          className="bg-white text-blue-500 px-6 py-3 rounded shadow hover:bg-gray-200 transition duration-200"
        >
          Lebih dekat dengan kami
        </button>
      </div>
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✖️</button>
            <FormCust onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;