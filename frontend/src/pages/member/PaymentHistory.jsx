import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "../../services/axios";
import { toast } from "react-toastify";

const PaymentHistory = () => {
  const { token } = useParams();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/member/invoices/${token}`)
      .then(res => setInvoices(res.data.invoices))
      .catch(() => toast.error("Failed to load invoices"));
  }, [token]);

  const payInvoice = async (invoice) => {
    try {
      const { data } = await axios.post("/api/member/payment/create-order", {
        invoiceId: invoice._id
      });

      if (!data.success) {
        toast.error(data.message || "Order failed");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        order_id: data.orderId,
        amount: data.amount,
        currency: "INR",
        name: "Membership Payment",
        description: invoice.invoiceNumber,

        handler: async (response) => {
          try {
            await axios.post("/api/member/payment/verify", {
              invoiceId: invoice._id,
              paymentId: data.paymentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            toast.success("Payment successful 🎉");
            window.location.reload();
          } catch (err) {
            toast.error("Payment verification failed");
          }
        }
      };

      new window.Razorpay(options).open();

    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };
  const navigate = useNavigate()
  return (
    <div className="min-h-screen p-4 sm:p-10 bg-gradient-to-br from-[#3a3734] via-[#4d4844] to-[#2b2a28]">
      <button
        onClick={() => navigate(-1)}
        className=" mb-6 px-4 py-2 rounded-xl text-sm sm:text-base text-[#f2edea] bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-95 transition shadow-lg " >
        Back
      </button>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#f2edea] mb-6">
        Payment History
      </h1>
      <div className="hidden sm:block">
        <table className="w-full text-left text-gray-200">
          <thead>
            <tr className="text-[#e7d8cb] border-b border-white/20">
              <th className="py-2">Date</th>
              <th className="py-2">Plan</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
              <th className="py-2">Pay</th>
              <th className="py-2">Invoice</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-400">
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-white/10 transition">
                  <td className="py-2">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td>{invoice.membershipId?.planId?.name || "—"}</td>
                  <td>₹{invoice.amount}</td>
                  <td
                    className={`font-semibold ${invoice.status === "PAID"
                        ? "text-green-400"
                        : "text-yellow-400"
                      }`}
                  >
                    {invoice.status}
                  </td>
                  <td>
                    {invoice.status === "PAID" ? (
                      <button
                        disabled
                        className="px-3 py-1 text-xs rounded-full
                      bg-gray-500/20 text-gray-400 cursor-not-allowed"
                      >
                        Paid
                      </button>
                    ) : (
                      <button
                        onClick={() => payInvoice(invoice)}
                        className="px-3 py-1 text-xs rounded-full
                      bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                  <td>*invoice*</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="sm:hidden space-y-4">
        {invoices.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No invoices found
          </p>
        ) : (
          invoices.map((invoice) => (
            <div
              key={invoice._id}
              className="p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md"
            >
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Date</span>
                <span className="text-gray-200">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Plan</span>
                <span className="text-gray-200">
                  {invoice.membershipId?.planId?.name || "—"}
                </span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Amount</span>
                <span className="text-gray-200">₹{invoice.amount}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span className="text-gray-400 text-sm">Status</span>
                <span
                  className={`font-semibold ${invoice.status === "PAID"
                      ? "text-green-400"
                      : "text-yellow-400"
                    }`}
                >
                  {invoice.status}
                </span>
              </div>

              {invoice.status === "PAID" ? (
                <button
                  disabled
                  className="w-full py-2 text-sm rounded-xl
                bg-gray-500/20 text-gray-400 cursor-not-allowed"
                >
                  Paid
                </button>
              ) : (
                <button
                  onClick={() => payInvoice(invoice)}
                  className="w-full py-2 text-sm rounded-xl
                bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                >
                  Pay Now
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

};

export default PaymentHistory;
