import React, { useState } from 'react';
import axios from 'axios';

function AddStock({ inventories, setInventories }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantityToAdd, setQuantityToAdd] = useState('');

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

      // Alert success message
      alert('Stok berhasil diperbarui.');
    } catch (error) {
      console.error('Error updating quantity', error);
      alert('Terjadi kesalahan saat memperbarui quantity produk.');
    }
  };

  return (
    <div>
      <label htmlFor="product">Pilih Produk:</label>
      <select
        id="product"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        <option value="">--Pilih Produk--</option>
        {inventories.map((item) => (
          <option key={item.kode_produk} value={item.kode_produk}>
            {item.nama_produk}
          </option>
        ))}
      </select>

      <label htmlFor="quantity">Jumlah:</label>
      <input
        type="number"
        id="quantity"
        value={quantityToAdd}
        onChange={(e) => setQuantityToAdd(e.target.value)}
        min="1"
        placeholder="Masukkan jumlah"
      />

      <button onClick={handleAddQuantity}>Tambah Quantity</button>
    </div>
  );
}

export default AddStock;
