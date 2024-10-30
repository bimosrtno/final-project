import React, { useState, useEffect } from "react";
import '../CSS/table.css';

const SalesTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sales");
        if (!response.ok) {
          throw new Error(`Gagal mengambil data sales: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const sortedData = data.sort((a, b) => {
          const aId = parseInt(a.id_transaksi.replace('TRS', ''));
          const bId = parseInt(b.id_transaksi.replace('TRS', ''));
          return bId - aId; // Sort descending
        });
        setSalesData(sortedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        alert(error.message);
      }
    };

    fetchSalesData();

    const intervalId = setInterval(fetchSalesData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const updateStatusToCancel = async (idTransaksi) => {
    if (!note) {
      alert("Catatan harus diisi!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/sales/cancel/${idTransaksi}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) {
        throw new Error(`Gagal membatalkan transaksi: ${response.status} ${response.statusText}`);
      }

      const updatedSale = await response.json();
      setSalesData((prevSalesData) =>
        prevSalesData.map((sale) =>
          sale.id_transaksi === updatedSale.id_transaksi ? { ...sale, status: 'batal', note: updatedSale.note } : sale
        )
      );

      setNote(''); // Clear note input
      setMessage('Transaksi berhasil dibatalkan');
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Sales Table</h2>
      {message && <p>{message}</p>}
      <div style={{ overflowX: "auto" }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Customer Name</th>
                <th>Nama Produk</th>
                <th>No. HP</th>
                <th>Alamat</th>
                <th>Quantity</th>
                <th>Total Transaksi</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale) => (
                <tr key={sale.id_transaksi}>
                  <td>{sale.id_transaksi}</td>
                  <td>{sale.customer_name}</td>
                  <td>{sale.nama_produk.join(", ")}</td>
                  <td>
                    <a
                      href={`https://wa.me/62${sale.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sale.phone}
                    </a>
                  </td>
                  <td>{sale.address}</td>
                  <td>{sale.quantity.join(", ")}</td>
                  <td>{sale.total_transaksi}</td>
                  <td>{new Date(sale.date).toLocaleDateString('id-ID')}</td>
                  <td>{sale.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default SalesTable;