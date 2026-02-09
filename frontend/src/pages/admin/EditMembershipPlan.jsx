import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "../../services/axios";
import { toast } from "react-toastify";

const EditMembershipPlan = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [category, setCategory] = useState("Basic");
  const navigate = useNavigate();


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
        toast.error("Error fetching plan");
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

      toast.success("Plan Updated Successfully");
      navigate("/admin/viewPlan");
    } catch (err) {
      toast.error("Error updating plan");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center p-4">
      <div className="bg-[#181818] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">

        <div className="flex items-center mb-6">

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            Edit Membership Plan
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="col-span-1">
            <label className="text-sm text-gray-400">Plan Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 mt-1
                       text-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div className="col-span-1">
            <label className="text-sm text-gray-400">Duration (days)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 mt-1
                       text-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div className="col-span-1">
            <label className="text-sm text-gray-400">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 mt-1
                       text-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div className="col-span-1">
            <label className="text-sm text-gray-400">Category</label>
            <div className="relative mt-1">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2
                         text-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none appearance-none"
              >
                <option value="Basic">Basic</option>
                <option value="Trial">Trial</option>
                <option value="Premium">Premium</option>
                <option value="Seasonal">Seasonal</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </span>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="text-sm text-gray-400">Features</label>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              required
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 mt-1
                       text-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div className="col-span-1 sm:col-span-2 flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-orange-500"
            />
            <label className="text-gray-300 text-sm">Active</label>
          </div>
          <button type="submit" className=" col-span-1 sm:col-span-2 mt-4 w-full px-4 py-2 rounded-full text-sm font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30 hover:text-orange-300 transition " >
            Update Plan
          </button>
          <button type="button" onClick={() => navigate(-1)} className="col-span-1 sm:col-span-2 w-full px-4 py-2 rounded-full  text-sm font-semibold bg-red-500/20 text-red-400  border border-red-500/40 hover:bg-red-500/30  hover:text-red-300 transition" > Close
          </button>
        </form>
      </div>
    </div>
  );

};

export default EditMembershipPlan;
