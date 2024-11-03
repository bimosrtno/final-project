import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FormCust({ onClose }) { // Menerima prop onClose
  const [formData, setFormData] = useState({
    Name: '',
    Phone: '',
    Email: '',
    Company: '',
    City: '',
    source: 'public'
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
          City: '',
          source: 'public'
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
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="relative z-0 w-full mb-5 group">
          <input type="text" name="Name" id="floating_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={formData.Name} onChange={handleInputChange} required />
          <label htmlFor="floating_name" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0">Nama</label>
        </div>
        
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="tel"
            name="Phone"
            id="floating_phone"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={formData.Phone}
            onChange={handleInputChange}
            pattern="[0-9]*" // Memastikan hanya angka yang bisa dimasukkan
            required
            maxLength="12" // Mengatur panjang maksimal sesuai format
          />
          <label htmlFor="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0">Nomor Telepon</label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input type="email" name="Email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={formData.Email} onChange={handleInputChange} required />
          <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0">Email</label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input type="text" name="Company" id="floating_company" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={formData.Company} onChange={handleInputChange} />
          <label htmlFor="floating_company" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0">Perusahaan</label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input type="text" name="City" id="floating_city" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={formData.City} onChange={handleInputChange} required />
          <label htmlFor="floating_city" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0">Domisili</label>
        </div>

        <div className="flex justify-between">
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Kirim</button>
          <button type="button" onClick={onClose} className="text-gray-500 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Cancel</button>
        </div>
      </form>

      {responseMessage && <p>{responseMessage}</p>}    
    </div>
  );
}

export default FormCust;