import React from 'react';

// Fungsi untuk memformat mata uang
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

function InvenTable({ inventories }) {
  return (
    <div>
      <h2>Tabel Stok barang</h2>
      <table border="1" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Kode Produk</th>
            <th>Nama Produk</th>
            <th>Modal</th>
            <th>Harga Jual</th>
            <th>Sisa Stok</th>
          </tr>
        </thead>
        <tbody>
          {inventories.map((item) => (
            <tr key={item.kode_produk}>
              <td>{item.kode_produk}</td>
              <td>{item.nama_produk}</td>
              <td>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Rp.</span>
                  <span>{formatCurrency(item.modal)}</span>
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Rp.</span>
                  <span>{formatCurrency(item.harga_jual)}</span>
                </div>
              </td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvenTable;