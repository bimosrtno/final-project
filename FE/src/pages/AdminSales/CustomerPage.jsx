import React from 'react';
import { Link } from 'react-router-dom'; 
import { Helmet } from 'react-helmet';
import CustTabel from '../../componens/CustTabel';
import AddCustomer from '../../componens/ButtonCustAdmin';
import NavbarSales from '../../componens/NavbarSales'

function CustomerPage() {
  return (
    <div className="bg-gray-800 min-h-screen">
    <Helmet>
      <title>Admin Sales</title>
    </Helmet>
    <div>
      <NavbarSales/> 
      <div className="container mx-auto mt-0 p-4"> {/* Container untuk padding */}
      <p className="text-xl text-white font-bold mb-4 text-left">Tabel Customer</p> {/* Judul tabel */}
        <div className="overflow-x-auto"> {/* Membuat tabel scrollable pada layar kecil */}
      <CustTabel /> 
        </div>
      </div>
    </div>
    </div>
  );
}

export default CustomerPage;