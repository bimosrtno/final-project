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
    <div>
      <Helmet>
        <title>Admin Gudang</title>
      </Helmet>
    <div className="body.admin">
      <NavbarInven />
      <div className="mt-20"> {/* Tambahkan margin top 4 */}
        <InvenTable inventories={inventories} /> {/* Pass data to InvenTable */}
      </div>
      <AddStock inventories={inventories} setInventories={setInventories} /> {/* Pass data to AddStock */}
    </div>

    </div>
  );
}

export default GudangDashboard;