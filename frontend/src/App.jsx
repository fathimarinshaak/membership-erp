import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/admin/AdminLogin";
import AddMember from "./pages/admin/addMember";
import ViewMember from "./pages/admin/ViewMembers";
import Home from "./pages/admin/Home";
import AdminLayout from "./layouts/AdminLayout";

export default function App() {
  return (
    <BrowserRouter>
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