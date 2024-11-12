import React, { useState } from 'react';
import axios from 'axios';

function SearchBar() {
  const [transactionId, setTransactionId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    axios.get(`http://localhost:5000/api/sales?transactionId=${transactionId}`)
      .then(response => {
        if (response.data.length === 0) {
          alert('Transaksi tidak ditemukan.');
        } else {
          setTransactions(response.data);
          console.log("Data Transaksi:", response.data);
        }
      })
      .catch(error => {
        console.error("Ada masalah saat mencari transaksi:", error);
        alert('Ada masalah saat mencari transaksi: ' + error.message);
      });
  };

  const handleTransactionClick = (transaction) => {
    console.log("Transaction Selected:", transaction);
    setSelectedTransaction(transaction);
    setShowModal(true);
    setTransactions([]); // Mengosongkan daftar transaksi setelah memilih
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="max-w-md mx-auto mt-4">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          className="border rounded-l-md p-2 w-full"
          placeholder="Cari Transaksi Disini"
          required
        />
        {/* Make the button wider */}
        <button type="submit" className="bg-blue-500 text-white p-2 w-28 rounded-r-md">
          Cari
        </button>
      </form>

      {transactions.length > 0 && (
        <ul className="mt-2">
          {transactions.map((transaction) => (
            <li 
              key={transaction.id_transaksi} 
              className="border rounded p-2 mt-1 cursor-pointer hover:bg-blue-100" 
              onClick={() => handleTransactionClick(transaction)}
            >
              ID: {transaction.id_transaksi} - {transaction.customer_name}
            </li>
          ))}
        </ul>
      )}

      {showModal && selectedTransaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <button 
              onClick={handleCloseModal} 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖️
            </button>
            <h2 className="text-lg font-bold">Detail Transaksi</h2>
            <p><strong>Nama Customer:</strong> {selectedTransaction.customer_name}</p>
            <p><strong>Telepon:</strong> {selectedTransaction.phone}</p>
            <p><strong>Alamat:</strong> {selectedTransaction.address}</p>
            <p><strong>Status:</strong> {selectedTransaction.status}</p>
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
