import Login from "./pages/admin/AdminLogin";
import AddMember from "./pages/admin/addMember";
import ViewMember from "./pages/admin/ViewMembers";
import Home from "./pages/admin/Home";
import AdminLayout from "./layouts/AdminLayout";
import { Route, Routes ,Outlet } from "react-router";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";



const UserLayout = () => (
  <div className="min-h-screen bg-white">
    <div className="bg-indigo-600 text-white p-4">Member Area</div>
    <div className="p-6">
      <Outlet />
    </div>
  </div>
);

export default function App() {
  return (
    <div>
      <ToastContainer/>

      <Routes>
        <Route path="/admin/login" element={<Login />} />
       
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Home />} />
          <Route path="addMember" element={<AddMember />} />
          <Route path="viewMember" element={<ViewMember />} />
        </Route>
      </Routes>
    </div>
  );
}