import React, { useState, useEffect } from "react";

const SalesTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [initialOrder, setInitialOrder] = useState([]); // Menyimpan urutan awal id_transaksi

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sales");
        if (!response.ok) {
          throw new Error(`Gagal mengambil data sales: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const reversedData = data.reverse(); // Membalik urutan data agar yang terbaru berada di atas

        // Set urutan awal hanya sekali saat pertama kali data di-fetch
        if (initialOrder.length === 0) {
          setInitialOrder(reversedData.map((sale) => sale.id_transaksi));
        }

        // Update data dengan urutan awal tetap sama
        setSalesData((prevSalesData) => {
          return initialOrder.map((id) =>
            reversedData.find((sale) => sale.id_transaksi === id) ||
            prevSalesData.find((sale) => sale.id_transaksi === id)
          );
        });
      } catch (error) {
        console.error("Error fetching sales data:", error);
        alert(error.message);
      }
    };

    fetchSalesData();

    // Set polling untuk refresh data tanpa mengubah urutan setiap 5 detik
    const intervalId = setInterval(fetchSalesData, 5000);

    return () => clearInterval(intervalId); // Membersihkan polling saat komponen di-unmount
  }, [initialOrder]); // Menjalankan useEffect jika initialOrder berubah

  const createWhatsAppLink = (phone, customerName, idTransaksi) => {
    const cleanedPhone = phone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/62${cleanedPhone.slice(1)}?text=Halo%20${encodeURIComponent(customerName)},%20berikut%20adalah%20ID%20transaksinya%20ya%20${encodeURIComponent(idTransaksi)}.%20Silahkan%20pergi%20ke%20landing%20page%20kami%20untuk%20tracking%20pesanannya.%20Terimakasih.`;
    return waUrl;
  };

  const formatArray = (array) => {
    return Array.isArray(array) ? array.join(", ") : array;
  };

  const updateStatus = async (idTransaksi, newStatus) => {
    if (newStatus === "Terkirim") return; // Tidak mengizinkan perubahan ke status 'Terkirim'
    
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
      <h2>Sales Table</h2>
      <div style={{ overflowX: "auto" }}>
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
                <td>{formatArray(sale.nama_produk)}</td>
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
                <td>{formatArray(sale.quantity)}</td>
                <td>{sale.total_transaksi}</td>
                <td>{new Date(sale.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                <td>
                  <select
                    value={sale.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      updateStatus(sale.id_transaksi, newStatus);
                    }}
                    disabled={sale.status === "Terkirim"} // Nonaktifkan dropdown jika statusnya 'Terkirim'
                  >
                    <option value="Proses">Proses</option>
                    <option value="Batal">Batal</option>
                
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

export default SalesTable;
