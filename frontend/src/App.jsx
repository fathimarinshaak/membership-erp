import { payNow } from "./pay";
import { BrowserRouter,Routes,Route } from "react-router";
import AddMember from "./pages/admin/addMember";
import ViewMember from "./pages/admin/ViewMembers";


export default function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/admin/addMember" element={<AddMember />} />
        <Route path="/admin/viewMember" element={<ViewMember />} />

      </Routes>
    </BrowserRouter>
    // <div className="container">
    //   <h1>Razorpay Payment</h1>
    //   <button onClick={payNow}>Razor Pay</button>
    //   <button>Cash Free</button>
    // </div>
  )
}
