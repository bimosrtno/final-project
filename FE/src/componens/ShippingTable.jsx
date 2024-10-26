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
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Gagal mengupdate status: ${response.status} ${response.statusText}`);
      }

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
      <h2>Shipping Table</h2>
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
            {salesData
              .filter((sale) => sale.status !== 'Batal') // Memfilter data dengan status bukan "Batal"
              .map((sale) => (
                <tr key={sale.id_transaksi}>
                  <td>{sale.id_transaksi}</td>
                  <td>{sale.customer_name}</td>
                  <td>
                    {sale.nama_produk?.map((produk, index) => (
                      <div key={index}>{produk}</div>
                    ))}
                  </td>
                  <td>{sale.phone}</td>
                  <td>{sale.address}</td>
                  <td>
                    {sale.quantity?.map((qty, index) => (
                      <div key={index}>{qty}</div>
                    ))}
                  </td>
                  <td>{new Date(sale.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                  <td>
                    {sale.status === 'Batal' ? (
                      <span>{sale.status}</span>
                    ) : (
                      <select
                        value={sale.status}
                        onChange={(e) => updateStatus(sale.id_transaksi, e.target.value)}
                      >
                        <option value="proses">Proses</option>
                        <option value="terkirim">Terkirim</option>
                      </select>
                    )}
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
