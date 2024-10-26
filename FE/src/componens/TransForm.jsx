import React, { useState, useEffect } from "react";

const SalesForm = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    address: "",
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
  const [simulatedId, setSimulatedId] = useState("");

  useEffect(() => {
    const fetchNamaProduks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/inventoris");
        const data = await response.json();
        setNamaProduks(data);
      } catch (error) {
        console.error("Error fetching nama produks:", error);
      }
    };

    fetchNamaProduks();
  }, []);

  useEffect(() => {
    const fetchLastTransactionId = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sales/last-transaction-id");
        const data = await response.json();

        // Generate ID baru
        const lastId = data.lastTransactionId || "TRS002";
        const newId = `TRS${(parseInt(lastId.replace("TRS", "")) + 1)
          .toString()
          .padStart(3, "0")}`;
        setSimulatedId(newId);
      } catch (error) {
        console.error("Error fetching last transaction ID:", error);
      }
    };

    fetchLastTransactionId();
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === "nama_produk") {
      const selectedProduct = namaProduks.find(
        (product) => product.nama_produk === value
      );
      const updatedItems = formData.items.map((item, i) =>
        i === index
          ? {
              ...item,
              [name]: value,
              harga_jual: selectedProduct.harga_jual,
              total_harga: selectedProduct.harga_jual * item.quantity,
            }
          : item
      );
      setFormData((prevData) => ({
        ...prevData,
        items: updatedItems,
      }));
    } else if (name === "quantity") {
      const updatedItems = formData.items.map((item, i) =>
        i === index
          ? { ...item, [name]: parseInt(value), total_harga: item.harga_jual * parseInt(value) }
          : item
      );
      setFormData((prevData) => ({
        ...prevData,
        items: updatedItems,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddProduct = () => {
    setFormData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        { nama_produk: "", quantity: 1, harga_jual: 0, total_harga: 0 },
      ],
    }));
  };

  const handleRemoveProduct = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));
  };

  useEffect(() => {
    // Hitung total transaksi setiap kali items berubah
    const total = formData.items.reduce(
      (acc, item) => acc + item.total_harga,
      0
    );
    setFormData((prevData) => ({
      ...prevData,
      total_transaksi: total,
    }));
  }, [formData.items]);

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

        // Reset form data setelah submit
        setFormData({
          customer_name: "",
          phone: "",
          address: "",
          items: [
            { nama_produk: "", quantity: 1, harga_jual: 0, total_harga: 0 },
          ],
          total_transaksi: 0,
        });

        // Fetch ID transaksi baru setelah submit
        const lastTransactionResponse = await fetch("http://localhost:5000/api/sales/last-transaction-id");
        const lastTransactionData = await lastTransactionResponse.json();
        const lastId = lastTransactionData.lastTransactionId || "TRS002";
        const newId = `TRS${(parseInt(lastId.replace("TRS", "")) + 1)
          .toString()
          .padStart(3, "0")}`;
        setSimulatedId(newId);
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
      <form onSubmit={handleSubmit}>
        <h2>Form Penjualan</h2>

        <label>ID Transaksi: {simulatedId}</label>

        <label>Customer Name:</label>
        <input
          type="text"
          name="customer_name"
          value={formData.customer_name}
          onChange={(e) => handleChange(e, -1)}
        />

        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={(e) => handleChange(e, -1)}
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
              {namaProduks.map((product) => (
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

            <label>Harga Jual: {item.harga_jual}</label>

            <label>Total Harga: {item.total_harga}</label>

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

        <h3>Total Transaksi: {formData.total_transaksi}</h3>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SalesForm;
