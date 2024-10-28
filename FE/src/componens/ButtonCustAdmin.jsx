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

      <button onClick={() => setShowModal(true)}>Tambah Customer</button>

      {showModal && (
        <FormCustAdmin 
          closeModal={() => setShowModal(false)} 
          onSave={handleAddCustomer} 
        />
      )}

      <ul>
      </ul>
    </div>
  );
}

export default AddCustomer;
