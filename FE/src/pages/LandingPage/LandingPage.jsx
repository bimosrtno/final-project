import React, { useState } from "react";
import { Helmet } from "react-helmet";
import SearchBar from "../../componens/SearchBar"; 
import "../../CSS/Navbar.css";
import "../../CSS/Body.css";
import FormCust from "../../componens/FormCust"; 

const LandingPage = () => {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
  };

  const products = [
    { id: 1, name: "Pupuk Urea", description: "Dengan kandungan nitrogen yang mencapai 46%, Pupuk Urea memberikan nutrisi yang intensif dan cepat diserap oleh tanaman, membantu mendorong pertumbuhan daun yang subur dan produktivitas yang optimal." },
    { id: 2, name: "Pupuk NPK", description: "Solusi pupuk komposisi seimbang yang mengandung Nitrogen (N), Fosfor (P), dan Kalium (K). Dirancang khusus untuk memenuhi kebutuhan nutrisi tanaman secara menyeluruh, Pupuk NPK mendukung pertumbuhan akar yang kuat, meningkatkan ketahanan tanaman, dan memperbaiki kualitas hasil panen." },
    { id: 3, name: "Pupuk Cair", description: "Formulasi khusus kami memastikan unsur hara cepat diserap, mendukung pertumbuhan yang lebih cepat dan kekuatan tanaman yang lebih baik. Cocok untuk berbagai jenis tanaman, Pupuk Cair mengoptimalkan pemberian nutrisi melalui metode aplikasi yang praktis dan efisien." },
    { id: 4, name: "Pupuk Kadang", description: "Tingkatkan kesuburan tanah dan kesehatan tanaman Anda dengan Pupuk Kandang, solusi organik yang kaya nutrisi. Terbuat dari limbah ternak, Pupuk Kandang memperbaiki struktur tanah, meningkatkan kapasitas retensi air, dan menyediakan unsur hara penting untuk pertumbuhan tanaman yang optimal." },
    { id: 5, name: "Pupuk Sapi", description: "Dapatkan hasil pertanian yang lebih sehat dan berkelanjutan dengan Pupuk Sapi, solusi pupuk organik yang kaya akan unsur hara. Diperkaya dengan nutrisi alami, Pupuk Sapi meningkatkan kesuburan tanah, mendukung pertumbuhan tanaman, dan memperbaiki struktur tanah." },
  ];

  return (
    <div>
      <Helmet>
        <title>TemanTani</title>
      </Helmet>

      {/* Jumbotron Section */}
      <section className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')] relative">
        <div className="absolute top-4 left-4 z-20"> {/* Pindahkan ke kiri atas */}
          <SearchBar />
        </div>
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
          <h1 className="mb-4 mt-10 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Penuhi Kebutuhan Nutrisi Tanaman Anda dengan TemanTani
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
            TemanTani berkomitmen untuk menjadi pionir dalam industri pupuk, menyediakan solusi inovatif dan ramah lingkungan. Kami berkolaborasi dengan berbagai stakeholders untuk mengembangkan pupuk berkualitas tinggi yang memenuhi kebutuhan spesifik tanaman, menjaga ekosistem, dan meningkatkan hasil pertanian berkelanjutan.
          </p>
        </div>
        <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
      </section>

      {/* Produk */}
      <div className="flex flex-col items-center justify-start min-h-screen bg-white text-gray-800 text-center p-4 pt-16">
        <h2 className="text-3xl font-bold mb-6">Produk Kami</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-screen-lg">
          {products.map((product) => (
            <div key={product.id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <a href="#">
                <img className="rounded-t-lg object-cover w-full h-48" src="./src/assets/contoh.jpg" alt={product.name} />
              </a>
              <div className="p-5">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✖️</button>
            <FormCust onClose={handleCloseModal} />
          </div>
        </div>
      )}

      {/* Card Section */}
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-10 mx-auto text-center">
        <a href="#">
          <img 
            className="rounded-t-lg w-full h-64 object-cover" 
            src="./src/assets/petani.jpg" 
            alt="Petani Image" 
          />
        </a>
        <div className="p-5">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Bergabunglah dengan kami
            </h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Bergabunglah dengan kami untuk menjadi bagian dari revolusi pertanian yang lebih baik dan lebih efisien.
          </p>
          <button 
            onClick={handleButtonClick} 
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Lebih dekat dengan kami
            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;