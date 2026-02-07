import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { appContent } from "../context/appContext";

const AdminGuard = () => {
  const { isLoggedIn, loading } = useContext(appContent);

  if (loading) return <div>Checking admin auth...</div>;
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
};

export default AdminGuard;