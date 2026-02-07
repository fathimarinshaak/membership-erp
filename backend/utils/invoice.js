// backend/utils/invoiceTemplate.js

function generateInvoiceHTML(invoice, member, plan) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Invoice ${invoice.invoiceNumber}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; }
      h1 { color: #333; }
      .header { display: flex; justify-content: space-between; }
      .invoice-details { margin-top: 20px; }
      .invoice-details th, .invoice-details td { padding: 8px 12px; text-align: left; }
      .invoice-details th { background-color: #f4f4f4; }
      .total { margin-top: 20px; font-size: 18px; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Invoice</h1>
      <div>
        <p><strong>Invoice #: </strong>${invoice.invoiceNumber}</p>
        <p><strong>Date: </strong>${new Date(invoice.createdAt).toLocaleDateString()}</p>
      </div>
    </div>

    <div class="member">
      <h3>Member Details</h3>
      <p>Name: ${member.name}</p>
      <p>Email: ${member.email}</p>
      <p>Phone: ${member.phone}</p>
    </div>

    <table class="invoice-details" border="1" cellspacing="0" cellpadding="0">
      <thead>
        <tr>
          <th>Plan</th>
          <th>Duration (Days)</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${plan.name}</td>
          <td>${plan.durationInDays}</td>
          <td>₹${invoice.amount}</td>
        </tr>
      </tbody>
    </table>

    <p class="total">Total: ₹${invoice.amount}</p>
  </body>
  </html>
  `;
}

module.exports = generateInvoiceHTML;
