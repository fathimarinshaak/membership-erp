import { useEffect, useState } from "react";
import axios from "../../services/axios";
import { useParams, useNavigate } from "react-router";

const InvoicePreview = () => {
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [error, setError] = useState("");
    const { invoiceId, token } = useParams();

    const apiUrl = token
        ? `/api/member/invoice/${invoiceId}`
        : `/api/admin/invoice/${invoiceId}`;

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await axios.get(apiUrl);
                if (res.data.success) {
                    setInvoice(res.data.invoice);
                } else {
                    setError("Invoice not found");
                }
            } catch (err) {
                setError("Invoice not found");
            }
        };
        fetchInvoice();
    }, [invoiceId]);

    if (error)
        return (
            <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
        );

    if (!invoice)
        return <div className="p-6 text-center text-gray-500">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
            <div className="bg-white w-full max-w-md shadow-md rounded-lg p-6 relative">

                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-xl font-bold">Invoice</h1>
                    <div className="text-right text-gray-500 text-sm">
                        <p>{new Date(invoice.createdAt).toDateString()}</p>
                        <p>#{invoice.invoiceNumber}</p>
                    </div>
                </div>


                <div className="mb-4">
                    <p className="font-semibold">Billed To:</p>
                    <p>{invoice.memberId?.name || "-"}</p>
                    <p className="text-gray-500 text-sm">{invoice.memberId?.email || "-"}</p>
                </div>


                <div className="mb-4">
                    <div className="flex justify-between border-b border-gray-200 py-2 font-medium">
                        <span>Plan</span>
                        <span>Amount (₹)</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span>{invoice.membershipId?.planId?.name || "-"}</span>
                        <span>₹{invoice.amount}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 py-2 font-bold">
                        <span>Total</span>
                        <span>₹{invoice.amount}</span>
                    </div>
                </div>


                {invoice.status === "PAID" && (
                    <div className="text-sm text-gray-600 mb-4 flex justify-between items-start">
                        <div>
                            <p>
                                <span className="font-semibold">Paid On:</span>{" "}
                                {new Date(invoice.paidAt).toDateString()}
                            </p>
                            <p>
                                <span className="font-semibold">Payment Method:</span>{" "}
                                {invoice.paymentMethod}
                            </p>
                            {invoice.paymentMethod !== "CASH" && invoice.transactionId && (
                                <p>
                                    <span className="font-semibold">Transaction ID:</span>{" "}
                                    {invoice.transactionId}
                                </p>
                            )}
                        </div>


                        <div className="text-green-700 border-2 border-green-700 font-bold px-3 py-1 rotate-[-10deg] text-sm">
                            PAID
                        </div>
                    </div>
                )}


                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                    >
                        Back
                    </button>
                        <a
                            href={
                                token
                                    ? `/api/member/invoice/${invoice._id}/download`
                                    : `/api/admin/invoice/${invoice._id}/download`
                            }
                            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                        >

                            Download PDF
                        </a>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;