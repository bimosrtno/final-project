import React from 'react';
import { Link } from 'react-router-dom'; 
import CustTabel from '../../componens/CustTabel';
import Transbutton from '../../componens/TransButton';
import SalesTable from '../../componens/SalesTable';
import AddCustomer from '../../componens/ButtonCustAdmin';
import CancelTransaction from '../../componens/CancelTrans';
import NavbarSales from '../../componens/NavbarSales'
function SalesDashboard() {
  return (
    <div className="body">
      <NavbarSales/> 
      <CustTabel />
      <AddCustomer/>
      <SalesTable/>
    <Transbutton/>
    <CancelTransaction/>
    </div>
  );
}

export default SalesDashboard;