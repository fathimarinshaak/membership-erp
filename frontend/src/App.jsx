import Login from "./pages/admin/AdminLogin";
import AddMember from "./pages/admin/addMember";
import ViewMember from "./pages/admin/ViewMembers";
import Home from "./pages/admin/Home";
import AdminLayout from "./layouts/AdminLayout";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminGuard from "./guards/adminguard";

export default function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        {/* PUBLIC */}
        <Route path="/admin/login" element={<Login />} />

        {/* PROTECTED ADMIN ROUTES */}
        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Home />} />
            <Route path="addMember" element={<AddMember />} />
            <Route path="viewMember" element={<ViewMember />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}