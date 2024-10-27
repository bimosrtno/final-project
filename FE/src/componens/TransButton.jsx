import React, { useState } from "react";
import SalesForm from "./TransForm"; // Pastikan path ini sesuai dengan lokasi file SalesForm

const TransButton = () => {
  const [showSalesForm, setShowSalesForm] = useState(false);

  const handleToggleForm = () => {
    setShowSalesForm((prev) => !prev);
  };

  return (
    <div>
      <button onClick={handleToggleForm}>
        {showSalesForm ? "Tutup Form Transaksi" : "Transaksi"}
      </button>

      {showSalesForm && <SalesForm />}
    </div>
  );
};

export default TransButton;
