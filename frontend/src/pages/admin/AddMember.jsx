import { useState } from "react";
import axios from "../../services/axios";

export default  function AddMember() {
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

  const  handleSubmit = async(e) => {
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
    // TODO: axios.post("/api/members", memberData)
  

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Add New Member
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="john@example.com"
                required
              />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-gray-600 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Phone number"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">WhatsApp Number</label>
              <input
                type="text"
                name="whatsappNumber"
                value={form.whatsappNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="WhatsApp number"
                required
              />
            </div>

          </div>

          {/* Personal Trainer Info */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Personal Trainer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-gray-600 mb-1">Trainer Name</label>
                <input
                  type="text"
                  name="personalTrainerName"
                  value={form.personalTrainerName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Trainer full name"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Trainer Phone</label>
                <input
                  type="text"
                  name="personalTrainerPhone"
                  value={form.personalTrainerPhone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Phone number"
                />
              </div>

            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
            Add Member
          </button>
        </form>
      </div>
    </div>
  );
}
