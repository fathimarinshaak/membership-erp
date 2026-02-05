import Login from "./pages/admin/AdminLogin";
import AddMember from "./pages/admin/addMember";
import ViewMember from "./pages/admin/ViewMembers";
import Home from "./pages/admin/Home";
import AdminLayout from "./layouts/AdminLayout";
import { Route, Routes } from "react-router";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

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
    </BrowserRouter>
  );
}