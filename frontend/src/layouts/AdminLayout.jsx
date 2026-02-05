import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router";

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;