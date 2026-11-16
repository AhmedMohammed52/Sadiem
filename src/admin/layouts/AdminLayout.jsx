import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

import { AdminToastProvider } from "../../context/AdminToastContext";

import "../styles/admin.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-layout" dir="rtl">
      <AdminToastProvider>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <div className="admin-main">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="admin-content">
            <Outlet />
          </main>
        </div>

        {sidebarOpen && (
          <button
            type="button"
            aria-label="إغلاق القائمة"
            onClick={closeSidebar}
            className="fixed inset-0 z-90 bg-slate-900/40 md:hidden"
          />
        )}
      </AdminToastProvider>
    </div>
  );
};

export default AdminLayout;
