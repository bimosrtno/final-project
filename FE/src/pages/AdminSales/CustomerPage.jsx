import React from 'react';
import { Link } from 'react-router-dom'; 
import CustTabel from '../../componens/CustTabel';
import AddCustomer from '../../componens/ButtonCustAdmin';
import NavbarSales from '../../componens/NavbarSales'
function CustomerPage() {
  return (
    <div className="body">
      <NavbarSales/> 
      <AddCustomer/> 
      <CustTabel /> 
    </div>
  );
}

export default CustomerPage;