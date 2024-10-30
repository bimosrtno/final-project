import React, { useState, useEffect } from 'react';
import CancelTable from '../../componens/CancelTable';
import Sidebar from '../../componens/SideBar';
import axios from 'axios';

function DataBaseSales() {
  return (
    <div className="body">
 <Sidebar/>
      
      <CancelTable/>
    </div>
  );
}

export default DataBaseSales;
