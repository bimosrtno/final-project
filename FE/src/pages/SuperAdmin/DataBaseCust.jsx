import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Sidebar from '../../componens/SideBar';
import CustData from '../../componens/CustTableAdmin';


function CustDataPage() {
  return (
    <div>
    <Helmet>
      <title>Super Admin</title>
    </Helmet>
    <div className="body">
   <Sidebar/>
      <h2>List Customer</h2>
      <CustData />  
    </div>
    </div>
  );
}

export default CustDataPage;
