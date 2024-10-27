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
        const updatedData = data.map((sale) => ({
          ...sale,
          status: sale.status || 'Proses',
        }));

        const sortedData = updatedData.sort((a, b) => {
          const aId = parseInt(a.id_transaksi.replace('TRS', ''));
          const bId = parseInt(b.id_transaksi.replace('TRS', ''));
          return bId - aId; // Sort descending
        });

        setSalesData(sortedData);
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

  const printReceipt = (sale) => {
    const productsTableRows = sale.nama_produk.map((product, index) => `
      <tr>
        <td>${product}</td>
        <td>${sale.quantity[index]}</td>
      </tr>
    `).join('');

    const receiptContent = `
      <h2>Resi Pengiriman</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid black; padding: 5px;">Nama Produk</th>
            <th style="border: 1px solid black; padding: 5px;">Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${productsTableRows}
        </tbody>
      </table>
      <br />
      <p>Nama: ${sale.customer_name}</p>
      <p>Alamat: ${sale.address}</p>
      <p>No. HP: ${sale.phone}</p>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Resi Pengiriman</title>
          <style>
            @media print {
              body {
                font-size: 12px;
              }
              .receipt {
                width: 100%;
                max-width: 210mm; /* A4 */
                margin: auto;
                padding: 10px;
                border: 1px solid black;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid black;
                padding: 5px;
                text-align: left;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            ${receiptContent}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
              <th>Action</th> {/* Column for action buttons */}
            </tr>
          </thead>
          <tbody>
            {salesData
              .filter((sale) => sale.status !== 'Batal')
              .map((sale) => (
                <tr key={sale.id_transaksi}>
                  <td>{sale.id_transaksi}</td>
                  <td>{sale.customer_name}</td>
                  <td>{sale.nama_produk.join(", ")}</td>
                  <td>{sale.phone}</td>
                  <td>{sale.address}</td>
                  <td>{sale.quantity.join(", ")}</td>
                  <td>{new Date(sale.date).toLocaleDateString('id-ID')}</td>
                  <td>
                    {sale.status === 'terkirim' ? (
                      <span>{sale.status}</span>
                    ) : (
                      <select
                        value={sale.status}
                        onChange={(e) => updateStatus(sale.id_transaksi, e.target.value)}
                      >
                        <option value="Proses">Proses</option>
                        <option value="terkirim">Terkirim</option>
                      </select>
                    )}
                  </td>
                  <td>
                    <button onClick={() => printReceipt(sale)}>Print Resi</button>
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
