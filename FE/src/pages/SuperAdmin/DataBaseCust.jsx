import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../componens/SideBar';
import CustData from '../../componens/CustTableAdmin';


function CustDataPage() {
  return (
    <div className="body">
   <Sidebar/>
      <h2>List Customer</h2>
      <CustData />  
    </div>
  );
}

export default CustDataPage;
