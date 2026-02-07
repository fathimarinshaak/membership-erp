import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-3xl">
        
        <h1 className="text-4xl font-bold text-gray-100 mb-12 text-center tracking-wide">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          
          <div
            onClick={() => navigate("/admin/addMember")}
            className="cursor-pointer backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 text-center shadow-xl hover:bg-white/10 transition"
          >
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">
              Add Member
            </h2>
            <p className="text-gray-400">
              Register a new gym member and assign details
            </p>
          </div>

         
          <div
            onClick={() => navigate("/admin/viewMember")}
            className="cursor-pointer backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 text-center shadow-xl hover:bg-white/10 transition"
          >
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              View Members
            </h2>
            <p className="text-gray-400">
              Manage, edit and track all registered members
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
