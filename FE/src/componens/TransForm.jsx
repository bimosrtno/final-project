import React, { useState, useEffect } from "react";
import '../CSS/Modal.css'; // Import CSS untuk styling

const SalesForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    address: "",
    id_customer: "", 
    items: [
      {
        nama_produk: "",
        quantity: 1,
        harga_jual: 0,
        total_harga: 0,
      },
    ],
    total_transaksi: 0,
  });

  const [namaProduks, setNamaProduks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [simulatedId, setSimulatedId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, customersResponse] = await Promise.all([
          fetch("http://localhost:5000/api/inventoris"),
          fetch("http://localhost:5000/customers"),
        ]);

        const productsData = await productsResponse.json();
        const customersData = await customersResponse.json();

        setNamaProduks(productsData);
        setCustomers(customersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchLastTransactionId = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sales/last-transaction-id");
        const data = await response.json();
        const lastId = data.lastTransactionId || "TRS002";
        const newId = `TRS${(parseInt(lastId.replace("TRS", "")) + 1).toString().padStart(3, "0")}`;
        setSimulatedId(newId);
      } catch (error) {
        console.error("Error fetching last transaction ID:", error);
      }
    };

    fetchLastTransactionId();
  }, []);

  const handleCustomerChange = (e) => {
    const selectedCustomer = customers.find(customer => customer.Name === e.target.value);
    if (selectedCustomer) {
      setFormData(prevData => ({
        ...prevData,
        customer_name: selectedCustomer.Name,
        phone: selectedCustomer.Phone,
        id_customer: selectedCustomer.id_customer,
      }));
    }
  };

  const calculateTotal = (items) => {
    let total = 0;
    items.forEach(item => {
      total += item.total_harga;
    });
    return total;
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];

    if (name === "nama_produk") {
      const selectedProduct = namaProduks.find(product => product.nama_produk === value);
      if (selectedProduct) {
        updatedItems[index] = {
          ...updatedItems[index],
          [name]: value,
          harga_jual: selectedProduct.harga_jual,
          total_harga: selectedProduct.harga_jual * updatedItems[index].quantity,
        };
      }
    } else if (name === "quantity") {
      updatedItems[index].quantity = parseInt(value) || 1;
      updatedItems[index].total_harga = updatedItems[index].harga_jual * updatedItems[index].quantity;
    } else if (name === "address") {
      setFormData(prevData => ({
        ...prevData,
        address: value,
      }));
      return; // Keluar dari fungsi setelah mengupdate address
    }

    setFormData(prevData => ({
      ...prevData,
      items: updatedItems,
      total_transaksi: calculateTotal(updatedItems), // Update total transaksi
    }));
  };

  const handleAddProduct = () => {
    setFormData(prevData => ({
      ...prevData,
      items: [
        ...prevData.items,
        { nama_produk: "", quantity: 1, harga_jual: 0, total_harga: 0 },
      ],
    }));
  };

  const handleRemoveProduct = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData(prevData => ({
      ...prevData,
      items: updatedItems,
      total_transaksi: calculateTotal(updatedItems), // Update total transaksi
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.phone || !formData.address) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id_transaksi: simulatedId,
        }),
      });

      if (response.ok) {
        alert("Data sales berhasil ditambahkan!");
        setFormData({
          customer_name: "",
          phone: "",
          address: "",
          id_customer: "", 
          items: [
            { nama_produk: "", quantity: 1, harga_jual: 0, total_harga: 0 },
          ],
          total_transaksi: 0,
        });
        onClose(); // Menutup modal setelah submit
      } else {
        const errorData = await response.json();
        alert(`Gagal menambahkan data sales: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting sales:", error);
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };

  return (
    <div>
      <h2>Form Penjualan</h2>
      <form onSubmit={handleSubmit}>
        <label>ID Transaksi: {simulatedId}</label>
        <label>Pilih Customer:</label>
        <select name="customer_name" onChange={handleCustomerChange}>
          <option value="">Pilih customer</option>
          {customers.map(customer => (
            <option key={customer.id_customer} value={customer.Name}>
              {customer.Name}
            </option>
          ))}
        </select>

        <label>Customer ID:</label>
        <input
          type="text"
          value={formData.id_customer}
          readOnly
        />
        <label>Phone:</label>
        <input
          type="text"
          value={formData.phone}
          readOnly
        />
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={(e) => handleChange(e, -1)}
        />

        {formData.items.map((item, index) => (
          <div key={index}>
            <label>Nama Produk:</label>
            <select
              name="nama_produk"
              value={item.nama_produk}
              onChange={(e) => handleChange(e, index)}
            >
              <option value="">Pilih produk</option>
              {namaProduks.map(product => (
                <option key={product.kode_produk} value={product.nama_produk}>
                  {product.nama_produk}
                </option>
              ))}
            </select>
            <label>Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleChange(e, index)}
              min="1"
            />
            <label>Harga Jual: Rp {item.harga_jual}</label>
            <label>Total Harga: Rp {item.total_harga}</label>
            {index > 0 && (
              <button type="button" onClick={() => handleRemoveProduct(index)}>
                Hapus Produk
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={handleAddProduct}>
          Tambah Produk
        </button>
        <h3>Total Transaksi: Rp {formData.total_transaksi}</h3>
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>Cancel</button> {/* Tombol Cancel untuk menutup modal */}
      </form>
    </div>
  );
};

export default SalesForm;