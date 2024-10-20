import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FormCust() {
  const [formData, setFormData] = useState({
    Name: '',
    Phone: '',
    Email: '',
    Company: '',
    City: ''
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [savedData, setSavedData] = useState([]);

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
        fetchSavedData();
        setFormData({ 
          Name: '',
          Phone: '',
          Email: '',
          Company: '',
          City: ''
        });
      })
      .catch((error) => {
        console.error("Ada masalah saat mengirim form", error);
        setResponseMessage('Ada masalah saat mengirim data, coba lagi.');
      });
  };

  const fetchSavedData = () => {
    axios.get('http://localhost:5000/customers')
      .then((response) => {
        setSavedData(response.data);
      })
      .catch((error) => {
        console.error("Ada masalah saat mengambil data", error);
      });
  };

  useEffect(() => {
    fetchSavedData();
  }, []);

  return (
    <div>
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
      </form>

      {responseMessage && <p>{responseMessage}</p>}
      <h2>Data yang Tersimpan:</h2>
      <ul>
        {savedData.map((data, index) => (
          <li key={index}>
            {data.Name} - {data.Phone} - {data.Email} - {data.Company} - {data.City}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FormCust;