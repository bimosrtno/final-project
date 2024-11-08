import React from 'react';
import '../../CSS/bodyadmin.css';
import AddAdminForm from '../../componens/AddAdminForm';
import Sidebar from '../../componens/SideBar';
import AdminTable from '../../componens/AdminTable';
import TemplateManager from '../../componens/TemplateManager';

function AdminPage() {
  return (
    <div className="body.admin">
        <Sidebar/>
 <AddAdminForm/>
 <AdminTable/>
 <TemplateManager/>
    </div>
  );
}

export default AdminPage;