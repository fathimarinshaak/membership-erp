import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const ViewMembershipPlans = () => {
  const [plans, setPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [modalFeatures, setModalFeatures] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // Fetch plans
  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/viewplan");
      setPlans(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching plans");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Delete plan
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await axios.post(`http://localhost:3000/api/admin/deleteplan/${id}`);
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert("Error deleting plan");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/editPlan/${id}`);
  };

  const openModal = (features) => {
    setModalFeatures(features);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalFeatures("");
  };

  // Filter & Search
  const filteredPlans = plans
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.price.toString().includes(searchTerm) ||
      p.durationInDays.toString().includes(searchTerm)
    )
    .filter((p) =>
      filterStatus === "all"
        ? true
        : filterStatus === "active"
        ? p.isActive
        : !p.isActive
    )
    .filter((p) =>
      filterCategory === "all" ? true : p.category === filterCategory
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Membership Plans</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Categories</option>
          <option value="Basic">Basic</option>
          <option value="Trial">Trial</option>
          <option value="Premium">Premium</option>
          <option value="Seasonal">Seasonal</option>
        </select>

        <button
          onClick={() => navigate("/admin/addPlan")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Plan
        </button>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border border-gray-300 bg-white rounded-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Duration</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Features</th>
              <th className="border px-4 py-2">Active</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No plans found
                </td>
              </tr>
            ) : (
              filteredPlans.map((plan, index) => (
                <tr key={plan._id} className="text-center">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{plan.name}</td>
                  <td className="border px-4 py-2">{plan.durationInDays} days</td>
                  <td className="border px-4 py-2">{plan.price}</td>
                  <td className="border px-4 py-2">{plan.category}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => openModal(plan.features)}
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition"
                    >
                      View
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded font-semibold ${
                        plan.isActive
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {plan.isActive ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(plan._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-blue-500 px-6 py-3">
              <h3 className="text-white text-lg font-bold">Plan Features</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700">{modalFeatures}</p>
            </div>
            <div className="px-6 py-4 bg-gray-100 text-right">
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
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