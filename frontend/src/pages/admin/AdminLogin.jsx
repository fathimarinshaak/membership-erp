import React from "react";

const AdminLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">

      {/* Card */}
      <div className="w-full max-w-md p-8 rounded-2xl
                      bg-white/20 backdrop-blur-xl
                      border border-white/30
                      shadow-2xl">

        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Admin Login
        </h1>

        <form className="space-y-5">

          <div>
            <label className="block text-white mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full px-4 py-2 rounded-lg
                         bg-white/30 text-white placeholder-white/70
                         focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-white mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg
                         bg-white/30 text-white placeholder-white/70
                         focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold
                       bg-white text-indigo-700
                       hover:bg-opacity-90 transition">
            Login
          </button>

        </form>

        <p className="text-center text-white/70 text-sm mt-6">
          Authorized admin access only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;