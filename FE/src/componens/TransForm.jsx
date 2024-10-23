import React, { useState, useEffect } from "react";

const SalesForm = () => {
  const [formData, setFormData] = useState({
    nama_produk: "",
    customer_name: "",
    phone: "",
    address: "",
    quantity: 1,
    harga_jual: 0,
    total_transaksi: 0,
  });

  const [namaProduks, setNamaProduks] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [simulatedId, setSimulatedId] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false); // State untuk kontrol visibilitas form

  useEffect(() => {
    const fetchNamaProduks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/inventoris");
        if (!response.ok) {
          throw new Error(
            `Gagal mengambil daftar nama produk: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        setNamaProduks(data);
      } catch (error) {
        console.error("Error fetching nama produks:", error);
        alert(error.message);
      }
    };

    fetchNamaProduks();
  }, []);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sales");
        if (!response.ok) {
          throw new Error(
            `Gagal mengambil data sales: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        alert(error.message);
      }
    };

    fetchSalesData();
  }, []);

  useEffect(() => {
    const generateNewId = () => {
      if (salesData.length === 0) {
        return "TRS-004"; // Mulai dari TRS-004
      }

      const lastId = salesData[salesData.length - 1].id_transaksi;
      const lastIdNumber = parseInt(lastId.replace("TRS-", ""), 10);
      const newIdNumber = lastIdNumber + 1;
      const newId = `TRS-${newIdNumber.toString().padStart(3, "0")}`;
      return newId;
    };

    setSimulatedId(generateNewId());
  }, [salesData]);

  useEffect(() => {
    const fetchProductData = async () => {
      if (formData.nama_produk) {
        try {
          const selectedProduct = namaProduks.find(
            (item) => item.nama_produk === formData.nama_produk
          );
          if (selectedProduct) {
            setFormData((prevData) => ({
              ...prevData,
              harga_jual: selectedProduct.harga_jual,
              total_transaksi: selectedProduct.harga_jual * prevData.quantity,
            }));
          } else {
            throw new Error("Produk tidak ditemukan");
          }
        } catch (error) {
          console.error("Error fetching product data:", error);
          alert(error.message);
        }
      }
    };

    fetchProductData();
  }, [formData.nama_produk, formData.quantity, namaProduks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama_produk || !formData.customer_name || !formData.phone || !formData.address) {
      alert('Semua field harus diisi!');
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, id_transaksi: simulatedId }),
      });

      if (response.ok) {
        setFormData({
          nama_produk: "",
          customer_name: "",
          phone: "",
          address: "",
          quantity: 1,
          harga_jual: 0,
          total_transaksi: 0,
        });

        const response = await fetch("http://localhost:5000/api/sales");
        const data = await response.json();
        setSalesData(data);

        alert("Data sales berhasil ditambahkan!");
      } else {
        const errorData = await response.json();
        alert(`Gagal menambahkan data sales: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding sales:", error);
      alert("Terjadi kesalahan saat menambahkan data sales.");
    }
  };

  return (
    <div>
      {/* Button untuk menampilkan atau menyembunyikan form */}
      <button onClick={() => setIsFormVisible(!isFormVisible)}>
        {isFormVisible ? "Batal" : "Input Transaksi"}
      </button>

      {/* Render form jika isFormVisible true */}
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="id_transaksi">ID Transaksi:</label>
            <input
              type="text"
              id="id_transaksi"
              name="id_transaksi"
              value={simulatedId}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="nama_produk">Nama Produk:</label>
            <select
              id="nama_produk"
              name="nama_produk"
              value={formData.nama_produk}
              onChange={handleChange}
            >
              <option value="">Pilih Nama Produk</option>
              {namaProduks.map((item) => (
                <option key={item.nama_produk} value={item.nama_produk}>
                  {item.nama_produk}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="customer_name">Nama Customer:</label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="phone">No. HP:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="address">Alamat:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
            />
          </div>
          <div>
            <label htmlFor="harga_jual">Harga Jual:</label>
            <input
              type="number"
              id="harga_jual"
              name="harga_jual"
              value={formData.harga_jual}
              readOnly
            />
          </div>
          <div>
            <label htmlFor="total_transaksi">Total Transaksi:</label>
            <input
              type="number"
              id="total_transaksi"
              name="total_transaksi"
              value={formData.total_transaksi}
              readOnly
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default SalesForm;
