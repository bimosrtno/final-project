import React, { useState, useEffect } from 'react';
import AddProduct from '../../componens/AddProducts';
import InvenTable from '../../componens/InvenTabel';
import axios from 'axios';

function Dashboard() {
  const [inventories, setInventories] = useState([]); // State untuk menyimpan data inventories

  useEffect(() => {
    // Fetch data inventori saat pertama kali komponen di-mount
    const fetchInventories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/inventoris');
        setInventories(response.data); // Simpan data ke state
      } catch (error) {
        console.error('Error fetching inventories:', error);
      }
    };

    fetchInventories();
  }, []); // Hanya dijalankan saat komponen pertama kali di-mount

  return (
    <div className="container">
      <AddProduct setInventories={setInventories} /> {/* Passing setInventories untuk update */}
      <InvenTable inventories={inventories} /> {/* Passing inventories sebagai props */}
    </div>
  );
}

export default Dashboard;
