import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

import "../styles/admin.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout" dir="rtl">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="admin-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={closeSidebar}
          className="fixed inset-0 z-90 bg-slate-900/40 md:hidden"
        />
      )}
    </div>
  );
};

export default AdminLayout;
