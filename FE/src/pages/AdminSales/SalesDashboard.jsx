import React from 'react';
import { Link } from 'react-router-dom'; 
import CustTabel from '../../componens/CustTabel';
import Transbutton from '../../componens/TransButton';
import SalesTable from '../../componens/SalesTable';
function SalesDashboard() {
  return (
    <div className="body"> 
      <CustTabel />
      <SalesTable/>
    <Transbutton/>
    </div>
  );
}

export default SalesDashboard;