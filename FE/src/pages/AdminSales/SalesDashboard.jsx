import React from 'react';
import { Link } from 'react-router-dom'; 
import { Helmet } from 'react-helmet';
import Transbutton from '../../componens/TransButton';
import SalesTable from '../../componens/SalesTable';
import CancelTransaction from '../../componens/CancelTrans';
import NavbarSales from '../../componens/NavbarSales';
import '../../CSS/Bodyadmin.css';

function SalesDashboard() {
  return (
    <div>
    <Helmet>
      <title>Admin Sales</title>
    </Helmet>
    <div className="body.admin">
      <NavbarSales/> 
      <div className='mt-20'> {/* Tambahkan margin top 4 */}
      <SalesTable/>
      </div>
    </div>
  </div>
  );
}

export default SalesDashboard;