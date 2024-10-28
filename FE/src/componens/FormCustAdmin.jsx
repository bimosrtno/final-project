import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/Modal.css'; // Buat file CSS untuk modal

function FormCustAdmin({ closeModal, onSave }) {
  const [formData, setFormData] = useState({
    Name: '',
    Phone: '',
    Email: '',
    Company: '',
    City: '',
    source: 'admin' // Set default value for source
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Memastikan field yang wajib diisi tidak kosong
    if (!formData.Name || !formData.Phone || !formData.Email || !formData.City) {
      setResponseMessage('Nama, Nomor, Email, dan Domisili harus diisi!');
      return;
    }

    axios.post('http://localhost:5000/customers', formData)
      .then((response) => {
        setResponseMessage('Data berhasil dikirim!');
        onSave(); // Memanggil fungsi untuk mengambil data yang baru
        closeModal(); // Menutup modal setelah sukses
        setFormData({ 
          Name: '',
          Phone: '',
          Email: '',
          Company: '',
          City: '',
          source: 'admin'
        });
      })
      .catch((error) => {
        console.error("Ada masalah saat mengirim form", error);
        setResponseMessage('Ada masalah saat mengirim data, coba lagi.');
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h1>Form Customer</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Nama:
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />
          <label>
            Nomor:
            <input
              type="text"
              name="Phone"
              value={formData.Phone}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />
          <label>
            Perusahaan:
            <input
              type="text"
              name="Company"
              value={formData.Company}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Domisili:
            <input
              type="text"
              name="City"
              value={formData.City}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />
          <button type="submit">Kirim</button>
          <button type="button" onClick={closeModal}>Batal</button>
        </form>
        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </div>
  );
}

export default FormCustAdmin;
