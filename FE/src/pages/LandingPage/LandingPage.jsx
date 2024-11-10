import React, { useState } from "react"; // Import useState
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

  // Daftar produk
  const products = [
    { id: 1, name: "Pupuk Organik A", description: "Pupuk ramah lingkungan untuk hasil maksimal." },
    { id: 2, name: "Pupuk NPK B", description: "NPK seimbang untuk pertumbuhan optimal." },
    { id: 3, name: "Pupuk Hayati C", description: "Meningkatkan kesehatan tanah dan tanaman." },
    { id: 4, name: "Pupuk Cair D", description: "Solusi cepat untuk nutrisi tanaman." },
    { id: 5, name: "Pupuk Ponsel E", description: "Memudahkan aplikasi pupuk di lahan." },
  ];

  return (
    <div>
      <Helmet>  
        <title>TemanTani</title>
      </Helmet>
      <Navbar />
      <div className="flex flex-col items-center justify-start min-h-screen bg-white text-gray-800 text-center p-4 pt-16">
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

        <h2 className="text-3xl font-bold mb-6">Produk Kami</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-screen-lg">
          {products.map(product => (
            <div key={product.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{product.name}</div>
                <p className="text-gray-700 text-base">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tambahkan margin atas untuk jarak lebih jauh */}
        <button 
          onClick={handleButtonClick} 
          className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-gray-700 hover:text-white transition duration-200 mt-20"
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