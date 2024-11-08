import React, { useState } from 'react';
import axios from 'axios';

const AddAdminForm = () => {
  const [formData, setFormData] = useState({
    nama: '',
    nomor: '',
    username: '',
    password: '',
    role: 'sales' // Default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validasi agar hanya angka yang diterima untuk 'nomor'
    if (name === "nomor" && !/^\d*$/.test(value)) {
      return; // Tidak mengizinkan input jika bukan angka
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kirim data form, nomor masih dalam format string
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log('Admin added successfully:', response.data);
      // Reset form after success, if needed
      setFormData({
        nama: '',
        nomor: '',
        username: '',
        password: '',
        role: 'sales' // Default role
      });
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Tambah Admin</h2>
      <div>
        <label>Nama:</label>
        <input
          type="text"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Nomor:</label>
        <input
          type="text" // Tetap text untuk menerima input '0'
          name="nomor"
          value={formData.nomor}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Role:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="sales">Sales</option>
          <option value="gudang">Gudang</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </div>
      <button type="submit">Tambah Admin</button>
    </form>
  );
};

export default AddAdminForm;