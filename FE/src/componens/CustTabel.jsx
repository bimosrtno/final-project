import React, { useEffect, useState } from "react";
import axios from "axios";
import AddCustomer from "./ButtonCustAdmin";

const PAGE_SIZE = 5; // Jumlah pelanggan yang ditampilkan per halaman

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [totalPages, setTotalPages] = useState(0); // Total halaman
  const [activeTemplates, setActiveTemplates] = useState([]); // State untuk menyimpan template aktif bertipe cust

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/customers?status=active&order=desc");
        setCustomers(response.data);
        
        // Menghitung total halaman
        const totalCustomers = Math.max(response.data.length, PAGE_SIZE); // Minimum total adalah PAGE_SIZE
        setTotalPages(Math.ceil(totalCustomers / PAGE_SIZE)); // Hitung total halaman
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    //template cust
    const fetchActiveTemplates = async () => {
      try {
        // Ambil template bertipe 'cust' yang aktif
        const response = await axios.get('http://localhost:5000/api/templates/cust/active');
        const templates = await response.data;
        setActiveTemplates(templates); // Simpan template aktif bertipe cust
      } catch (error) {
        console.error("Error fetching active templates:", error);
      }
    };

    fetchCustomers();
    fetchActiveTemplates(); // Ambil template aktif bertipe cust
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
    const template = activeTemplates[0]; // Ambil template pertama bertipe 'cust'

    // Gantikan placeholder dengan nilai yang sesuai; jika tidak ada template, gunakan pesan kosong
    const message = template ? 
      template.template.replace(/\${name}/g, name) :  
      '';  // Kosongkan pesan default

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
      <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"> {/* Latar belakang tabel */}
      <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-300 dark:text-gray-400"> {/* Warna latar belakang header dan teks */}
            <tr>
              <th scope="col" className="px-4 py-3">Customer ID</th> {/* Kolom ID Customer */}
              <th scope="col" className="px-4 py-3">Nama</th>
              <th scope="col" className="px-4 py-3">Nomor</th>
              <th scope="col" className="px-4 py-3">Email</th>
              <th scope="col" className="px-4 py-3">Perusahaan</th>
              <th scope="col" className="px-4 py-3">Domisili</th>
              <th scope="col" className="px-4 py-3">Source</th>
              <th scope="col" className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.Name} className="bg-gray-200 border-b text-gray-800 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                <td className="px-6 py-4">{customer.id_customer}</td> {/* Menampilkan ID Customer */}
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
    className={`block p-2 rounded focus:outline-none 
      ${customer.Status === 'active' ? 'bg-green-400 text-white font-medium rounded-lg px-4 py-2' 
      : customer.Status === 'potensial' ? 'bg-yellow-400 text-white font-medium rounded-lg px-4 py-2' 
      : 'bg-red-800 text-white font-medium rounded-lg px-4 py-2'} 
      focus:bg-gray-300`} // Tambahkan warna latar belakang saat dropdown aktif
  >
    <option value="active" className="text-gray-800">Active</option>
    <option value="potensial" className="text-gray-800">Potensial</option>
    <option value="inactive" className="text-gray-800">Inactive</option>
  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex justify-between items-center mt-2">
          <AddCustomer />
          <div className="flex justify-center w-full">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-gray-300 text-white' : 'bg-gray-400 text-white hover:bg-gray-100'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

  );
};

export default CustomerTable;