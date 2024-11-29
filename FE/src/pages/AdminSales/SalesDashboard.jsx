import React from 'react';
import { Link } from 'react-router-dom'; 
import { Helmet } from 'react-helmet';
import SalesTable from '../../componens/SalesTable';
import NavbarSales from '../../componens/NavbarSales';

function SalesDashboard() {
  return (
    <div className="bg-gray-800 min-h-screen">
    <Helmet>
      <title>Admin Sales</title>
    </Helmet>
    <div>
      <NavbarSales/> 
      <div className="container mx-auto mt-0 p-4"> {/* Container untuk padding */}
      <p className="text-xl text-white font-bold mb-4 text-left">Tabel Penjualan</p> {/* Judul tabel */}
        <div className="overflow-x-auto"> {/* Membuat tabel scrollable pada layar kecil */}
      <SalesTable/>
        </div>
      </div>
    </div>
  </div>
  );
}

export default SalesDashboard;