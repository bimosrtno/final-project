import React, { useState, useEffect } from "react";
import '../CSS/table.css';
import TransButton from "./TransButton";
import CancelTransaction from "./CancelTrans";

const SalesTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  const createWhatsAppLink = (phone, name, transactionId) => {
    const formattedPhone = formatPhoneNumber(phone);
    const message = `Halo ${name}, ini ID transaksinya ya: ${transactionId}. Silahkan search di landing page kami untuk mengecek status transaksi.`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = salesData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(salesData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {message && <p className="text-green-600">{message}</p>}
      <div className="table-wrapper relative overflow-x-auto flex justify-center w-full">
        <table className="table-auto w-full mx-auto text-left text-sm text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-2 py-1 w-60">ID Transaksi</th>
              <th scope="col" className="px-2 py-1 w-60">Customer Name</th>
              <th scope="col" className="px-2 py-1 w-60">Nama Produk</th>
              <th scope="col" className="px-2 py-1">No. HP</th>
              <th scope="col" className="px-2 py-1 w-60">Alamat</th>
              <th scope="col" className="px-2 py-1">Quantity</th>
              <th scope="col" className="px-2 py-1">Total</th>
              <th scope="col" className="px-2 py-1">Date</th>
              <th scope="col" className="px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((sale) => (
              <tr key={sale.id_transaksi} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-2 py-3">{sale.id_transaksi}</td>
                <td className="px-2 py-3 w-80">{sale.customer_name}</td>
                <td className="px-2 py-3 w-80">{sale.nama_produk.join(", ")}</td>
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
                <td className="px-2 py-3 w-80">{sale.address}</td>
                <td className="px-2 py-3">{sale.quantity.join(", ")}</td>
                <td className="px-2 py-3">{sale.total_transaksi}</td>
                <td className="px-2 py-3">{new Date(sale.date).toLocaleDateString('id-ID')}</td>
                <td className="px-2 py-3">{sale.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex space-x-2">
          <TransButton />
          <CancelTransaction />
        </div>

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
    </div>
  );
};

export default SalesTable;