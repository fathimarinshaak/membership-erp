import { useEffect, useState } from "react";
import axios from "../../services/axios";
import { useParams, useNavigate } from "react-router";

const MemberInvoices = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get(`/api/admin/member/${memberId}/invoices`);
        if (res.data.success) {
          setInvoices(res.data.invoices);
        }
      } catch (err) {
        console.error("Failed to fetch invoices", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [memberId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111] to-black p-8 text-gray-200">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-400 hover:text-gray-100 mb-4 space-x-2"
      >
        <span className="text-xl">&#8592;</span>

      </button>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 tracking-wide text-gray-100">
        Member Invoices
      </h2>

      <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/5 backdrop-blur shadow-xl">
        <table className="min-w-full">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-sm uppercase">
              <th className="px-6 py-4 text-left">Invoice No</th>
              <th className="px-6 py-4 text-left">Plan</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Loading invoices...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((inv, index) => (
                <tr
                  key={inv._id}
                  className="border-t border-white/5 hover:bg-white/10 transition"
                >
                  <td className="px-6 py-4 font-medium">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-gray-300">
                    {inv.membershipId?.planId?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">
                    ₹{inv.amount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${inv.status === "PAID"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400">
                    {new Date(inv.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberInvoices;
