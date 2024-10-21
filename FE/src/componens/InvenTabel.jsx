import React, { useEffect, useState } from 'react';
import axios from 'axios';

function InvenTable() {
  const [inventories, setInventories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantityToAdd, setQuantityToAdd] = useState(''); // Set to empty string

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/inventoris');
        setInventories(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const handleAddQuantity = async () => {
    // Check if the selected product and quantityToAdd are valid
    if (!selectedProduct || quantityToAdd === '' || Number(quantityToAdd) <= 0) {
      alert('Pilih produk dan masukkan jumlah yang valid');
      return;
    }

    try {
      // Send request to update quantity in the backend
      await axios.patch(`http://localhost:5000/api/inventoris/${selectedProduct}`, {
        quantity: Number(quantityToAdd), // Convert quantityToAdd to a number
      });
      // Refresh the inventory data
      const response = await axios.get('http://localhost:5000/api/inventoris');
      setInventories(response.data);
      // Reset input fields
      setSelectedProduct('');
      setQuantityToAdd(''); // Reset to empty string
    } catch (error) {
      console.error('Error updating quantity', error);
      alert('Terjadi kesalahan saat memperbarui quantity produk.');
    }
  };

  return (
    <div>
      <h1>Inventori</h1>
      
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
          onChange={(e) => setQuantityToAdd(e.target.value)} // Keep as string
          min="1" // Set minimum value to 1
          placeholder="Masukkan jumlah"
        />

        <button onClick={handleAddQuantity}>Tambah Quantity</button>
      </div>

      <table border="1" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Kode Produk</th>
            <th>Nama Produk</th>
            <th>Modal</th>
            <th>Harga Jual</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {inventories.map((item) => (
            <tr key={item.kode_produk}>
              <td>{item.kode_produk}</td>
              <td>{item.nama_produk}</td>
              <td>{item.modal}</td>
              <td>{item.harga_jual}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvenTable;
