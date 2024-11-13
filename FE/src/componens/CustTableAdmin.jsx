import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/table.css"; // Impor file CSS
import AddCustomer from "./ButtonCustAdmin";

const PAGE_SIZE = 5; // Jumlah pelanggan yang ditampilkan per halaman

const CustData = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [totalPages, setTotalPages] = useState(0); // Total halaman
  const [selectedCustomer, setSelectedCustomer] = useState(null); // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk menampilkan modal
  const [totalTransactions, setTotalTransactions] = useState(0); // State untuk total transaksi

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/customers?order=desc");
        setCustomers(response.data);
        
        // Menghitung total halaman
        const totalCustomers = Math.max(response.data.length, PAGE_SIZE); // Minimum total adalah PAGE_SIZE
        setTotalPages(Math.ceil(totalCustomers / PAGE_SIZE)); // Hitung total halaman
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleStatusChange = (Name, newStatus) => {
    axios
      .put(`http://localhost:5000/customers/${Name}/status`, {
        status: newStatus,
      })
      .then(() => {
        const updatedCustomers = customers.map((customer) =>
          customer.Name === Name ? { ...customer, Status: newStatus } : customer
        );
        setCustomers(updatedCustomers);
      })
      .catch((error) => console.error("Error updating status:", error));
  };

  const openModal = async (customer) => {
    setSelectedCustomer(customer);
    const transactions = await fetchTotalTransactions(customer.id_customer); // Mengambil total transaksi
    setTotalTransactions(transactions); // Simpan total transaksi ke state
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
    setTotalTransactions(0); // Reset total transaksi ketika modal ditutup
  };

  const fetchTotalTransactions = async (customerId) => {
    try {
      const response = await axios.get(`http://localhost:5000/customers/${customerId}/transactions`); // Endpoint baru yang kita buat
      return response.data.totalAmount; // Ambil total transaksi dari API
    } catch (error) {
      console.error("Error fetching total transactions:", error);
      return 0; // Kembalikan 0 jika ada error
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'Rp.0';

    return `Rp.${new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(amount)}`;
};
  // Hitung customers untuk ditampilkan di halaman saat ini
  const indexOfLastCustomer = currentPage * PAGE_SIZE;
  const indexOfFirstCustomer = indexOfLastCustomer - PAGE_SIZE;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex justify-center py-4">
      <div className="relative overflow-x-auto w-full">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Nama</th>
              <th scope="col" className="px-6 py-3">Nomor</th>
              <th scope="col" className="px-6 py-3">Source</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Detail</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.id_customer} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">{customer.id_customer}</td>
                <td className="px-6 py-4">{customer.Name}</td>
                <td className="px-6 py-4">
                  <a href={`https://wa.me/${customer.Phone}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {customer.Phone}
                  </a>
                </td>
                <td className="px-6 py-4">{customer.source}</td>
                <td className="px-6 py-4">
                 {customer.Status || "potensial"}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => openModal(customer)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {isModalOpen && (
  <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
    <div className="relative p-4 w-full max-w-lg max-h-full"> 
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detail Customer</h3>
          <button onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8">
            <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="p-4">
          {selectedCustomer && (
            <div>
              <p className="mb-2"><strong>ID Customer:</strong> {selectedCustomer.id_customer}</p>
              <p className="mb-2"><strong>Nama:</strong> {selectedCustomer.Name}</p>
              <p className="mb-2"><strong>Nomor:</strong> {selectedCustomer.Phone}</p>
              <p className="mb-2"><strong>Email:</strong> {selectedCustomer.Email}</p>
              <p className="mb-2"><strong>Perusahaan:</strong> {selectedCustomer.Company}</p>
              <p className="mb-2"><strong>Domisili:</strong> {selectedCustomer.City}</p>
              <p className="mb-2"><strong>Total Transaksi:</strong> {formatCurrency(totalTransactions)}</p>
              {/* Menampilkan total transaksi dengan format rupiah */}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex justify-center w-full">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustData;