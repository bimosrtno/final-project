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
      <button onClick={handleOpenForm}>Transaksi</button>

      {showSalesForm && (
        <div className="popup-overlay">
          <div className="popup-content">
            <SalesForm onClose={handleCloseForm} />
            <button className="popup-close" onClick={handleCloseForm}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransButton;