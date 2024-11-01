import React from 'react';

function InvenTable({ inventories }) {
  return (
    <div>
      <h2>Inventori Table</h2>
      <table border="1" style={{ marginTop: '20px', width: '100%' }}>
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
