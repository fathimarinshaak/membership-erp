import { payNow } from "./pay";
import{BrouserRouter,Routes,Route} from "react-router"
import login from "./pages/admin/login"



export default function App() {
  return (
    <div className="container">
      <h1>Razorpay Payment</h1>
      <button onClick={payNow}>Razor Pay</button>
      <button>Cash Free</button>
    </div>
  );
}
