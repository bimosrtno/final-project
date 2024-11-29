import React, { useEffect, useState } from "react";
import TransButton from "./TransButton";
import CancelTransaction from "./CancelTrans";

const SalesTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [activeTemplates, setActiveTemplates] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
          return bId - aId;
        });
        setSalesData(sortedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        alert(error.message);
      }
    };

    const fetchActiveTemplates = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/templates/sls/active');
        const templates = await response.json();
        setActiveTemplates(templates);
      } catch (error) {
        console.error("Error fetching active templates:", error);
      }
    };

    fetchSalesData();
    fetchActiveTemplates();
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
          sale.id_transaksi === updatedSale.id_transaksi ? { ...sale, status: "Batal", note: updatedSale.note } : sale
        )
      );

      setNote('');
      setMessage('Transaksi berhasil dibatalkan');
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message);
    }
  };

  const formatPhoneNumber = (phone) => {
    let formattedPhone = phone.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "62" + formattedPhone.slice(1);
    }
    return formattedPhone;
  };

  const createWhatsAppLink = (phone, customerName, transactionId) => {
    const formattedPhone = formatPhoneNumber(phone);
    const template = activeTemplates[0];

    const message = template ? 
      template.template.replace(/\${name}/g, customerName).replace(/\${transactionId}/g, transactionId) :
      '';

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  };

  const handleDetailClick = (sale) => {
    setSelectedSale(sale);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSale(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const filteredSalesData = salesData.filter((sale) =>
    sale.id_transaksi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredSalesData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSalesData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "proses":
        return "bg-yellow-600"; 
      case "terkirim":
        return "bg-green-500"; 
      case "Batal":
        return "bg-red-700"; 
      default:
        return ""; 
    }
  };

  // Menambahkan fungsi formatRupiah
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      {message && <p className="text-green-600">{message}</p>}

      {/* Tombol di sebelah kiri dan search bar di sebelah kanan */}
      <div className="flex items-center mb-2">
        <div className="flex space-x-2 mr-3">
          <TransButton className="h-5" /> {/* Menyusun tinggi tombol */}
          <CancelTransaction className="h-5" /> {/* Menyusun tinggi tombol */}
        </div>
        <input
          type="text"
          placeholder="Cari ID Transaksi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded w-3/4 h-10 mb-1" // Menetapkan tinggi search bar
        />
      </div>

      <div className="table-wrapper relative overflow-x-auto flex justify-center w-full">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"> {/* Latar belakang tabel */}
      <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-300 dark:text-gray-400"> {/* Warna latar belakang header dan teks */}
            <tr>
              <th scope="col" className="px-2 py-1">Tanggal</th>
              <th scope="col" className="px-2 py-1 w-60">ID Transaksi</th>
              <th scope="col" className="px-2 py-1 w-60">Nama Customer</th>
              <th scope="col" className="px-2 py-1">Nomor</th>
              <th scope="col" className="px-2 py-1">Status</th>
              <th scope="col" className="px-2 py-1">Detail</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((sale) => (
              <tr key={sale.id_transaksi} className="bg-gray-200 border-b text-gray-800 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                <td className="px-2 py-3">{new Date(sale.date).toLocaleDateString('id-ID')}</td>
                <td className="px-2 py-3">{sale.id_transaksi}</td>
                <td className="px-2 py-3 w-80">{sale.customer_name}</td>
                <td className="px-2 py-3">
                  <a
                    href={createWhatsAppLink(sale.phone, sale.customer_name, sale.id_transaksi)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {sale.phone}
                  </a>
                </td>
                <td className="px-2 py-3">
                  <button
                    disabled
                    className={`text-white focus:ring-4 font-medium rounded-lg text-m px-5 py-2.5 me-2 mb-2 ${getStatusClassName(sale.status)}`}
                  >
                    {sale.status}
                  </button>
                </td>
                <td className="px-2 py-3">
                  <button
                    onClick={() => handleDetailClick(sale)}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center px-4 py-2">
        <nav aria-label="Page navigation example">
          <ul className="inline-flex -space-x-px text-sm">
            <li>
              <a 
                onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)} 
                className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </a>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index}>
                <a 
                  onClick={() => handlePageChange(index + 1)} 
                  className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === index + 1 ? 'text-blue-600 border border-gray-300 bg-blue-50' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                >
                  {index + 1}
                </a>
              </li>
            ))}
            <li>
              <a 
                onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)} 
                className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal untuk detail transaksi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white rounded p-4 shadow-md max-w-md w-full">
            <h2 className="text-lg font-semibold mb-2">Detail Transaksi</h2>
            {selectedSale && (
              <div>
                <p><strong>ID Transaksi:</strong> {selectedSale.id_transaksi}</p>
                <p><strong>Nama Customer:</strong> {selectedSale.customer_name}</p>
                <p><strong>Nomor Telepon:</strong> {selectedSale.phone}</p>
                <p><strong>Alamat:</strong> {selectedSale.address}</p>
                <p><strong>Produk:</strong> {selectedSale.nama_produk.join(", ")}</p>
                <p><strong>Jumlah:</strong> {selectedSale.quantity.join(", ")}</p>
                <p><strong>Total:</strong> {formatRupiah(selectedSale.total_transaksi)}</p>
                <p><strong>Status:</strong> {selectedSale.status}</p>
              </div>
            )}
            <button onClick={handleCloseModal} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTable;