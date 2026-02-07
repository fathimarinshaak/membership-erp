import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "../../services/axios";

const MembershipHistory = () => {
  const { token } = useParams();
  const [history, setHistory] = useState([]);

  useEffect(() => {
     console.log(token)
    axios
      .get(`/api/member/membership-history/${token}`)
      .then(res => setHistory(res.data));
  }, [token]);
   console.log(history)

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-[#3a3734] via-[#4d4844] to-[#2b2a28]">
      <h1 className="text-3xl font-bold text-[#f2edea] mb-6">
        Membership History
      </h1>

      {history.map(item => (
        <div
          key={item._id}
          className="mb-4 p-4 rounded-xl bg-white/10 border border-white/10"
        >
          <p className="text-gray-100">Plan: {item.planName}</p>
          <p className="text-gray-100">
            {new Date(item.startDate).toLocaleDateString()} →{" "}
            {new Date(item.endDate).toLocaleDateString()}
          </p>
          <p className="text-gray-400 text-sm">
            Status: {item.status}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MembershipHistory;
