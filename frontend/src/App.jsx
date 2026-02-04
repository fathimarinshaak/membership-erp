import { payNow } from "./pay";

export default function App() {
  return (
    <div className="container">
      <h1>Razorpay Payment</h1>
      <button onClick={payNow}>Razor Pay</button>
      <button>Cash Free</button>
    </div>
  );
}
