import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

const EditMembershipPlan = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [category, setCategory] = useState("Basic");
  const navigate = useNavigate();

  // Fetch single plan
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/admin/viewplan");
        const plan = res.data.find((p) => p._id === id);
        if (plan) {
          setName(plan.name);
          setDuration(plan.durationInDays);
          setPrice(plan.price);
          setFeatures(plan.features);
          setIsActive(plan.isActive);
          setCategory(plan.category || "Basic");
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching plan");
      }
    };
    fetchPlan();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/api/admin/updateplan/${id}`, {
        name,
        durationInDays: Number(duration),
        price: Number(price),
        features,
        isActive,
        category,
      });
      alert("Plan Updated Successfully");
      navigate("/admin/viewPlan");
    } catch (err) {
      console.error(err);
      alert("Error updating plan");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Edit Membership Plan</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md max-w-lg"
      >
        <div className="mb-4">
          <label className="block mb-1 font-medium">Plan Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Duration (days)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Features</label>
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mr-2"
          />
          <label>Active</label>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Basic">Basic</option>
            <option value="Trial">Trial</option>
            <option value="Premium">Premium</option>
            <option value="Seasonal">Seasonal</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
        >
          Update Plan
        </button>
      </form>
    </div>
  );
};

export default EditMembershipPlan;