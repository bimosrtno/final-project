import React, { useState, useEffect } from 'react';

const ShippingTable = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sales');
        if (!response.ok) {
          throw new Error(`Gagal mengambil data sales: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // Reverse data pada saat pertama kali diambil
        setSalesData(data.reverse()); 
      } catch (error) {
        console.error('Error fetching sales data:', error);
        alert(error.message);
      }
    };

    fetchSalesData();
  }, []);

  const updateStatus = async (idTransaksi, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sales/${idTransaksi}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }), // Kirim status baru ke backend
      });

      if (!response.ok) {
        throw new Error(`Gagal mengupdate status: ${response.status} ${response.statusText}`);
      }

      // Jika berhasil, update status tanpa mengubah urutan data
      setSalesData((prevSalesData) =>
        prevSalesData.map((sale) =>
          sale.id_transaksi === idTransaksi ? { ...sale, status: newStatus } : sale
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>shipping table</h2>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Customer Name</th>
              <th>Nama Produk</th>
              <th>No. HP</th>
              <th>Alamat</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale.id_transaksi}>
                <td>{sale.id_transaksi}</td>
                <td>{sale.customer_name}</td>
                <td>{sale.nama_produk}</td>
                <td>{sale.phone}</td>
                <td>{sale.address}</td>
                <td>{sale.quantity}</td>
                <td>{new Date(sale.date).toLocaleString()}</td>
                <td>
                  <select
                    value={sale.status}
                    onChange={(e) => updateStatus(sale.id_transaksi, e.target.value)}
                  >
                    <option value="proses">Proses</option>
                    <option value="terkirim">Terkirim</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShippingTable;
