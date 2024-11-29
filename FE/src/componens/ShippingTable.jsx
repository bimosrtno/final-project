import React, { useState, useEffect } from "react";

const ShippingTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [shippingService, setShippingService] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sales");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch sales data: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        const updatedData = data.map((sale) => ({
          ...sale,
          status: sale.status || "proses",
        }));

        const sortedData = updatedData.sort((a, b) => {
          const aId = parseInt(a.id_transaksi.replace("TRS", ""));
          const bId = parseInt(b.id_transaksi.replace("TRS", ""));
          return bId - aId;
        });

        setSalesData(sortedData.filter((sale) => sale.status !== "Batal"));
      } catch (error) {
        console.error("Error fetching sales data:", error);
        alert(error.message);
      }
    };

    fetchSalesData();
  }, []);

  const updateStatus = async (idTransaksi, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/sales/${idTransaksi}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update status: ${response.status} ${response.statusText}`
        );
      }

      setSalesData((prevSalesData) =>
        prevSalesData
          .map((sale) =>
            sale.id_transaksi === idTransaksi
              ? { ...sale, status: newStatus }
              : sale
          )
          .filter((sale) => sale.status !== "Batal")
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message);
    }
  };

  const handleModalOpen = (sale) => {
    if (sale) {
      setSelectedSale(sale);
      setIsModalOpen(true);
    } else {
      console.error("Sale data is missing!");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setShippingService("");
    setTrackingNumber("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!shippingService || !trackingNumber) {
      alert("Jasa pengiriman dan nomor resi harus diisi!");
      return;
    }
  
    if (!selectedSale || !selectedSale.id_transaksi) {
      alert("Data transaksi tidak valid!");
      return;
    }
  
    try {
      // Mengirim request PUT ke backend dengan data yang dibutuhkan
      const response = await fetch(
        `http://localhost:5000/api/sales/sales/${selectedSale.id_transaksi}`, // Menggunakan route yang benar
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "terkirim", // Update status menjadi terkirim
            pengiriman: shippingService, // Jasa pengiriman
            no_resi: trackingNumber, // Nomor resi
          }),
        }
      );
  
      // Memeriksa apakah response dari server sukses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Gagal menyimpan data: ${errorData.error || "Unknown error"}`
        );
      }
  
      // Memperbarui status pada tampilan setelah berhasil
      updateStatus(selectedSale.id_transaksi, "terkirim");
  
      // Menutup modal setelah berhasil
      handleModalClose();
    } catch (error) {
      console.error("Error submitting shipping data:", error);
      alert("Gagal menyimpan data pengiriman. Periksa koneksi dan coba lagi.");
    }
  };

  const printReceipt = (sale) => {
    // Menyiapkan baris untuk produk
    const productsTableRows = sale.nama_produk
      .map((product, index) => 
        `<tr>
          <td style="border: 1px solid black; padding: 5px;">${product}</td>
          <td style="border: 1px solid black; padding: 5px;">${sale.quantity[index]}</td>
        </tr>`
      )
      .join('');
  
    // Menyusun konten resi
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
  
    // Membuka jendela baru untuk print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Resi Pengiriman</title>
          <style>
            @media print {
              body { font-size: 12px; }
              .receipt { width: 100%; max-width: 210mm; margin: auto; padding: 10px; border: 1px solid black; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 5px; text-align: left; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">${receiptContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  
  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSalesData = salesData.slice(indexOfFirstSale, indexOfLastSale);
  const totalPages = Math.ceil(salesData.length / salesPerPage);

  return (
    <div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-300 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Tanggal
              </th>
              <th scope="col" className="px-6 py-3">
                ID Transaksi
              </th>
              <th scope="col" className="px-6 py-3">
                Nama Customer
              </th>
              <th scope="col" className="px-6 py-3">
                Nama Produk
              </th>
              <th scope="col" className="px-6 py-3">
                Jumlah
              </th>
              <th scope="col" className="px-6 py-3">
                Alamat
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {currentSalesData.map((sale) => (
              <tr key={sale.id_transaksi} className="bg-gray-200 border-b">
                <td className="px-6 py-4">
                  {new Date(sale.date).toLocaleDateString("id-ID")}
                </td>
                <td className="px-6 py-4">{sale.id_transaksi}</td>
                <td className="px-6 py-4">{sale.customer_name}</td>
                <td className="px-6 py-4">{sale.nama_produk.join(", ")}</td>
                <td className="px-6 py-4">{sale.quantity.join(", ")}</td>
                <td className="px-6 py-4">{sale.address}</td>
                <td className="px-6 py-4">
                  {sale.status === "terkirim" ? (
                    <button className="bg-green-500 text-white font-medium rounded-lg px-4 py-2" disabled>
                      {sale.status}
                    </button>
                  ) : (
                    <select
                      value={sale.status}
                      onChange={(e) => {
                        if (e.target.value === "terkirim") {
                          handleModalOpen(sale);
                        } else {
                          updateStatus(sale.id_transaksi, e.target.value);
                        }
                      }}
                      className="block w-full p-1 border border-gray-300 rounded bg-yellow-500 text-white font-medium"
                    >
                      <option value="proses">Proses</option>
                      <option value="terkirim">Terkirim</option>
                    </select>
                  )}
                </td>
                <td className="px-6 py-4">
                <button 
                    type="button" 
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    onClick={() => printReceipt(sale)}>
                    Print Resi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Component */}
        <div className="flex mt-3">
          <button
            className="px-4 h-10 mr-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg"
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <button
            className="px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg"
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold mb-4">Pilih Jasa Pengiriman</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Jasa Pengiriman</label>
                <select
                  value={shippingService}
                  onChange={(e) => setShippingService(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="" disabled>
                    Pilih jasa pengiriman
                  </option>
                  <option value="jne">JNE</option>
                  <option value="sicepat">SiCepat</option>
                  <option value="pos">POS Indonesia</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Nomor Resi</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded"
                  placeholder="Masukkan nomor resi"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={handleModalClose}
                >
                  Batal
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingTable;
