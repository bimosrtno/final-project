import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../componens/SideBar';
import TopSale from '../../componens/TopSales';
import BarChart from '../../componens/BarChart';
import CustData from '../../componens/CustTableAdmin';



function PerformancePage() {
  return (
    <div className="body">
   <Sidebar/>
      <h2>MASIH PROSES</h2>
<BarChart/>
      <TopSale/>
      <CustData/>
    </div>
    
  );
}

export default PerformancePage;
