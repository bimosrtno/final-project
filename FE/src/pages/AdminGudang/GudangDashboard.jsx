import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import AddStock from '../../componens/AddStock'; // Pastikan path ini sesuai
import InvenTable from '../../componens/InvenTabel'; // Pastikan path ini sesuai
import NavbarInven from '../../componens/NavBarInven';

function GudangDashboard() {
  const [inventories, setInventories] = useState([]);

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/inventoris');
        setInventories(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-800 min-h-screen">
      <Helmet>
        <title>Admin Gudang</title>
      </Helmet>
      <NavbarInven />
      <div className="mt-10 ml-20 "> {/* Menggunakan flex dan justify-end */}
        <AddStock inventories={inventories} setInventories={setInventories} />
      </div>
      <InvenTable inventories={inventories} /> {/* Pass data to InvenTable */}
    </div>
  );
}

export default GudangDashboard;