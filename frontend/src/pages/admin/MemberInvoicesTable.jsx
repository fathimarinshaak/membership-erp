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
        if (res.data.success) setInvoices(res.data.invoices);
      } catch (err) {
        console.error("Failed to fetch invoices", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [memberId]);

  const markAsPaidCash = async (invoiceId) => {
    try {
      const res = await axios.post("/api/admin/payment/cash", {
        invoiceId
      });

      if (res.data.success) {
        setInvoices(prev =>
          prev.map(inv =>
            inv._id === invoiceId
              ? { ...inv, status: "PAID", paymentMethod: "CASH" }
              : inv
          )
        );
      }
    } catch (err) {
      console.error("Failed to mark cash payment", err);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#121212] to-black text-gray-200 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-wide text-gray-100">
          Member Invoices
        </h1>
      </div>

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr className="text-left text-gray-400 text-sm uppercase">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Invoice ID</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Date</th>
              <th className="px-6 py-4 text-right">Cash Payment</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  Loading invoices...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((inv, index) => (
                <tr
                  key={inv._id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-200">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {inv.membershipId?.planId?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-200">
                    ₹{inv.amount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${inv.status === "PAID"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                        }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400">
                    {new Date(inv.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {inv.status === "PAID" ? (
                      <span className="text-gray-400 text-xs">—</span>
                    ) : (
                      <button
                        onClick={() => markAsPaidCash(inv._id)}
                        className="px-3 py-1 text-xs font-semibold rounded-md
                   bg-green-600 text-white hover:bg-green-700"
                      >
                        Mark Paid (Cash)
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(`/admin/invoices/${inv._id}`)}
                      className="px-3 py-1 rounded-full text-sm font-semibold
                        bg-blue-500/15 text-blue-400 border border-blue-500/30
                        hover:bg-blue-500/25 hover:text-blue-300 transition"
                    >
                      View
                    </button>
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