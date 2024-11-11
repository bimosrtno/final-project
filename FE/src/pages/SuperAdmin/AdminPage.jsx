import React from 'react';
import { Helmet } from 'react-helmet';
import '../../CSS/bodyadmin.css';
import Sidebar from '../../componens/SideBar';
import AdminTable from '../../componens/AdminTable';
import TemplateManager from '../../componens/TemplateManager';

function AdminPage() {
  return (
    <div>
      <Helmet><title>Super Admin</title></Helmet>
    
    <div className="body.admin">
        <Sidebar/>
<div className='mb-8'>
 <AdminTable/>
</div>
    </div>
    </div>
  );
}

export default AdminPage;