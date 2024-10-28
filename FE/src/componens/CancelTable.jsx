import React, { useState, useEffect } from "react";
import '../CSS/table.css';

const CancelTable = () => {
  const [salesData, setSalesData] = useState([]);

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

  const updateStatus = async (idTransaksi, newStatus) => {
    if (newStatus === "Terkirim") return;

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

      // Update the salesData without changing the order
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

  const createWhatsAppLink = (phone, customerName, idTransaksi) => {
    // Hapus tanda dan spasi dari nomor telepon
    const cleanedPhone = phone.replace(/[^0-9]/g, "");
    // Format URL WhatsApp
    const waUrl = `https://wa.me/62${cleanedPhone.slice(1)}?text=Halo%20${encodeURIComponent(customerName)},%20berikut%20adalah%20ID%20transaksinya%20ya%20${encodeURIComponent(idTransaksi)}.%20Silahkan%20pergi%20ke%20landing%20page%20kami%20untuk%20tracking%20pesanannya.%20Terimakasih.`;
    return waUrl;
  };

  // Filter only sales with status "Batal"
  const canceledSalesData = salesData.filter(sale => sale.status === "Batal");

  return (
    <div>
      <h2>Sales Table (Batal)</h2>
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
              {canceledSalesData.map((sale) => (
                <tr key={sale.id_transaksi}>
                  <td>{sale.id_transaksi}</td>
                  <td>{sale.customer_name}</td>
                  <td>{sale.nama_produk.join(", ")}</td>
                  <td>
                    <a 
                      href={createWhatsAppLink(sale.phone, sale.customer_name, sale.id_transaksi)} 
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

export default CancelTable;
