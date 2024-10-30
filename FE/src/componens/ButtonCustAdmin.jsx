import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormCustAdmin from './FormCustAdmin'; // Impor komponen FormCust

function AddCustomer() {
  const [savedData, setSavedData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchSavedData = () => {
    axios.get('http://localhost:5000/customers')
      .then((response) => {
        setSavedData(response.data);
      })
      .catch((error) => {
        console.error("Ada masalah saat mengambil data", error);
      });
  };

  useEffect(() => {
    fetchSavedData();
  }, []);

  const handleAddCustomer = () => {
    fetchSavedData(); // Ambil data terbaru setelah menambahkan customer
  };

  return (
    <div>
      {/* Tombol untuk menambahkan customer dengan gaya baru */}
      <button 
        type="button" 
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
        onClick={() => setShowModal(true)}>
        Tambah Customer
      </button>

      {showModal && (
        <FormCustAdmin 
          closeModal={() => setShowModal(false)} 
          onSave={handleAddCustomer} 
        />
      )}
    </div>
  );
}

export default AddCustomer;