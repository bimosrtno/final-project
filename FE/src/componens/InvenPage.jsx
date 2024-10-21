// InvenTable.jsx (atau bisa diganti namanya menjadi InventoryPage.jsx)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddStock from './AddStock'; // Import komponen AddStock
import InvenTable from './InvenTabel'; // Mengganti nama komponen InvenTable menjadi InventoryTable

function InventoryPage() {
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
      <AddStock inventories={inventories} setInventories={setInventories} />
      <InvenTable inventories={inventories} />
    </div>
  );
}

export default InventoryPage;
