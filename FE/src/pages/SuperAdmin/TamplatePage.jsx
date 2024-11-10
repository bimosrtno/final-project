import React from 'react';
import '../../CSS/bodyadmin.css';
import Sidebar from '../../componens/SideBar';
import TemplateManager from '../../componens/TemplateManager';

function TamplatePage() {
  return (
    <div className="body.admin">
        <Sidebar/>
 <TemplateManager/>
    </div>
  );
}

export default TamplatePage;