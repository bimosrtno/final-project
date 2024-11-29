import React from 'react';

// Fungsi untuk memformat mata uang
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

function InvenTable({ inventories }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-x-auto mt-4 w-full max-w-6xl">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"> {/* Latar belakang tabel */}
      <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-300 dark:text-gray-400"> {/* Warna latar belakang header dan teks */}
            <tr>
              <th scope="col" className="px-6 py-3">Kode Produk</th>
              <th scope="col" className="px-6 py-3">Nama Produk</th>
              <th scope="col" className="px-6 py-3">Modal</th>
              <th scope="col" className="px-6 py-3">Harga Jual</th>
              <th scope="col" className="px-6 py-3">Sisa Stok</th>
            </tr>
          </thead>
          <tbody>
            {inventories.map((item) => (
              <tr key={item.kode_produk} className="bg-gray-200 border-b text-gray-800 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                <td className="px-6 py-4">{item.kode_produk}</td>
                <td className="px-6 py-4">{item.nama_produk}</td>
                <td className="px-6 py-4">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Rp.</span>
                    <span>{formatCurrency(item.modal)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Rp.</span>
                    <span>{formatCurrency(item.harga_jual)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default InvenTable;