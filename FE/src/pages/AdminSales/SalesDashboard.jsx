import React from 'react';
import { Link } from 'react-router-dom'; 
import Transbutton from '../../componens/TransButton';
import SalesTable from '../../componens/SalesTable';
import CancelTransaction from '../../componens/CancelTrans';
import NavbarSales from '../../componens/NavbarSales';

function SalesDashboard() {
  return (
    <div>
      <NavbarSales/> 
      <div className="flex space-x-2">
        <Transbutton/>
        <CancelTransaction/>
      </div>
      <SalesTable/>
    </div>
  );
}

export default SalesDashboard;