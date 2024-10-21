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
      {!showForm && ( // Jika form belum ditampilkan, tampilkan tombol "Tambah Produk"
        <button onClick={() => setShowForm(true)}>Tambah Produk</button>
      )}

      {showForm && ( // Jika showForm true, tampilkan form
        <div>
          <h2>Tambah Produk</h2>

          <label htmlFor="kodeProduk">Kode Produk:</label>
          <input
            type="text"
            id="kodeProduk"
            value={kodeProduk}
            onChange={(e) => setKodeProduk(e.target.value)}
            placeholder="Masukkan kode produk"
          />

          <label htmlFor="namaProduk">Nama Produk:</label>
          <input
            type="text"
            id="namaProduk"
            value={namaProduk}
            onChange={(e) => setNamaProduk(e.target.value)}
            placeholder="Masukkan nama produk"
          />

          <label htmlFor="modal">Modal:</label>
          <input
            type="number"
            id="modal"
            value={modal}
            onChange={(e) => setModal(e.target.value)}
            min="1"
            placeholder="Masukkan modal produk"
          />

          <label htmlFor="hargaJual">Harga Jual:</label>
          <input
            type="number"
            id="hargaJual"
            value={hargaJual}
            onChange={(e) => setHargaJual(e.target.value)}
            min="1"
            placeholder="Masukkan harga jual produk"
          />

          <button onClick={handleAddProduct}>Submit</button>
          <button onClick={() => setShowForm(false)}>Batal</button> {/* Tombol untuk membatalkan form */}
        </div>
      )}
    </div>
  );
}

export default AddProduct;
