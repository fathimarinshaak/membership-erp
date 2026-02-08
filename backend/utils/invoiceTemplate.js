module.exports = (invoice) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Invoice</title>
<style>
  body { font-family: Arial, sans-serif; background:#f2f2f2; padding:40px; }
  .invoice { background:#fff; width:520px; margin:auto; padding:32px; border-radius:8px; position:relative; box-shadow:0 0 10px rgba(0,0,0,0.1);}
  .stamp { position:absolute; bottom:40px; right:20px; border:2px solid green; padding:6px 12px; font-weight:bold; transform:rotate(-12deg); color:green; font-size:12px; }
  .row { font-size:14px; margin-bottom:8px; }
  .label { font-weight:bold; }
  .divider { border-bottom:1px solid #ddd; margin:16px 0; }
  .total { text-align:right; font-size:16px; font-weight:bold; margin-top:12px; }
  .payment-details { margin-top:12px; font-size:13px; }
  .payment-details .row { margin-bottom:4px; }
</style>
</head>

<body>
<div class="invoice">

  ${invoice.status === "PAID" ? `<div class="stamp">PAID</div>` : ""}

  <h2 style="text-align:center; margin-bottom:4px;">INVOICE</h2>
  <p style="text-align:center;font-size:12px; margin-bottom:16px;">
  ${new Date(invoice.createdAt).toDateString()} <br />
  Invoice #: ${invoice.invoiceNumber || "-"}
</p>

  <!-- Member Info -->
  <div class="row"><span class="label">Billed To:</span> ${invoice.memberId?.name || "-"}</div>
  <div class="row"><span class="label">Email:</span> ${invoice.memberId?.email || "-"}</div>

  <div class="divider"></div>

  <!-- Plan / Charges -->
  <div class="row"><span class="label">Plan:</span> ${invoice.membershipId?.planId?.name || "-"}</div>
  <div class="row"><span class="label">Amount:</span> ₹${invoice.amount || 0}</div>
  <div class="total">Total: ₹${invoice.amount || 0}</div>

  ${invoice.status === "PAID" ? `
    <div class="divider"></div>
    <div class="payment-details">
      <div class="row"><span class="label">Paid On:</span> ${invoice.paidAt ? new Date(invoice.paidAt).toDateString() : "-"}</div>
      <div class="row"><span class="label">Payment Method:</span> ${invoice.paymentMethod || "-"}</div>
      ${invoice.paymentMethod !== "CASH" && invoice.transactionId ? `<div class="row"><span class="label">Transaction ID:</span> ${invoice.transactionId}</div>` : ""}
    </div>
  ` : ""}

</div>
</body>
</html>
`;