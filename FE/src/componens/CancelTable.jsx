import React, { useState, useEffect } from "react";

const CancelTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const canceledSalesData = salesData.filter(sale => sale.status.toLowerCase() === 'batal');

  const totalPages = Math.ceil(canceledSalesData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = canceledSalesData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const calculateTotalCanceled = () => {
    return canceledSalesData.reduce((total, sale) => total + parseFloat(sale.total_transaksi), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  const openModal = (sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSale(null);
  };

  return (
    <div className="ml-8">
   <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Tabel Transaksi Batal</p>
      <div className="mt-1">
        <span className="font-bold">Total Transaksi Dibatalkan: Rp. {formatCurrency(calculateTotalCanceled())}</span>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">ID Transaksi</th>
              <th scope="col" className="px-6 py-3">Nama Customer</th>
              <th scope="col" className="px-6 py-3">No. HP</th>
              <th scope="col" className="px-6 py-3">Total Transaksi</th>
              <th scope="col" className="px-6 py-3">Note</th>
              <th scope="col" className="px-6 py-3">Tanggal</th>
              <th scope="col" className="px-6 py-3">Detail</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((sale) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={sale.id_transaksi}>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{sale.id_transaksi}</td>
                <td className="px-6 py-4">{sale.customer_name}</td>
                <td className="px-6 py-4">
                  <a 
                    href={`https://wa.me/62${sale.phone}?text=Halo%20${encodeURIComponent(sale.customer_name)},%20perkenalkan%20saya%20Bimo%20dari%20Teman%20Tani.%20Perihal%20pembatalan%20transaksi%20akhir-akhir%20ini,%20boleh%20kan%20kami%20tau%20alasannya%20kenapa?%20Terima kasih,%20sehat%20selalu!`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {sale.phone}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-between">
                    <span>Rp.</span>
                    <span>{formatCurrency(sale.total_transaksi)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{sale.note}</td>
                <td className="px-6 py-4">{new Date(sale.date).toLocaleDateString('id-ID')}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => openModal(sale)} 
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    type="button"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detail Transaksi</h3>
                <button onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8">
                  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4">
                {selectedSale && (
                  <div>
                    <p><strong>Tanggal:</strong> {new Date(selectedSale.date).toLocaleDateString('id-ID')}</p>
                    <p><strong>ID Transaksi:</strong> {selectedSale.id_transaksi}</p>
                    <p><strong>Nama Customer:</strong> {selectedSale.customer_name}</p>
                    <p><strong>No HP:</strong> {selectedSale.phone}</p>
                    <p><strong>Alamat:</strong> {selectedSale.address}</p>
                    <p><strong>Produk:</strong> {selectedSale.nama_produk.join(", ")}</p>
                    <p><strong>Quantity:</strong> {selectedSale.quantity.join(", ")}</p>
                    <p><strong>Total Transaksi:</strong> Rp. {formatCurrency(selectedSale.total_transaksi)}</p>
                    <p><strong>Status:</strong> {selectedSale.status}</p>
                    <p><strong>Note:</strong> {selectedSale.note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <nav aria-label="Page navigation example" className="mt-4">
        <ul className="flex items-center -space-x-px h-8 text-sm">
          <li>
            <a 
              href="#" 
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage === 1 ? 'pointer-events-none text-gray-300' : ''}`} 
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            >
              <span className="sr-only">Previous</span>
              <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
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
              className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage === totalPages ? 'pointer-events-none text-gray-300' : ''}`} 
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            >
              <span className="sr-only">Next</span>
              <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default CancelTable;