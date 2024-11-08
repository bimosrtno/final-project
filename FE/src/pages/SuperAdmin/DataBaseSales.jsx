import React from 'react';
import { Helmet } from 'react-helmet';
import CancelTable from '../../componens/CancelTable';
import Sidebar from '../../componens/SideBar';
import SuksesTable from '../../componens/SuksesTransTable';
import '../../CSS/bodyadmin.css';

function DataBaseSales() {
  return (
    <div> 
    <Helmet>
      <title>Super Admin</title>
    </Helmet>
    <div className="body.admin">
 <Sidebar />  
      <SuksesTable className="mb-6" /> {/* Tambahkan margin bottom untuk memberi jarak */}
      <div className='mt-10'> {/* Tambahkan margin top 4 */}
      <CancelTable/> 
      </div>
    </div>
    </div>
  );
}

export default DataBaseSales;