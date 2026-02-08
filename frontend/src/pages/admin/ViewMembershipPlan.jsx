import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "../../services/axios";
import { toast } from "react-toastify";

const ViewMembershipPlans = () => {
  const [plans, setPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [modalFeatures, setModalFeatures] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/viewplan");
      setPlans(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching plans");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <span className="text-sm">Are you sure you want to delete this plan?</span>

          <div className="flex justify-end gap-2">
            <button
              onClick={closeToast}
              className="px-3 py-1 text-xs rounded bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                try {
                  await axios.post(`/api/admin/deleteplan/${id}`);
                  toast.success("Plan deleted successfully");
                  fetchPlans();
                } catch (err) {
                  console.error(err);
                  toast.error("Error deleting plan");
                }
                closeToast();
              }}
              className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  const handleEdit = (id) => navigate(`/admin/editPlan/${id}`);

  const openModal = (features) => {
    setModalFeatures(features);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalFeatures("");
    setShowModal(false);
  };

  const filteredPlans = plans
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.price.toString().includes(searchTerm) ||
      p.durationInDays.toString().includes(searchTerm)
    )
    .filter((p) =>
      filterStatus === "all" ? true : filterStatus === "active" ? p.isActive : !p.isActive
    )
    .filter((p) =>
      filterCategory === "all" ? true : p.category === filterCategory
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111] to-black p-8 text-gray-200">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 tracking-wide text-gray-100">
        Membership Plans
      </h2>

      <div className="mb-6 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-4">


        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
        w-full sm:w-64
        bg-white/5 border border-white/10
        px-4 py-2 rounded-xl
        text-white
        focus:outline-none focus:ring-2 focus:ring-blue-500/40
      "
          />

          {/* STATUS DROPDOWN */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="
        relative z-10 focus:z-20 pointer-events-auto
        w-full sm:w-44
        bg-gradient-to-b from-gray-900 to-black
        border border-white/10
        px-4 py-2 rounded-xl
        text-gray-200 shadow-inner
        focus:outline-none focus:ring-2 focus:ring-blue-500/40
        hover:bg-white/10 transition
      "
          >
            <option className="bg-black" value="all">All Status</option>
            <option className="bg-black" value="active">Active</option>
            <option className="bg-black" value="inactive">Inactive</option>
          </select>

          {/* CATEGORY DROPDOWN */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="
        relative z-10 focus:z-20 pointer-events-auto
        w-full sm:w-52
        bg-gradient-to-b from-gray-900 to-black
        border border-white/10
        px-4 py-2 rounded-xl
        text-gray-200 shadow-inner
        focus:outline-none focus:ring-2 focus:ring-blue-500/40
        hover:bg-white/10 transition
      "
          >
            <option className="bg-black" value="all">All Categories</option>
            <option className="bg-black" value="Basic">Basic</option>
            <option className="bg-black" value="Trial">Trial</option>
            <option className="bg-black" value="Premium">Premium</option>
            <option className="bg-black" value="Seasonal">Seasonal</option>
          </select>
        </div>

        <button
          onClick={() => navigate("/admin/addPlan")}
          className=" w-full sm:w-auto sm:ml-auto px-5 py-2.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 font-semibold hover:bg-orange-500/30 transition " >
          Add Plan
        </button>
      </div>

      <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/5 backdrop-blur">
        <table className="min-w-full">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-sm uppercase">
              <th className="px-6 py-4 text-left">Sl No</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Duration</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Active</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPlans.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No plans found
                </td>
              </tr>
            ) : (
              filteredPlans.map((plan, index) => (
                <tr key={plan._id} className="border-t border-white/5 hover:bg-white/10 transition">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">{plan.name}</td>
                  <td className="px-6 py-4">{plan.durationInDays} days</td>
                  <td className="px-6 py-4">₹{plan.price}</td>
                  <td className="px-6 py-4 text-gray-300">{plan.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${plan.isActive
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                    >
                      {plan.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-start gap-3">
                      <button
                        onClick={() => openModal(plan.features)}
                        className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(plan._id)}
                        className="px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(plan._id)}
                        className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50 p-4 sm:p-0">
          <div className="bg-[#181818] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-lg p-4 sm:p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Plan Features</h3>
            <p className="text-gray-300 whitespace-pre-line">{modalFeatures || "No features listed"}</p>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30 transition w-full sm:w-auto"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ViewMembershipPlans;
