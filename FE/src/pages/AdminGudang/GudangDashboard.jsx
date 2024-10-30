import React, { useEffect, useState } from 'react';
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
    <div className="body">
      <NavbarInven />
      <AddStock inventories={inventories} setInventories={setInventories} /> {/* Pass data to AddStock */}
      <InvenTable inventories={inventories} /> {/* Pass data to InvenTable */}
      
    </div>
  );
}

export default GudangDashboard;
