import { useState } from "react";
import axios from "../../services/axios";

export default function AddMember() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    personalTrainerName: "",
    personalTrainerPhone: "",
    status: "ACTIVE",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const memberData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      whatsappNumber: form.whatsappNumber,
      personalTrainer: {
        name: form.personalTrainerName,
        phone: form.personalTrainerPhone,
      },
      status: form.status,
    };

    console.log("Submitting Member:", memberData);

    try {
      const res = await axios.post("/api/admin/addMember", memberData);
      console.log("Member saved:", res.data);
      alert("Member added successfully!");

      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        whatsappNumber: "",
        personalTrainerName: "",
        personalTrainerPhone: "",
        status: "ACTIVE",
      });
    } catch (err) {
      console.error("Error adding member:", err);
      alert("Failed to add member");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#121212] to-black flex items-center justify-center p-8">
      {/* Glass Container */}
      <div className="w-full max-w-3xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-10">
        <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
          Add New Member
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-400 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">WhatsApp Number</label>
              <input
                type="text"
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleChange}
                placeholder="WhatsApp number"
                required
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Personal Trainer Info */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">
              Personal Trainer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-400 mb-1">Trainer Name</label>
                <input
                  type="text"
                  name="personalTrainerName"
                  value={form.personalTrainerName}
                  onChange={handleChange}
                  placeholder="Trainer full name"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Trainer Phone</label>
                <input
                  type="text"
                  name="personalTrainerPhone"
                  value={form.personalTrainerPhone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-400 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
  type="submit"
  className="w-full text-white py-2 px-6 rounded-full text-sm font-semibold transition 
             bg-orange-500/20 hover:bg-orange-500/30 
             border border-orange-400/40"
>
  Add Member
</button>

        </form>
      </div>
    </div>
  );
}
