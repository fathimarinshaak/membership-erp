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
  <div className="min-h-screen w-full 
                  flex justify-center items-start
bg-gradient-to-br
from-[#3a3734]
via-[#4d4844]
to-[#2b2a28]
 p-10">

    <div className="w-full max-w-4xl animate-fadeIn">
      <h1 className="text-4xl font-bold mb-8 text-[#f2edea]   drop-shadow-xl text-center tracking-wide">
        Member Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* MEMBER DETAILS */}
        <div className="backdrop-blur-2xl bg-white/10 border border-white/10 
                        p-6 rounded-2xl shadow-2xl 
                        hover:bg-white/15 hover:scale-[1.02] 
                        transition-all duration-300 ease-out">
          <h2 className="text-xl font-semibold mb-3 text-[#e7d8cb] border-b border-white/20 pb-2">
            Member Details
          </h2>
          <p className="text-gray-100">Name: {member.name}</p>
          <p className="text-gray-100">Email: {member.email}</p>
          <p className="text-gray-100">Phone: {member.phone}</p>
          <p className="text-gray-100">WhatsApp: {member.whatsappNumber}</p>
        </div>

        {/* CURRENT PLAN */}
        {currentPlan && (
          <div className="backdrop-blur-2xl bg-white/10 border border-white/10 
                          p-6 rounded-2xl shadow-2xl 
                          hover:bg-white/15 hover:scale-[1.02]
                          transition-all duration-300 ease-out">
            <h2 className="text-xl font-semibold mb-3 text-[#e7d8cb] border-b border-white/20 pb-2">
              Current Plan
            </h2>

            <p className="text-gray-100">Plan: {currentPlan.name}</p>
            <p className="text-gray-100">Price: ₹{currentPlan.price}</p>
            <p className="text-gray-100">Duration: {currentPlan.durationInDays} days</p>
            <p className="mt-1">
            <span
              className={`
                px-2.5 py-0.5 text-xs font-semibold rounded-full
                backdrop-blur-md border 
                ${planActive
                  ? "bg-green-500/20 border-green-400/40 text-green-300"
                  : "bg-red-500/20 border-red-400/40 text-red-300"
                }
              `}
            >
              {planActive ? "ACTIVE" : "EXPIRED"}
            </span>
          </p>

            <p className="text-gray-100">
              Expiry Date:{" "}
              {currentPlan.endDate
                ? new Date(currentPlan.endDate).toLocaleDateString()
                : "N/A"}
            </p>

            <p className="text-gray-100">
              Days Left:{" "}
              {currentPlan.daysLeft !== undefined
                ? currentPlan.daysLeft
                : currentPlan.remainingDays}
            </p>
          </div>
        )}
      </div>

      {/* PAYMENT HISTORY TABLE */}
      <div className="mt-10 backdrop-blur-2xl bg-white/10 border border-white/10 
                      p-6 rounded-2xl shadow-xl
                      hover:bg-white/15 transition duration-300 ease-out">

        <h2 className="text-xl font-semibold mb-4  text-[#f2edea] border-b border-white/20 pb-2">
          Payment History
        </h2>

        <table className="w-full text-left text-gray-200">
          <thead>
            <tr className="text-[#e7d8cb] border-b border-white/20">
              <th className="py-2">Date</th>
              <th className="py-2">Plan</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
              <th className="py-2">Invoice</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            <tr className="hover:bg-white/10 transition">
              <td className="py-2">01 Feb 2025</td>
              <td>Monthly</td>
              <td>₹999</td>
              <td className="text-green-400 font-semibold">Paid</td>
            </tr>

            <tr className="hover:bg-white/10 transition">
              <td className="py-2">01 Jan 2025</td>
              <td>Monthly</td>
              <td>₹999</td>
              <td className="text-green-400 font-semibold">Paid</td>
            </tr>

            <tr className="hover:bg-white/10 transition">
              <td className="py-2">01 Dec 2024</td>
              <td>Monthly</td>
              <td>₹999</td>
              <td className="text-green-400 font-semibold">Paid</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
};

export default MemberHome;
