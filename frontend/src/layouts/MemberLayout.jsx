import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router";

const MemberLayout = () => {
  return (
    <div className="flex">
      <div className="ml-64 p-6 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default MemberLayout;