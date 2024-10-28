// DeleteProduct.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeleteProduct({ setInventories }) {
  const [kodeProduk, setKodeProduk] = useState(''); // State untuk kode produk yang dipilih
  const [productList, setProductList] = useState([]); // State untuk menyimpan semua produk

  // Fungsi untuk fetch data inventori
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/inventoris');
      setProductList(response.data); // Menyimpan semua produk di state
    } catch (error) {
      console.error('Error fetching product list:', error);
    }
  };

  // Fetch data inventori ketika komponen dimount dan secara berkala setiap 5 detik
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
      await fetchProducts(); // Panggil ulang fetchProducts untuk update produk terbaru

      // Update parent state dengan data terbaru setelah penghapusan
      setInventories((prevInventories) => prevInventories.filter(product => product.kode_produk !== kodeProduk));

      // Reset pilihan
      setKodeProduk('');
      alert('Produk berhasil dihapus');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Terjadi kesalahan saat menghapus produk');
    }
  };

  return (
    <div>
      <label htmlFor="kodeProduk">Kode Produk:</label>
      <select
        id="kodeProduk"
        value={kodeProduk}
        onChange={(e) => setKodeProduk(e.target.value)}
      >
        <option value=""></option>
        {productList.map((product) => (
          <option key={product.kode_produk} value={product.kode_produk}>
            {product.kode_produk}
          </option>
        ))}
      </select>

      <button onClick={handleDeleteProduct}>Hapus Produk</button>
    </div>
  );
}

export default DeleteProduct;
