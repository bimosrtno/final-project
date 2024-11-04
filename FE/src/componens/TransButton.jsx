import React, { useState } from "react";
import SalesForm from "./TransForm"; // Pastikan path ini sesuai dengan lokasi file SalesForm
import '../CSS/Popup.css'; // Pastikan Anda memiliki CSS untuk popup

const TransButton = () => {
  const [showSalesForm, setShowSalesForm] = useState(false);

  const handleOpenForm = () => {
    setShowSalesForm(true);
  };

  const handleCloseForm = () => {
    setShowSalesForm(false);
  };

  return (
    <div>
      {/* Tombol dari Flowbite */}
      <button 
        type="button" 
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={handleOpenForm}
      >
        Buat Transaksi
      </button>

      {showSalesForm && (
        <div className="popup-overlay">
          <div className="popup-content">
            <SalesForm onClose={handleCloseForm} />
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={handleCloseForm}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransButton;