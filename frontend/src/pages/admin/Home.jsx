import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 hover:text-blue-600 transition-colors duration-300">
        Admin Home
      </h1>

      <button
        onClick={() => navigate("/admin/addMember")}
        className="bg-blue-600 text-white px-4 py-2 rounded mr-3 hover:bg-blue-700 transition-colors duration-300"
      >
        Add Member
      </button>

      <button
        onClick={() => navigate("/admin/viewMember")}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300"
      >
        View Members
      </button>
    </div>
  );
};

export default Home;