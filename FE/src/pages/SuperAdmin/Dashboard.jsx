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
    <div className="flex h-screen bg-gray-800"> {/* Mengatur layout flex untuk seluruh halaman */}
      <Helmet>
        <title>Super Admin</title>
      </Helmet>
      <div className="w-56"> {/* Sidebar dengan lebar tetap */}
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-800 pl-0 mr-5 pr-5 pt-10 overflow-y-auto"> {/* Area konten utama */}
        <div className="overflow-y-auto"> {/* Membuat konten scrollable secara vertikal */}
          <div className="overflow-x-auto"> {/* Membuat konten scrollable secara horizontal */}
            <InvenTable inventories={inventories} />
            {/* Wrapper untuk tombol */}
            <div className="flex flex-row justify-start items-center gap-x-4 mt-4"> {/* Flex container untuk tombol */}
              <AddProduct setInventories={setInventories} />
              <DeleteProduct setInventories={setInventories} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataBaseInven;
