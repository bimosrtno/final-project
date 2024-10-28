import React from 'react';
import { Link } from 'react-router-dom'; 
import CustTabel from '../../componens/CustTabel';
import Transbutton from '../../componens/TransButton';
import SalesTable from '../../componens/SalesTable';
import AddCustomer from '../../componens/ButtonCustAdmin';
function SalesDashboard() {
  return (
    <div className="body"> 
      <CustTabel />
      <AddCustomer/>
      <SalesTable/>
    <Transbutton/>
    </div>
  );
}

export default SalesDashboard;