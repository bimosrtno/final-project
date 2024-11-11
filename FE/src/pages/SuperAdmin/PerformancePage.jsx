import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Sidebar from '../../componens/SideBar';
import TopSale from '../../componens/TopSales';
import BarChart from '../../componens/BarChart';
import CustData from '../../componens/CustTableAdmin';



function PerformancePage() {
  return (
    <div>
    <Helmet>
      <title>Super Admin</title>
    </Helmet>
    <div className="body">
   <Sidebar/>
<BarChart/>
      <TopSale/>
      <CustData/>
    </div>
    </div>
  );
}

export default PerformancePage;
