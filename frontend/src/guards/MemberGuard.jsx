import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { appContent } from "../context/appContext";

const MemberGuard = () => {
  const { userLoggedIn, loading } = useContext(appContent);

  if (loading) return <div>Checking user auth...</div>;
  if (!userLoggedIn) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default MemberGuard;
