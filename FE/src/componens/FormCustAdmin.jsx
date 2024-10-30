import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/Modal.css'; // Impr file CSS untuk modal

function FormCustAdmin({ closeModal, onSave }) {
  const [formData, setFormData] = useState({
    Name: '',
    Phone: '',
    Email: '',
    Company: '',
    City: '',
    source: 'admin', // Set default value for source
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

    // Kirim data ke API
    axios.post('http://localhost:5000/customers', formData)
      .then(() => {
        setResponseMessage('Data berhasil dikirim!');
        onSave(); // Memanggil fungsi untuk mengambil data yang baru
        closeModal(); // Menutup modal setelah sukses
        setFormData({
          Name: '',
          Phone: '',
          Email: '',
          Company: '',
          City: '',
          source: 'admin',
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
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Form Customer</h1>
        <form onSubmit={handleSubmit} className="p-4 md:p-5">
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="relative z-0 w-full mb-5 group">
              <label htmlFor="Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama</label>
              <input
                type="text"
                name="Name"
                id="Name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Masukkan nama customer"
                value={formData.Name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <label htmlFor="Phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nomor</label>
              <input
                type="text"
                name="Phone"
                id="Phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Masukkan nomor telepon"
                value={formData.Phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <label htmlFor="Email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input
                type="email"
                name="Email"
                id="Email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Masukkan email customer"
                value={formData.Email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <label htmlFor="Company" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Perusahaan</label>
              <input
                type="text"
                name="Company"
                id="Company"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Masukkan nama perusahaan"
                value={formData.Company}
                onChange={handleInputChange}
              />
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <label htmlFor="City" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Domisili</label>
              <input
                type="text"
                name="City"
                id="City"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Masukkan kota domisili"
                value={formData.City}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Kirim
            </button>
            <button type="button" onClick={closeModal} className="text-gray-600 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-500 ml-2">
              Batal
            </button>
          </div>
          
          {responseMessage && <p className="text-red-500">{responseMessage}</p>} {/* Tampilkan pesan */}
        </form>
      </div>
    </div>
  );
}

export default FormCustAdmin;