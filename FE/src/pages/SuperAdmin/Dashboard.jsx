import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AddProduct from '../../componens/AddProducts';
import InvenTable from '../../componens/InvenTabel';
import DeleteProduct from '../../componens/DeleteProduct';
import Sidebar from '../../componens/SideBar';
import axios from 'axios';

function DataBaseInven() {
  const [inventories, setInventories] = useState([]);

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/inventoris');
        setInventories(response.data);
      } catch (error) {
        console.error('Error fetching inventories:', error);
      }
    };

    fetchInventories();
  }, []);

  return (
    <div> 
      <Helmet>
        <title>Super Admin</title>
      </Helmet> 
    <div className="">
      <Sidebar />
      <InvenTable inventories={inventories} />

      {/* Flex container for buttons */}
      <div className="flex space-x-2 p-4">
        <AddProduct setInventories={setInventories} />
        <DeleteProduct setInventories={setInventories} />
      </div>
    </div>

    </div>
  );
}

export default DataBaseInven;