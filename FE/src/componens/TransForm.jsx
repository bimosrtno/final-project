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
    return items.reduce((total, item) => total + item.total_harga, 0);
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
      return;
    }

    setFormData(prevData => ({
      ...prevData,
      items: updatedItems,
      total_transaksi: calculateTotal(updatedItems),
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
      total_transaksi: calculateTotal(updatedItems),
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
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Gagal menambahkan data sales: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting sales:", error);
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };

  const formatRupiah = (value) => {
    return `Rp ${value.toLocaleString()}`; // Format penulisan rupiah
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden">
        <div className="relative w-full max-w-md p-4">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Form Penjualan
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={onClose}
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
              </button>
            </div>
            <form className="p-4" onSubmit={handleSubmit}>
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
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm"
              />
              <label>Phone:</label>
              <input
                type="text"
                value={formData.phone}
                readOnly
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm"
              />
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={(e) => handleChange(e, -1)}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm"
              />

              {formData.items.map((item, index) => (
                <div key={index}>
                  <label>Nama Produk:</label>
                  <select
                    name="nama_produk"
                    value={item.nama_produk}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm"
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
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 text-sm"
                  />
                  <label>Harga Jual: {formatRupiah(item.harga_jual)}</label>
                  <label>Total Harga: {formatRupiah(item.total_harga)}</label>
                  {index > 0 && (
                    <button type="button" onClick={() => handleRemoveProduct(index)}>
                      Hapus Produk
                    </button>
                  )}
                </div>
              ))}

              <button type="button" onClick={handleAddProduct} className="mt-2">
                Tambah Produk
              </button>
              <h3>Total Transaksi: {formatRupiah(formData.total_transaksi)}</h3>
              <div className="flex justify-end mt-4">
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                  Submit
                </button>
                <button type="button" onClick={onClose} className="text-gray-500 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm px-5 py-2.5">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div> 
    </>
  );
};

export default SalesForm;