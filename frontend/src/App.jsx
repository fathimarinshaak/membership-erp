import Login from "./pages/admin/AdminLogin";
import { payNow } from "./pay";
import AddMember from "./pages/admin/addMember";
import ViewMember from "./pages/admin/ViewMembers";
import { Route, Routes } from "react-router";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

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