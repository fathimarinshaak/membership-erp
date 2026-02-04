export function loadRazorpay() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function payNow() {
  const loaded = await loadRazorpay();
  if (!loaded) return alert("Razorpay failed to load");

  const res = await fetch("http://localhost:3000/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 500 }),
  });

  const order = await res.json();

  if (!order.id) {
    alert("Order not created");
    return;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_API_KEY,   // Make sure this is KEY ID
    order_id: order.id,
    amount: order.amount,
    currency: "INR",
    name: "My App",
    handler: async (response) => {
      await fetch("http://localhost:3000/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response)
      });
      alert("Payment Successful");
    }
  };

  new window.Razorpay(options).open();
}

