import React from 'react';
import { Link } from 'react-router-dom'; 
import Transbutton from '../../componens/TransButton';
import SalesTable from '../../componens/SalesTable';
import CancelTransaction from '../../componens/CancelTrans';
import NavbarSales from '../../componens/NavbarSales'
import CancelTrans from '../../componens/CancelTrans';
function SalesDashboard() {
  return (
    <div className="body">
      <NavbarSales/> 
      <SalesTable/>
    <Transbutton/>
    <CancelTransaction/>
    </div>
  );
}

export default SalesDashboard;