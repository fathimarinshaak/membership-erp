import { useEffect, useState } from "react";
import axios from "../../services/axios";
import { useNavigate } from "react-router";

const buildAccessLink = (member) => {
  if (!member?.secretToken) return "";
  return `${import.meta.env.VITE_FRONTEND_URL}/member/access/${member.secretToken}`;
};

export default function ViewMember() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ⭐ NEW STATES FOR PLAN SELECTION
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [isPlanHistoryOpen, setIsPlanHistoryOpen] = useState(false);
  const [planHistory, setPlanHistory] = useState([]);

  const sendAccessLink = async () => {
    try {
      const res = await axios.post(
        `/api/admin/member/send-link/${selectedMember._id}`
      );

      if (res.data.success) {
        alert("Access link sent to member email");
      } else {
        alert(res.data.message || "Failed to send link");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending access link");
    }
  };

  const regenerateAccessLink = async () => {
    try {
      const res = await axios.post(
        `/api/admin/member/regenerate-link/${selectedMember._id}`
      );

      if (res.data.success) {
        setSelectedMember(res.data.member);
        setMembers(
          members.map((m) =>
            m._id === res.data.member._id ? res.data.member : m
          )
        );
        alert("New access link generated");
      } else {
        alert(res.data.message || "Failed to regenerate link");
      }
    } catch (err) {
      console.error(err);
      alert("Error regenerating access link");
    }
  };

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    personalTrainerName: "",
    personalTrainerPhone: "",
    status: "ACTIVE",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get("/api/admin/viewMembers");
        setMembers(res.data);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };
    fetchMembers();
  }, []);

  // ⭐ FETCH MEMBERSHIP PLANS WHEN OPENING PLAN MODAL
  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/viewplan");
      setPlans(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching plans");
    }
  };

  const openModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMember(null);
    setIsModalOpen(false);
  };


  const deleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/deleteMember/${id}`,
        { method: "POST" }
      );
      const data = await res.json();
      if (data.success) {
        setMembers(members.filter((m) => m._id !== id));
        closeModal();
        alert("Member deleted successfully");
      } else {
        alert(data.message || "Member not deleted");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting member");
    }
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setEditForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      whatsappNumber: member.whatsappNumber,
      personalTrainerName: member.personalTrainer?.name || "",
      personalTrainerPhone: member.personalTrainer?.phone || "",
      status: member.status,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `/api/admin/editMember/${selectedMember._id}`,
        {
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          whatsappNumber: editForm.whatsappNumber,
          personalTrainer: {
            name: editForm.personalTrainerName,
            phone: editForm.personalTrainerPhone,
          },
          status: editForm.status,
        }
      );

      if (res.data.success) {
        setMembers(
          members.map((m) =>
            m._id === selectedMember._id ? res.data.member : m
          )
        );
        closeEditModal();
        alert("Member updated successfully");
      } else {
        alert(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating member");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  // ⭐ OPEN PLAN MODAL
  const openPlanModal = () => {
    fetchPlans();
    setIsPlanModalOpen(true);
  };

  const closePlanModal = () => {
    setSelectedPlan(null);
    setIsPlanModalOpen(false);
  };

  const confirmPlan = async () => {
    if (!selectedPlan || !selectedMember) return;

    try {
      const res = await axios.post(
        `/api/admin/assignPlan/${selectedMember._id}`,
        {
          planId: selectedPlan._id,
        }
      );

      if (res.data.success) {
        // Update member locally
        setMembers(
          members.map((m) =>
            m._id === selectedMember._id
              ? {
                ...m,
                latestPlan: {
                  ...selectedPlan,
                  assignedAt: new Date(),
                  expiresAt: new Date(Date.now() + selectedPlan.durationInDays * 86400000)
                }
              }
              : m
          )
        );

        setSelectedMember({
          ...selectedMember,
          latestPlan: {
            ...selectedPlan,
            assignedAt: new Date(),
            expiresAt: new Date(Date.now() + selectedPlan.durationInDays * 86400000)
          }
        });


        setSelectedMember({
          ...selectedMember,
          latestPlan: {
            ...selectedPlan,
            assignedAt: new Date(),
            expiresAt: new Date(Date.now() + selectedPlan.durationInDays * 24 * 60 * 60 * 1000)
          }
        });

        setIsPlanModalOpen(false);
        setSelectedPlan(null);
        alert("Plan added successfully!");
      } else {
        alert(res.data.message || "failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error assigning plan");
    }
  };

  const openPlanHistory = async (memberId) => {
    try {
      const res = await axios.get(`/api/admin/planHistory/${memberId}`);

      if (res.data.success) {
        setPlanHistory(res.data.history);
        setIsPlanHistoryOpen(true);
      }
    } catch (err) {
      console.error(err);
      alert("Error loading plan history");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#121212] to-black text-gray-200 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-wide text-gray-100">
          Members Dashboard
        </h1>

        <button
          type="submit"
          className="text-white py-2 px-6 rounded-full text-sm font-semibold transition
            bg-orange-500/20 hover:bg-orange-500/30
            border border-orange-400/40"
          onClick={() => navigate("/admin/addMember")}
        >
          Add Member
        </button>
      </div>

      {/* TABLE */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr className="text-left text-gray-400 text-sm uppercase">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">WhatsApp</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  No members found
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member._id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4 font-medium">{member.name}</td>
                  <td className="px-6 py-4 text-gray-400">{member.email}</td>
                  <td className="px-6 py-4">{member.phone}</td>
                  <td className="px-6 py-4">{member.whatsappNumber}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${member.status === "ACTIVE"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                        }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <div className="flex items-center justify-end gap-3">

                      <button
                        onClick={() => openModal(member)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(member)}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMember(member._id)}
                        className="text-red-400 hover:text-red-300"
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

      {/* VIEW MODAL */}
      {isModalOpen && selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 w-full max-w-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {selectedMember.name}
            </h2>

            <div className="space-y-2 text-gray-400">
              <p>Email: {selectedMember.email}</p>
              <p>Phone: {selectedMember.phone}</p>
              <p>WhatsApp: {selectedMember.whatsappNumber}</p>
              <p>Status: {selectedMember.status}</p>
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <h3 className="font-semibold mb-2">Personal Trainer</h3>
              <p>
                {selectedMember.personalTrainer?.name || "-"} |{" "}
                {selectedMember.personalTrainer?.phone || "-"}
              </p>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4">
              <h3 className="font-semibold mb-2">Current Plan</h3>

              {selectedMember.latestPlan ? (
                <div className="space-y-1 text-gray-300">
                  <p>{selectedMember.latestPlan.name}</p>
                  <p>{selectedMember.latestPlan.durationInDays} days</p>
                  <p>₹{selectedMember.latestPlan.price}</p>

                  <p className="text-xs text-gray-400">
                    Assigned: {new Date(selectedMember.latestPlan.assignedAt).toLocaleDateString()}
                  </p>

                  <p className="text-xs text-gray-400">
                    Expires: {new Date(selectedMember.latestPlan.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No plan assigned</p>
              )}
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <h3 className="font-semibold mb-2 text-gray-200">
                Member Access Link
              </h3>

              {/* Access Link Field */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  readOnly
                  value={buildAccessLink(selectedMember)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-400"
                />

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      buildAccessLink(selectedMember)
                    );
                    alert("Access link copied");
                  }}
                  className="px-3 py-2 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25"
                >
                  Copy
                </button>
              </div>

              {/* Expiry */}
              <p className="text-xs text-gray-500 mt-2">
                Expires at:{" "}
                {selectedMember.expiresAt
                  ? new Date(selectedMember.expiresAt).toLocaleString()
                  : "Not generated"}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={sendAccessLink}
                  className="px-4 py-2 rounded-full text-sm font-semibold
        bg-green-500/15 text-green-400
        border border-green-500/30
        hover:bg-green-500/25"
                >
                  Send Link
                </button>

                <button
                  onClick={regenerateAccessLink}
                  className="px-4 py-2 rounded-full text-sm font-semibold
        bg-orange-500/15 text-orange-400
        border border-orange-500/30
        hover:bg-orange-500/25"
                >
                  Regenerate Link
                </button>
              </div>
            </div>


            {/* CURRENT PLAN DISPLAY */}
            {/* {selectedMember.currentPlan && (
  <div className="mt-4 p-4 bg-green-600/10 border border-green-500/30 rounded-xl">
    <h3 className="text-lg font-bold text-green-400">Current Plan</h3>
    <p className="text-gray-300">{selectedMember.currentPlan.name}</p>
    <p className="text-gray-300">
      {selectedMember.currentPlan.durationInDays} days | ₹
      {selectedMember.currentPlan.price}
    </p>
  </div>
)} */}

            {/* BUTTONS */}
            <div className="flex justify-between mt-6">

              {/* Close Badge */}
              <button
                onClick={closeModal}
                className="
      px-4 py-2 rounded-full text-sm font-semibold
      bg-red-500/15 text-red-400
      border border-red-500/30
      hover:bg-red-500/25 hover:text-red-300
      transition
    "
              >
                Close
              </button>

              {/* Add Plan Badge */}
              <button
                onClick={openPlanModal}
                className="
      px-4 py-2 rounded-full text-sm font-semibold
      bg-orange-500/15 text-orange-400
      border border-orange-500/30
      hover:bg-orange-500/25 hover:text-orange-300
      transition
    "
              >
                Add Plan
              </button>
              <button
                onClick={() => openPlanHistory(selectedMember._id)}
                className="
    px-4 py-2 rounded-full text-sm font-semibold
    bg-blue-500/15 text-blue-400
    border border-blue-500/30
    hover:bg-blue-500/25 hover:text-blue-300
    transition
  "
              >
                My Plans
              </button>

            </div>


          </div>
        </div>
      )}

      {/* ⭐ ADD PLAN MODAL */}
      {isPlanModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
          onClick={(e) => e.target === e.currentTarget && closePlanModal()}
        >
          <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl">

            <h2 className="text-2xl font-bold mb-4 text-gray-100">
              Select Membership Plan
            </h2>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-4 rounded-xl border cursor-pointer transition 
                    ${selectedPlan?._id === plan._id
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                >
                  <h3 className="text-lg font-semibold text-gray-200">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {plan.durationInDays} days | ₹{plan.price}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Category: {plan.category}
                  </p>
                </div>
              ))}
            </div>

            {/* Selected Plan Preview */}
            {selectedPlan && (
              <div className="mt-4 p-4 bg-blue-600/10 border border-blue-500/30 rounded-xl">
                <h3 className="text-lg font-bold text-blue-400">Selected Plan</h3>
                <p className="text-gray-300">{selectedPlan.name}</p>
                <p className="text-gray-300">
                  {selectedPlan.durationInDays} days | ₹{selectedPlan.price}
                </p>
              </div>
            )}

            <div className="flex justify-end mt-6 space-x-3">

              {/* Close Badge */}
              <button
                onClick={closePlanModal}
                className="
      px-4 py-2 rounded-full text-sm font-semibold
      bg-red-500/15 text-red-400
      border border-red-500/30
      hover:bg-red-500/25 hover:text-red-300
      transition
    "
              >
                Close
              </button>

              {/* Confirm Plan Badge */}
              <button
                onClick={confirmPlan}
                disabled={!selectedPlan}
                className={`
      px-4 py-2 rounded-full text-sm font-semibold
      border transition
      ${selectedPlan
                    ? "bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/25 hover:text-green-300"
                    : "bg-gray-500/10 text-gray-500 border-gray-500/20 cursor-not-allowed"
                  }
    `}
              >
                Confirm Plan
              </button>

            </div>

          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
          onClick={(e) => e.target === e.currentTarget && closeEditModal()}
        >
          <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Edit Member</h2>

            <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4">
              {[
                ["name", "Name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["whatsappNumber", "WhatsApp"],
                ["personalTrainerName", "Trainer Name"],
                ["personalTrainerPhone", "Trainer Phone"],
              ].map(([key, label]) => (
                <div key={key} className="col-span-1">
                  <label className="text-sm text-gray-400">{label}</label>
                  <input
                    name={key}
                    value={editForm[key]}
                    onChange={handleEditChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 mt-1"
                  />
                </div>
              ))}

              <div className="col-span-2">
                <label className="text-sm text-gray-400">Status</label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 mt-1"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <button className="col-span-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl mt-4">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}



      {isPlanHistoryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
          onClick={(e) => e.target === e.currentTarget && setIsPlanHistoryOpen(false)}
        >
          <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">
              Plan History
            </h2>

            {planHistory.length === 0 ? (
              <p className="text-gray-400 text-center py-6">No plans assigned</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {planHistory.map((item) => (
                  <div
                    key={item._id}
                    className="p-4 rounded-xl border border-white/10 bg-white/5"
                  >
                    <h3 className="text-lg font-semibold text-gray-200">
                      {item.planId.name}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      {item.planId.durationInDays} days | ₹{item.planId.price}
                    </p>

                    <p className="text-xs text-gray-500">
                      Start: {new Date(item.startDate).toLocaleDateString()}
                    </p>

                    <p className="text-xs text-gray-500">
                      End: {new Date(item.endDate).toLocaleDateString()}
                    </p>

                    <p className="text-xs mt-1 text-blue-400">
                      Status: {item.status}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="text-right mt-4">
              <button
                onClick={() => setIsPlanHistoryOpen(false)}
                className="px-4 py-2 rounded-full bg-red-500/20 border border-red-500/40 text-red-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}