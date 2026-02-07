import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

const MemberHome = () => {
  const { token } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!token) return;

    axios
      .get(`http://localhost:3000/api/member/dashboard/${token}`)
      .then(res => setData(res.data))
      .catch(err => console.error("Error loading dashboard", err));
  }, [token]);

  if (!data) return <div className="text-white p-6">Loading...</div>;

  const { member, currentPlan } = data;
  const planActive = currentPlan?.status === "ACTIVE";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#121212] to-black text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-orange-400 drop-shadow-lg">
        Member Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-5 rounded-2xl shadow-xl hover:bg-white/15 transition">
          <h2 className="text-xl font-semibold mb-3 text-white border-b border-white/20 pb-2">
            Member Details
          </h2>
          <p>Name: {member.name}</p>
          <p>Email: {member.email}</p>
          <p>Phone: {member.phone}</p>
          <p>WhatsApp: {member.whatsappNumber}</p>
        </div>

        {currentPlan && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-5 rounded-2xl shadow-xl hover:bg-white/15 transition">
            <h2 className="text-xl font-semibold mb-3 text-white border-b border-white/20 pb-2">
              Current Plan
            </h2>
            <p>Plan: {currentPlan.name}</p>
            <p>Price: ₹{currentPlan.price}</p>
            <p>Duration: {currentPlan.durationInDays} days</p>
            <p>Status: {planActive ? "ACTIVE" : "EXPIRED"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberHome;