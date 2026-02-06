import React, { useContext, useState } from "react";
import { appContent } from "../../context/appContext";
import axios from "../../services/axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const navigate = useNavigate()
  const {backendUrl,isLoggedIn,setIsLoggedIn} = useContext(appContent)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [backenddata, setbackenddata] = useState("")

  const onSubmitHandler = async (e)=>{
    try {
      e.preventDefault()
      const {data} = await axios.post('/api/auth/login',
        {email,password}
      )
      if(!data.success){
        toast.error(data.error)
        setbackenddata(data.msg)
        return;
      }
      setIsLoggedIn(true)
      navigate('/admin')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">

      {/* Card */}
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">

        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Admin Login
        </h1>

        <form className="space-y-5" onSubmit={onSubmitHandler}>

          <div>
            <label className="block text-white mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              value={email}
              onChange={e=>setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-white mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              value={password}
              onChange={e=>setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold bg-white text-indigo-700 hover:bg-opacity-90 transition">
            Login
          </button>

        </form>
        <p className="text-center text-red-600 mt-2">{backenddata}</p>
        <p className="text-center text-white/70 text-sm mt-6">
          Authorized admin access only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;