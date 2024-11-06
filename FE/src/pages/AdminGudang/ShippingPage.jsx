import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ShippingTable from '../../componens/ShippingTable';
import NavbarInven from '../../componens/NavBarInven'
import '../../CSS/Bodyadmin.css';
function ShippingPage() {
  return (
    <div> 
    <Helmet>
      <title>Admin Gudang</title>
    </Helmet>
    <div className="body.admin">
      <NavbarInven/> 
      <div className="mt-20"> {/* Tambahkan margin top 4 */}
      <ShippingTable/>
      </div>
    </div>
    </div>
  );
}

export default ShippingPage;