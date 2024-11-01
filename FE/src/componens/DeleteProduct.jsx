import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeleteProduct({ setInventories }) {
  const [kodeProduk, setKodeProduk] = useState(''); // State untuk kode produk yang dipilih
  const [productList, setProductList] = useState([]); // State untuk menyimpan semua produk
  const [showModal, setShowModal] = useState(false); // State untuk mengontrol visibilitas modal

  // Fungsi untuk fetch data inventori
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/inventoris');
      setProductList(response.data); // Menyimpan semua produk di state
    } catch (error) {
      console.error('Error fetching product list:', error);
    }
  };

  // Fetch data inventori saat komponen dimount dan setiap 5 detik
  useEffect(() => {
    fetchProducts(); // Initial fetch saat mount

    const intervalId = setInterval(() => {
      fetchProducts(); // Refresh data setiap 5 detik
    }, 5000);

    return () => clearInterval(intervalId); // Bersihkan interval saat komponen unmount
  }, []);

  const handleDeleteProduct = async () => {
    if (!kodeProduk) {
      alert('Pilih kode produk yang ingin dihapus');
      return;
    }

    try {
      // Mengirim request delete ke backend untuk menghapus produk
      await axios.delete(`http://localhost:5000/api/inventoris/${kodeProduk}`);

      // Fetch ulang data inventori setelah penghapusan
      await fetchProducts();

      // Update parent state dengan data terbaru setelah penghapusan
      setInventories((prevInventories) => prevInventories.filter(product => product.kode_produk !== kodeProduk));

      // Reset pilihan
      setKodeProduk('');
      alert('Produk berhasil dihapus');
      setShowModal(false); // Menutup modal setelah penghapusan
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Terjadi kesalahan saat menghapus produk');
    }
  };

  return (
    <div>
      {/* Tombol untuk membuka modal */}
      <button 
        data-modal-target="crud-modal" 
        data-modal-toggle="crud-modal" 
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        type="button" 
        onClick={() => setShowModal(true)}
      >
        Hapus Produk
      </button>

      {/* Modal */}
      {showModal && (
        <div id="crud-modal" className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            {/* Konten Modal */}
            <div className="relative bg-white rounded-lg shadow">
              {/* Header Modal */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Hapus Produk</h3>
                <button 
                  type="button" 
                  className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center" 
                  onClick={() => setShowModal(false)}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Body Modal */}
              <div className="p-4">
                <label htmlFor="kodeProduk" className="block mb-2 text-sm font-medium text-gray-900">Pilih Kode Produk:</label>
                <select
                  id="kodeProduk"
                  value={kodeProduk}
                  onChange={(e) => setKodeProduk(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 mb-4"
                >
                  <option value="">-- Pilih Kode Produk --</option>
                  {productList.map((product) => (
                    <option key={product.kode_produk} value={product.kode_produk}>
                      {product.kode_produk}
                    </option>
                  ))}
                </select>

                <button 
                  onClick={handleDeleteProduct}
                  className="text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Hapus Produk
                </button>
                <button 
                  type="button" 
                  className="text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm px-5 py-2.5 ml-2" 
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteProduct;