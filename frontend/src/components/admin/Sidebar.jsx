import { NavLink, useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "../../services/axios";
import { useContext } from "react";
import { appContent } from "../../context/appContext";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(appContent);

  const doLogout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout");
      if (!data.success) {
        toast.error(data.msg);
        return;
      }
      setIsLoggedIn(false);
      navigate("/admin/login");
    } catch (error) {
      toast.error("admin logout failed!");
      console.log(error);
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
                setIsOpen(false);
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
    <>
      {/* OVERLAY (mobile only) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <div
        className={`
          fixed left-0 top-0 h-screen w-64
          bg-black/60 backdrop-blur-xl
          border-r border-white/10
          text-gray-200 px-6 py-8 flex flex-col
          z-50 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <h3 className="text-2xl font-bold mb-12 tracking-wide">
          Admin Panel
        </h3>

        <ul className="flex flex-col gap-3 text-sm">
          {[
            { to: "/admin", label: "Home" },
            { to: "/admin/viewMember", label: "Members" },
            { to: "/admin/viewplan", label: "Membership Plans" },
            { to: "/admin/payments", label: "Payments" },
          ].map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 rounded-xl transition"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
