import React from 'react';
import { Link } from 'react-router-dom'; 
import ShippingTable from '../../componens/ShippingTable';
import NavbarInven from '../../componens/NavBarInven';
function ShippingPage() {
  return (
    <div className="body">
      <NavbarInven/> 
      <ShippingTable/>
    </div>
  );
}

export default ShippingPage;