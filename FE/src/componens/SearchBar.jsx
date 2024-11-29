import React, { useState } from 'react';
import axios from 'axios';

function SearchBar() {
  const [transactionId, setTransactionId] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/sales?transactionId=${transactionId}`);
      if (response.data.length === 0) {
        alert('Transaksi tidak ditemukan.');
        setShowModal(false);  // Menutup modal jika tidak ada data
      } else {
        setSelectedTransaction(response.data[0]); // Ambil transaksi pertama
        setShowModal(true); // Tampilkan modal
        console.log("Data Transaksi:", response.data);
      }
    } catch (error) {
      console.error("Ada masalah saat mencari transaksi:", error);
      alert('Ada masalah saat mencari transaksi: ' + error.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="max-w-screen flex justify-center mt-4">
      <form className="max-w-md mx-auto" onSubmit={handleSearch}>
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input 
            type="search" 
            id="default-search" 
            value={transactionId} 
            onChange={(e) => setTransactionId(e.target.value)} 
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }} 
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Cari Transaksi Disini" 
            required 
          />
        </div>
      </form>

      {showModal && selectedTransaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <button 
              onClick={handleCloseModal} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times; {/* Icon close button */}
            </button>
            <h2 className="text-lg font-bold">Detail Transaksi</h2>
            <p><strong>Nama Customer:</strong> {selectedTransaction.customer_name}</p>
            <p><strong>Status:</strong> {selectedTransaction.status}</p>
            <p><strong>Jasa Kirim:</strong> {selectedTransaction.pengiriman}</p>
            <p><strong>No Resi:</strong> {selectedTransaction.no_resi}</p>
            <button 
              onClick={handleCloseModal} 
              className="mt-4 text-white bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;