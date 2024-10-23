import React from 'react';
import { Link } from 'react-router-dom'; 
import CustTabel from '../../componens/CustTabel';
import SalesForm from '../../componens/TransForm';
import SalesTable from '../../componens/SalesTable';
function SalesDashboard() {
  return (
    <div className="body"> 
      <CustTabel />
      <SalesTable/>
    <SalesForm />
    </div>
  );
}

export default SalesDashboard;