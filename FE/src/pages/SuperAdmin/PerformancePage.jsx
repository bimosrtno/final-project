import React from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../componens/SideBar';
import TopSale from '../../componens/TopSales';
import BarChart from '../../componens/BarChart';
import CustData from '../../componens/CustTableAdmin';

function PerformancePage() {
  return (
    <div className="flex h-screen bg-gray-800"> {/* Mengatur flex dan tinggi layar dengan latar belakang */}
      <Helmet>
        <title>Super Admin</title>
      </Helmet>
      <div className="w-56"> {/* Kurangi ukuran lebar sidebar */}
        <Sidebar />
      </div>
      <div className="flex-1 bg-gray-800 pl-1 pr-5 pt-10 overflow-y-auto"> {/* Kurangi padding kiri */}
        <div className="overflow-y-auto"> {/* Membuat konten scrollable */}
          <div className="overflow-x-auto"> {/* Membuat konten horizontal scrollable */}
            <BarChart />
            <TopSale />
            <CustData />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformancePage;
