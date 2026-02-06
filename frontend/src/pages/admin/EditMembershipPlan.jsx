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
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#121212] to-black flex items-center justify-center p-8">
      {/* Glass Card */}
      <div className="w-full max-w-3xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-10">
        
        <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
          Edit Membership Plan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Plan Name */}
          <div>
            <label className="block text-gray-400 mb-1">Plan Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 
                         text-gray-200 placeholder-gray-500 
                         focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-400 mb-1">Duration (days)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 
                         text-gray-200 placeholder-gray-500 
                         focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-400 mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 
                         text-gray-200 placeholder-gray-500 
                         focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-400 mb-1">Category</label>

            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 
                           text-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none
                           appearance-none"
              >
                <option value="Basic" className="bg-[#1a1a1a] text-gray-200">Basic</option>
                <option value="Trial" className="bg-[#1a1a1a] text-gray-200">Trial</option>
                <option value="Premium" className="bg-[#1a1a1a] text-gray-200">Premium</option>
                <option value="Seasonal" className="bg-[#1a1a1a] text-gray-200">Seasonal</option>
              </select>

              {/* Custom arrow */}
              <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                ▼
              </span>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-gray-400 mb-1">Features</label>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              required
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 
                         text-gray-200 placeholder-gray-500 
                         focus:ring-2 focus:ring-orange-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-orange-500"
            />
            <label className="text-gray-300">Active</label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full text-white py-2 px-6 rounded-full text-sm font-semibold transition 
                       bg-orange-500/20 hover:bg-orange-500/30 
                       border border-orange-400/40"
          >
            Update Plan
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditMembershipPlan;
