import Login from "./pages/admin/AdminLogin";
import ViewMember from "./pages/admin/ViewMembers";
import Home from "./pages/admin/Home";
import AdminLayout from "./layouts/AdminLayout";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminGuard from "./guards/adminguard";
import AddMembershipPlan from "./pages/admin/AddMembershipPlan";
import ViewMembershipPlans from "./pages/admin/ViewMembershipPlan";
import EditMembershipPlan from "./pages/admin/EditMembershipPlan";
import MemberInvoices from "./pages/admin/MemberInvoices";
import AddMember from "./pages/admin/AddMember";
import MemberLayout from "./layouts/MemberLayout";
import MemberHome from "./pages/member/MemberHome";
import MemberAccess from "./pages/member/MemberAccess";
import PaymentHistory from "./pages/member/PaymentHistory";
import MembershipHistory from "./pages/member/MembershipHistory";

export default function App() {
  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark" />

      <Routes>
        {/* PUBLIC */}
        <Route path="/admin/login" element={<Login />} />

        {/* PROTECTED ADMIN ROUTES */}
        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Home />} />
            <Route path="addMember" element={<AddMember />} />
            <Route path="viewMember" element={<ViewMember />} />
            <Route path="addPlan" element={<AddMembershipPlan />} />
            <Route path="viewPlan" element={<ViewMembershipPlans />} />
            <Route path="editPlan/:id" element={<EditMembershipPlan />} />
            <Route path="/admin/members/:memberId/invoices" element={<MemberInvoices />}/>
          </Route>
        </Route>

        <Route path="/member/access/:token" element={<MemberLayout />}>
          <Route index element={<MemberHome />} />
          <Route path="payments" element={<PaymentHistory />} />
          <Route path="memberships" element={<MembershipHistory />} />
        </Route>

      </Routes>
    </>
  );
}