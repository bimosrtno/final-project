import React from 'react';
import { Helmet } from 'react-helmet';
import TransTable from '../../componens/TransTable';
import Sidebar from '../../componens/SideBar';

function DataBaseSales() {
  return (
    <div className="flex h-screen bg-gray-800"> {/* Layout utama dengan flex */}
      <Helmet>
        <title>Super Admin</title>
      </Helmet>
      <div className="w-56"> {/* Sidebar dengan lebar tetap */}
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-800 pl-0 mr-10 pr-5 pt-5 overflow-y-auto"> {/* Area konten utama */}
        <div className="overflow-y-auto"> {/* Konten scrollable secara vertikal */}
          <div className="overflow-x-auto"> {/* Konten scrollable secara horizontal */}
            <TransTable className="mb-6" /> {/* Tambahkan margin bottom untuk memberi jarak */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataBaseSales;
