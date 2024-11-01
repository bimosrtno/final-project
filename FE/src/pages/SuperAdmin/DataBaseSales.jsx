import React from 'react';
import CancelTable from '../../componens/CancelTable';
import Sidebar from '../../componens/SideBar';
import SuksesTable from '../../componens/SuksesTransTable';

function DataBaseSales() {
  return (
    <div className="body">
      <Sidebar />
      <SuksesTable className="mb-6" /> {/* Tambahkan margin bottom untuk memberi jarak */}
      <div className='mt-1'> {/* Tambahkan margin top 4 */}
      <CancelTable/> 
      </div>
    </div>
  );
}

export default DataBaseSales;