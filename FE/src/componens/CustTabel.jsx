import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/table.css"; // Impor file CSS
import AddCustomer from "./ButtonCustAdmin";

const PAGE_SIZE = 5; // Jumlah pelanggan yang ditampilkan per halaman

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [totalPages, setTotalPages] = useState(0); // Total halaman

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

  const formatPhoneNumber = (phone) => {
    let formattedPhone = phone.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "62" + formattedPhone.slice(1);
    }
    return formattedPhone;
  };

  const createWhatsAppLink = (phone, name) => {
    const formattedPhone = formatPhoneNumber(phone);
    const message = `Halo ${name}, maaf ya lagi tes templet ehehehhehe`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
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
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Phone</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Company</th>
              <th scope="col" className="px-6 py-3">City</th>
              <th scope="col" className="px-6 py-3">Source</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.Name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{customer.Name}</td>
                <td className="px-6 py-4">
                  <a
                    href={createWhatsAppLink(customer.Phone, customer.Name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {customer.Phone}
                  </a>
                </td>
                <td className="px-6 py-4">{customer.Email}</td>
                <td className="px-6 py-4">{customer.Company}</td>
                <td className="px-6 py-4">{customer.City}</td>
                <td className="px-6 py-4">{customer.source}</td>
                <td className="px-6 py-4">
                  <select
                    value={customer.Status || "potensial"}
                    onChange={(e) => handleStatusChange(customer.Name, e.target.value)}
                    className="block p-2 rounded border-gray-300"
                  >
                    <option value="active">Active</option>
                    <option value="potensial">Potensial</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex justify-between items-center mt-4">
          <AddCustomer />
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

export default CustomerTable;