import React from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../componens/SideBar';
import TemplateManager from '../../componens/TemplateManager';

function TamplatePage() {
  return (
    <div className="flex h-screen bg-gray-800">
      <Helmet><title>Super Admin</title></Helmet>
      <div className="w-56">
        <Sidebar/>
       </div>
       <div className="flex-1 bg-gray-800 pl-0 mr-10 pr-5 pt-5 overflow-y-auto"> {/* Area konten utama */}
        <div className="overflow-y-auto"> {/* Konten scrollable secara vertikal */}
          <div className="overflow-x-auto"> {/* Konten scrollable secara horizontal */} 
 <TemplateManager/>
    </div>
  </div>
  </div>
  </div>
  );
}

export default TamplatePage;