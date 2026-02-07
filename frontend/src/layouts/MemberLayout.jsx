import { Outlet } from "react-router";

const MemberLayout = () => {
  return (
    <div className="min-h-screen w-full">
      <Outlet />
    </div>
  );
};

export default MemberLayout;
