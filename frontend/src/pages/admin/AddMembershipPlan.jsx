import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const AddMembershipPlan = () => {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [category, setCategory] = useState("Basic");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/admin/addplan", {
        name,
        durationInDays: Number(duration),
        price: Number(price),
        features,
        isActive,
        category,
      });

      alert("Plan Added Successfully");
      navigate("/admin/viewPlan");

    } catch (err) {
      console.error(err);
      alert("Error adding plan");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#121212] to-black flex items-center justify-center p-8">
      {/* Glass Container */}
      <div className="w-full max-w-3xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-10">
        
        <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
          Add Membership Plan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Plan Name */}
          <div>
            <label className="block text-gray-400 mb-1">Plan Name</label>
            <input
              type="text"
              placeholder="Plan Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 
                         text-gray-200 placeholder-gray-500 
                         focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Duration & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-400 mb-1">Duration (Days)</label>
              <input
                type="number"
                placeholder="Duration in Days"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 
                           text-gray-200 placeholder-gray-500 
                           focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Price (₹)</label>
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 
                           text-gray-200 placeholder-gray-500 
                           focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
  <label className="block text-gray-400 mb-1">Category</label>

  <div className="relative">
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="
        w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 
        text-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none
        appearance-none
      "
    >
      <option className="bg-[#1a1a1a] text-gray-200" value="Basic">Basic</option>
      <option className="bg-[#1a1a1a] text-gray-200" value="Trial">Trial</option>
      <option className="bg-[#1a1a1a] text-gray-200" value="Premium">Premium</option>
      <option className="bg-[#1a1a1a] text-gray-200" value="Seasonal">Seasonal</option>
    </select>

    {/* Custom dropdown arrow */}
    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      ▼
    </span>
  </div>
</div>

          {/* Features */}
          <div>
            <label className="block text-gray-400 mb-1">Features</label>
            <textarea
              placeholder="Features (comma separated)"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              required
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 h-28
                         text-gray-200 placeholder-gray-500 
                         focus:ring-2 focus:ring-orange-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 accent-orange-500"
            />
            <label className="text-gray-300 text-sm font-medium">Active</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full text-white py-3 rounded-full text-sm font-semibold transition 
                     bg-orange-500/20 hover:bg-orange-500/30 
                     border border-orange-400/40"
          >
            Add Plan
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddMembershipPlan;
