import Login from "./pages/admin/AdminLogin";
import { payNow } from "./pay";
import AddMember from "./pages/admin/addMember";
import ViewMember from "./pages/admin/ViewMembers";
import { Outlet, Route, Routes } from "react-router";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const AdminLayout = () => (
  <div className="min-h-screen bg-gray-100">
    <div className="bg-gray-900 text-white p-4">Admin Panel</div>
    <div className="p-6">
      <Outlet />
    </div>
  </div>
);

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
        <Route path="/admin/addMember" element={<AddMember />} />
        <Route path="/admin/viewMember" element={<ViewMember />} />

        <Route
          path="/"
          element={
            <div className="container mx-auto p-6">
              <h1 className="text-2xl font-bold mb-4">
                Razorpay Payment
              </h1>

              <button
                onClick={payNow}
                className="bg-blue-600 text-white px-4 py-2 rounded mr-3"
              >
                Razorpay
              </button>

              <button className="bg-green-600 text-white px-4 py-2 rounded">
                Cashfree
              </button>
            </div>
          }
        />
      
      </Routes>
    </div>
  );
}