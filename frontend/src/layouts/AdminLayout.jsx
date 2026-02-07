import { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="w-full lg:ml-64 p-6">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden mb-4 px-4 py-2 rounded bg-white/10 text-white"
        >
          ☰ Menu
        </button>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
