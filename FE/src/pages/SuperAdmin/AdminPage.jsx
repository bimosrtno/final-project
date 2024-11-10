import React from 'react';
import '../../CSS/bodyadmin.css';
import Sidebar from '../../componens/SideBar';
import AdminTable from '../../componens/AdminTable';
import TemplateManager from '../../componens/TemplateManager';

function AdminPage() {
  return (
    <div className="body.admin">
        <Sidebar/>
<div className='mb-8'>
 <AdminTable/>
</div>
    </div>
  );
}

export default AdminPage;