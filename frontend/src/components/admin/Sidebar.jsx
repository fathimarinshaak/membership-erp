import { NavLink, useNavigate } from "react-router";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout =async () => {
    try {
      e.preventDefault()
      const { data } = await axios.post('/api/auth/logout')
      if (!data.success) {
        toast.error(data.msg)
        return;
      }
      setIsLoggedIn(false)
      navigate('/admin/login')
    } catch (error) {
      toast.error(error.message)
    }
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