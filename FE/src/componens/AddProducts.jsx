import React, { useState } from 'react';
import axios from 'axios';

function AddProduct({ setInventories }) {
  const [showForm, setShowForm] = useState(false); // State untuk mengontrol visibilitas form
  const [kodeProduk, setKodeProduk] = useState('');
  const [namaProduk, setNamaProduk] = useState('');
  const [modal, setModal] = useState('');
  const [hargaJual, setHargaJual] = useState('');

  const handleAddProduct = async () => {
    // Validasi input
    if (!kodeProduk || !namaProduk || modal === '' || hargaJual === '') {
      alert('Isi semua field dengan benar');
      return;
    }

    try {
      // Mengirim data produk baru ke backend
      await axios.post('http://localhost:5000/api/inventoris', {
        kode_produk: kodeProduk,
        nama_produk: namaProduk,
        modal: Number(modal),
        harga_jual: Number(hargaJual),
        quantity: 0, // Inisialisasi dengan quantity 0 untuk produk baru
      });

      // Fetch data inventori yang diperbarui
      const response = await axios.get('http://localhost:5000/api/inventoris');
      setInventories(response.data);

      // Reset input
      setKodeProduk('');
      setNamaProduk('');
      setModal('');
      setHargaJual('');

      // Sembunyikan form setelah submit berhasil
      setShowForm(false);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Terjadi kesalahan saat menambahkan produk.');
    }
  };

  return (
    <div>
      {/* Tombol untuk toggle modal */}
      <button 
        data-modal-target="crud-modal" 
        data-modal-toggle="crud-modal" 
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        type="button" 
        onClick={() => setShowForm(true)}
      >
        Tambah Produk
      </button>

      {/* Modal */}
      {showForm && (
        <div id="crud-modal" className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            {/* Konten Modal */}
            <div className="relative bg-white rounded-lg shadow">
              {/* Header Modal */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Tambah Produk</h3>
                <button 
                  type="button" 
                  className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center" 
                  onClick={() => setShowForm(false)}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Body Modal */}
              <form className="p-4">
                <label htmlFor="kodeProduk" className="block mb-2 text-sm font-medium text-gray-900">Kode Produk:</label>
                <input
                  type="text"
                  id="kodeProduk"
                  value={kodeProduk}
                  onChange={(e) => setKodeProduk(e.target.value)}
                  placeholder="Masukkan kode produk"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />

                <label htmlFor="namaProduk" className="block mb-2 text-sm font-medium text-gray-900">Nama Produk:</label>
                <input
                  type="text"
                  id="namaProduk"
                  value={namaProduk}
                  onChange={(e) => setNamaProduk(e.target.value)}
                  placeholder="Masukkan nama produk"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />

                <label htmlFor="modal" className="block mb-2 text-sm font-medium text-gray-900">Modal:</label>
                <input
                  type="number"
                  id="modal"
                  value={modal}
                  onChange={(e) => setModal(e.target.value)}
                  min="1"
                  placeholder="Masukkan modal produk"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />

                <label htmlFor="hargaJual" className="block mb-2 text-sm font-medium text-gray-900">Harga Jual:</label>
                <input
                  type="number"
                  id="hargaJual"
                  value={hargaJual}
                  onChange={(e) => setHargaJual(e.target.value)}
                  min="1"
                  placeholder="Masukkan harga jual produk"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />

                <div className="flex justify-between mt-4">
                  <button 
                    type="button" 
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5" 
                    onClick={handleAddProduct}
                  >
                    Tambah Produk
                  </button>
                  <button 
                    type="button" 
                    className="text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm px-5 py-2.5" 
                    onClick={() => setShowForm(false)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProduct;