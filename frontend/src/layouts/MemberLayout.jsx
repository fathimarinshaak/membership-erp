import { Outlet } from "react-router";

const UserLayout = () => {
  return (
    <div className="min-h-screen w-full">
      <Outlet />
    </div>
  );
};

export default UserLayout;
