import React from 'react';
import { Link } from 'react-router-dom'; 
import CustTabel from '../../componens/CustTabel';
import AddCustomer from '../../componens/ButtonCustAdmin';
import NavbarSales from '../../componens/NavbarSales'
import '../../CSS/Bodyadmin.css';
function CustomerPage() {
  return (
    <div className='body.admin' >
      <NavbarSales/> 
      <div className='mt-20'> {/* Tambahkan margin top 4 */}
      <CustTabel /> 
      </div>
    </div>
  );
}

export default CustomerPage;