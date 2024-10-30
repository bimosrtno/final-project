import React, { useState } from 'react';
import axios from 'axios';

function AddStock({ inventories, setInventories }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantityToAdd, setQuantityToAdd] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal

  const handleAddQuantity = async () => {
    if (!selectedProduct || quantityToAdd === '' || Number(quantityToAdd) <= 0) {
      alert('Pilih produk dan masukkan jumlah yang valid');
      return;
    }

    try {
      // Update quantity in the backend
      await axios.patch(`http://localhost:5000/api/inventoris/${selectedProduct}`, {
        quantity: Number(quantityToAdd),
      });

      // Update the inventories state locally
      const updatedInventories = inventories.map((item) => {
        if (item.kode_produk === selectedProduct) {
          return {
            ...item,
            quantity: item.quantity + Number(quantityToAdd), // Update quantity locally
          };
        }
        return item;
      });

      setInventories(updatedInventories);
      setSelectedProduct('');
      setQuantityToAdd('');
      setIsModalOpen(false); // Tutup modal setelah berhasil

      // Alert success message
      alert('Stok berhasil diperbarui.');
    } catch (error) {
      console.error('Error updating quantity', error);
      alert('Terjadi kesalahan saat memperbarui quantity produk.');
    }
  };

  return (
    <div>
      {/* Tombol untuk membuka modal */}
      <button 
        data-modal-target="crud-modal" 
        data-modal-toggle="crud-modal" 
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
        type="button"
        onClick={() => setIsModalOpen(true)} // buka modal
      >
        Tambah Stok
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div id="crud-modal" tabindex="-1" aria-hidden="true" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md max-h-full">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tambah Stok Produk
                </h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setIsModalOpen(false)}>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <div className="p-4 md:p-5">
                <label htmlFor="product" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pilih Produk:</label>
                <select
                  id="product"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">--Produk--</option>
                  {inventories.map((item) => (
                    <option key={item.kode_produk} value={item.kode_produk}>
                      {item.nama_produk}
                    </option>
                  ))}
                </select>

                <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jumlah:</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantityToAdd}
                  onChange={(e) => setQuantityToAdd(e.target.value)}
                  min="1"
                  placeholder="Masukkan jumlah"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />

                <div className="flex justify-between mt-4">
                  <button 
                    onClick={handleAddQuantity} 
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Tambah Stok
                  </button>
                  <button 
                    type="button" 
                    className="text-white inline-flex items-center bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-400" 
                    onClick={() => setIsModalOpen(false)} // Menutup modal
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddStock;