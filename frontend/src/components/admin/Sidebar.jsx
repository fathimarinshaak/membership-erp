import { NavLink, useNavigate } from "react-router";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/admin/login");
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-black/60 backdrop-blur-xl border-r border-white/10 text-gray-200 px-6 py-8 flex flex-col">
      
      <h3 className="text-2xl font-bold mb-12 tracking-wide">
        Admin Panel
      </h3>

      <ul className="flex flex-col gap-3 text-sm">
        {[
          { to: "/admin", label: "Home" },
          { to: "/admin/viewMember", label: "Members" },
          { to: "/admin/plans", label: "Membership Plans" },
          { to: "/admin/payments", label: "Payments" },
        ].map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
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
  );
};

export default Sidebar;
