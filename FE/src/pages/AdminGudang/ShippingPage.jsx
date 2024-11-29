import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ShippingTable from '../../componens/ShippingTable';
import NavbarInven from '../../componens/NavBarInven'

function ShippingPage() {
  return (
    <div className="bg-gray-800 min-h-screen"> {/* Ganti background dengan warna cerah */}
      <Helmet>
        <title>Admin Gudang</title>
      </Helmet>
      <NavbarInven />
      <div className="container mx-auto mt-0 p-4"> {/* Container untuk padding */}
      <p className="text-xl text-white font-bold mb-4 text-left">Tabel Pengiriman</p> {/* Judul tabel */}
        <div className="overflow-x-auto"> {/* Membuat tabel scrollable pada layar kecil */}
          <ShippingTable />
        </div>
      </div>
    </div>
  );
}

export default ShippingPage;