import React, { useState, useEffect } from 'react';

const ShippingTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage] = useState(3); // Mengatur jumlah data per halaman

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

        // Set the filtered sales data that excludes "Batal" status
        setSalesData(sortedData.filter(sale => sale.status !== 'Batal'));
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

      // Update the salesData
      setSalesData((prevSalesData) => {
        const updatedSales = prevSalesData.map((sale) =>
          sale.id_transaksi === idTransaksi ? { ...sale, status: newStatus } : sale
        );

        // Filter out any sales that are now "Batal" or "batal"
        return updatedSales.filter(sale => sale.status !== 'batal','Batal');
      });
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

  // Pagination logic
  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSalesData = salesData.slice(indexOfFirstSale, indexOfLastSale);
  const totalPages = Math.ceil(salesData.length / salesPerPage);

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', tableLayout: 'auto' }}>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentSalesData.map((sale) => (
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
                  <button 
                    type="button" 
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    onClick={() => printReceipt(sale)}>
                    Print Resi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Component */}
        <nav aria-label="Page navigation example">
          <ul className="flex items-center -space-x-px h-8 text-sm">
            <li>
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500'} bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700`}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous</span>
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index}>
                <button
                  onClick={() => setCurrentPage(index + 1)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === index + 1 ? 'text-blue-600 bg-blue-50' : 'text-gray-500 bg-white'} border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500'} bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700`}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ShippingTable;