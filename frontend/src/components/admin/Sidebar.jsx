import { NavLink, useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "../../services/axios";
import { useContext } from "react";
import { appContent } from "../../context/appContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { setAdminLoggedIn } = useContext(appContent)

  const doLogout = async () => {
    try {
      const { data } = await axios.post('/api/auth/logout')
      if (!data.success) {
        toast.error(data.msg)
        return;
      }
      setAdminLoggedIn(false)
      navigate('/admin/login')
    } catch (error) {
      toast.error("admin logout failed!")
      console.log(error)
    }
  };

  const handleLogout = () => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold">Confirm logout</p>
          <p className="text-sm opacity-80">
            You will be signed out of the admin panel.
          </p>

          <div className="flex gap-3 mt-3">
            <button
              onClick={() => {
                doLogout();
                closeToast();
              }}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>

            <button
              onClick={closeToast}
              className="bg-gray-600 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false, position: "top-center" }
    );
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-white p-4 fixed">

      <h3 className="text-2xl font-bold mb-8">Admin Panel</h3>

      <ul className="flex flex-col gap-4">
        <li>
          <NavLink
            to="/admin"
            className="hover:text-blue-500 transition-colors duration-300"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/viewMember"
            className="hover:text-blue-500 transition-colors duration-300"
          >
            Members
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/viewplan"
            className="hover:text-blue-500 transition-colors duration-300"
          >
            Membership Plans
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/payments"
            className="hover:text-blue-500 transition-colors duration-300"
          >
            Payments
          </NavLink>
        </li>
      </ul>

      <button
        onClick={handleLogout}
        className="mt-auto bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;