import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/table.css"; // Impor file CSS

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/customers");
        const reversedData = response.data.reverse(); // Membalik urutan data agar yang terbaru di atas
        setCustomers(reversedData);
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
      .then((response) => {
        // Update status dan geser data yang diubah ke atas
        const updatedCustomers = customers.map((customer) =>
          customer.Name === Name ? { ...customer, Status: newStatus } : customer
        );
        // Geser customer yang statusnya baru diubah ke posisi paling atas
        const movedCustomer = updatedCustomers.find((c) => c.Name === Name);
        const remainingCustomers = updatedCustomers.filter(
          (c) => c.Name !== Name
        );
        setCustomers([movedCustomer, ...remainingCustomers]); // Letakkan yang diubah di atas
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

  return (
    <table>
         <div style={{ overflowX: "auto" }}></div>
      <div className="table-wrapper"></div>
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Company</th>
          <th>City</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.Name}>
            <td>{customer.Name}</td>
            <td>
              <a
                href={createWhatsAppLink(customer.Phone, customer.Name)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {customer.Phone}
              </a>
            </td>
            <td>{customer.Email}</td>
            <td>{customer.Company}</td>
            <td>{customer.City}</td>
            <td>
              <select
                value={customer.Status || "active"}
                onChange={(e) =>
                  handleStatusChange(customer.Name, e.target.value)
                }
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
  );
};

export default CustomerTable;
