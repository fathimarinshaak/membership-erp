import { useEffect, useState } from "react";
import axios from "../../services/axios";
import { useParams } from "react-router";

const MemberInvoices = () => {
  const { memberId } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get(
          `/api/admin/member/${memberId}/invoices`
        );

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
    <div className="p-6">
      <div className="bg-white rounded-xl shadow border">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Payments
          </h2>
          <span className="text-sm text-gray-500">
            Total: {invoices.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading invoices...
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Invoice No</th>
                  <th className="px-6 py-3 text-left">Plan</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {invoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr
                      key={inv._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {inv.invoiceNumber}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {inv.membershipId?.planId?.name || "-"}
                      </td>

                      <td className="px-6 py-4 text-right font-semibold">
                        ₹{inv.amount}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${inv.status === "PAID"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                            }`}
                        >
                          {inv.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right text-gray-600">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberInvoices;