import React, { useState, useEffect } from "react";
import '../CSS/tablesuperadmin.css';

const SuksesTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const createWhatsAppLink = (phone, customerName, idTransaksi) => {
    const cleanedPhone = phone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/62${cleanedPhone.slice(1)}?text=Halo%20${encodeURIComponent(customerName)},%20perkenalkan%20saya%20bimo%20dari%20TemanTani%20ingin%20mengkonfirmasi%20perihal%20pembatalan%20transaksi%20baru-baru%20ini.%20Jikalau%20boleh%20tau%20apa%20yang%20menjadi%20alasan%20pembatalan?%20Ada%20masukan%20atau%20saran%20yang%20bisa%20kami%20perbaiki?%20Terima%20kasih,%20sehat%20selalu.`;
    return waUrl;
  };

  // Memfilter data untuk hanya status "Terkirim"
  const successfulSalesData = salesData.filter(sale => sale.status.toLowerCase() === 'terkirim');

  const totalPages = Math.ceil(successfulSalesData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = successfulSalesData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Menghitung total transaksi yang sukses
  const calculateTotalSuccessful = () => {
    return successfulSalesData.reduce((total, sale) => total + parseFloat(sale.total_transaksi), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="ml-8">
      <h2 className="text-xl mb-4">Sales Table (Terkirim)</h2>
      {/* Menampilkan total transaksi yang sukses */}
      <div className="mt-4">
        <span className="font-bold">Total Transaksi Sukses: {formatCurrency(calculateTotalSuccessful())}</span>
      </div>
      <div className="relative overflow-x-auto">
      <table className="table admin min-w-full max-w-[40%] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-1">ID Transaksi</th>
              <th scope="col" className="px-4 py-1">Customer Name</th>
              <th scope="col" className="px-4 py-1">Nama Produk</th>
              <th scope="col" className="px-4 py-1">No. HP</th>
              <th scope="col" className="px-4 py-1">Alamat</th>
              <th scope="col" className="px-4 py-1">Quantity</th>
              <th scope="col" className="px-4 py-1">Total Transaksi</th>
              <th scope="col" className="px-4 py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((sale) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={sale.id_transaksi}>
                <td className="px-4 py-1">{sale.id_transaksi}</td>
                <td className="px-4 py-1">{sale.customer_name}</td>
                <td className="px-4 py-1">{sale.nama_produk.join(", ")}</td>
                <td className="px-4 py-1">
                  <a 
                    href={createWhatsAppLink(sale.phone, sale.customer_name, sale.id_transaksi)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {sale.phone}
                  </a>
                </td>
                <td className="px-4 py-1">{sale.address}</td>
                <td className="px-4 py-1">{sale.quantity.join(", ")}</td>
                <td className="px-4 py-1">{sale.total_transaksi}</td>
                <td className="px-4 py-1">{new Date(sale.date).toLocaleDateString('id-ID')}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav aria-label="Page navigation example" className="mt-4">
        <ul className="flex items-center -space-x-px h-8 text-sm">
          <li>
            <a 
              href="#" 
              className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage === 1 ? 'pointer-events-none text-gray-300' : ''}`} 
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            >
              <span className="sr-only">Previous</span>
              <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
              </svg>
            </a>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index}>
              <a 
                href="#" 
                className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === index + 1 ? 'z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'}`} 
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </a>
            </li>
          ))}
          <li>
            <a 
              href="#" 
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage === totalPages ? 'pointer-events-none text-gray-300' : ''}`} 
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            >
              <span className="sr-only">Next</span>
              <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SuksesTable;