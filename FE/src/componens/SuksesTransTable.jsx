import React, { useState, useEffect } from "react";
import '../CSS/tablesuperadmin.css';

const SuksesTable = () => {
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

  const successfulSalesData = salesData.filter(sale => sale.status.toLowerCase() === 'terkirim');
  
  const totalPages = Math.ceil(successfulSalesData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = successfulSalesData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openModal = (sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSale(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl ml-8">
        <h2 className="text-xl mb-4">Sales Table (Terkirim)</h2>
        <div className="mt-4">
   
          <span className="font-bold">Total Transaksi Sukses: {formatCurrency(successfulSalesData.reduce((total, sale) => total + parseFloat(sale.total_transaksi), 0))}</span>
        </div>
        
        <div className="relative overflow-x-auto">
          <table className="table-auto w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-2">ID Transaksi</th>
                <th className="px-4 py-2">Nama Customer</th>
                <th className="px-4 py-2">No. HP</th>
                <th className="px-4 py-2">Total Transaksi</th>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((sale) => (
                <tr className="bg-white border-b" key={sale.id_transaksi}>
                  <td className="px-4 py-2">{sale.id_transaksi}</td>
                  <td className="px-4 py-2">{sale.customer_name}</td>
                  <td className="px-4 py-2">
                    <a href={`https://wa.me/62${sale.phone}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{sale.phone}</a>
                  </td>
                  <td className="px-4 py-2">{formatCurrency(sale.total_transaksi)}</td>
                  <td className="px-4 py-2">{new Date(sale.date).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 py-2">
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
              <div className="relative bg-white rounded-lg shadow">
                <div className="flex items-center justify-between p-4 border-b rounded-t">
                  <h3 className="text-lg font-semibold text-gray-900">Detail Transaksi</h3>
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
                      <p><strong>Nama Pelanggan:</strong> {selectedSale.customer_name}</p>
                      <p><strong>No HP:</strong> {selectedSale.phone}</p>
                      <p><strong>Alamat:</strong> {selectedSale.address}</p>
                      <p><strong>Produk:</strong> {selectedSale.nama_produk.join(", ")}</p>
                      <p><strong>Quantity:</strong> {selectedSale.quantity.join(", ")}</p>
                      <p><strong>Total Transaksi:</strong> {formatCurrency(selectedSale.total_transaksi)}</p>
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
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage === totalPages ? 'pointer-events-none text-gray-300' : ''}`} 
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
    </div>
  );
};

export default SuksesTable;