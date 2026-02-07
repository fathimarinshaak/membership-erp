import { useEffect, useState } from "react";
import axios from "../../services/axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const buildAccessLink = (member) => {
  if (!member?.secretToken) return "";
  return `${import.meta.env.VITE_FRONTEND_URL}/member/access/${member.secretToken}`;
};

export default function ViewMember() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPlanHistoryOpen, setIsPlanHistoryOpen] = useState(false);
  const [planHistory, setPlanHistory] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ACTIVE, INACTIVE
const [planFilter, setPlanFilter] = useState("ALL"); // ALL, ACTIVE, EXPIRED


  const sendAccessLink = async () => {
    try {
      const res = await axios.post(
        `/api/admin/member/send-link/${selectedMember._id}`
      );

      if (res.data.success) {
        toast.success("Access link sent to member email")
      } else {
        toast.error("Failed to send link")
      }
    } catch (err) {
      toast.error("Error sending access link")
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
        toast.info("New access link generated")
      } else {
        toast.error("Failed to regenerate link")
      }
    } catch (err) {
      toast.error("Error regenerating access link")
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
        toast.error("Error fetching members:");
      }
    };
    fetchMembers();
  }, []);

  // ⭐ FETCH MEMBERSHIP PLANS WHEN OPENING PLAN MODAL
  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/viewplan");
      setPlans(res.data.filter(plan => plan.isActive));
    } catch (err) {
      toast.error("Error fetching plans");
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
    toast.info(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p>Are you sure you want to delete this member?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  const res = await axios.post(
                    `/api/admin/deleteMember/${id}`
                  );

                  if (res.data.success) {
                    setMembers((prev) =>
                      prev.filter((m) => m._id !== id)
                    );
                    closeModal();
                    toast.success("Member deleted successfully");
                  } else {
                    toast.error("Member not deleted");
                  }
                } catch {
                  toast.error("Error deleting member");
                }
                closeToast();
              }}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>

            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
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
        toast.success("Member updated successfully")
      } else {
        toast.error("Update failed")
      }
    } catch (err) {
      toast.error("Error updating member")
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

  const hasActivePlan = (member) => {
    if (!member?.latestPlan?.expiresAt) return false;
    return new Date(member.latestPlan.expiresAt) > new Date();
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
            expiresAt: new Date(Date.now() + selectedPlan.durationInDays * 24 * 60 * 60 * 1000)
          }
        });

        setIsPlanModalOpen(false);
        setSelectedPlan(null);
        toast.success("Plan added successfully!")
      } else {
        toast.error("plan adding failed!!")
      }
    } catch (err) {
      toast.error("Error assigning plan");
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
      toast.error("Error loading plan history");
    }
  };



  const filteredMembers = members.filter((member) => {
  // Search filter
  const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        member.phone.includes(searchQuery);

  // Status filter
  const matchesStatus = statusFilter === "ALL" || member.status === statusFilter;

  // Plan filter
  const matchesPlan = planFilter === "ALL" || 
                      (planFilter === "ACTIVE" && hasActivePlan(member)) ||
                      (planFilter === "EXPIRED" && !hasActivePlan(member));

  return matchesSearch && matchesStatus && matchesPlan;
});

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#121212] to-black text-gray-200 p-8">
     <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-gray-100">
    Members Dashboard
  </h1>

  <button
    type="submit"
    onClick={() => navigate("/admin/addMember")}
    className="self-start sm:self-auto
      text-white py-2.5 px-6 rounded-full text-sm font-semibold transition
      bg-orange-500/20 hover:bg-orange-500/30
      border border-orange-400/40"
  >
    Add Member
  </button>
</div>


      {/* TABLE */}
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
  {/* Mobile horizontal scroll only when needed */}
  <div className="w-full overflow-x-auto">



    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  {/* Search */}
  <input
    type="text"
    placeholder="Search by name, email, phone..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full sm:w-64 px-4 py-2 rounded-xl bg-black/20 border border-white/10 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />



</div>

    <table className="min-w-full table-fixed">
      <thead className="bg-white/5">
        <tr className="text-left text-gray-400 text-xs sm:text-sm uppercase">
          <th className="px-4 sm:px-6 py-4 w-12">Sl No</th>
          <th className="px-4 sm:px-6 py-4">Name</th>

          {/* Hide on mobile */}
          <th className=" md:table-cell px-6 py-4">Email</th>
          <th className=" lg:table-cell px-6 py-4">Phone</th>
          <th className=" lg:table-cell px-6 py-4">WhatsApp</th>
          <th className=" md:table-cell px-6 py-4">Plan Expiry</th>

          <th className="px-4 sm:px-6 py-4">Status</th>
          <th className="px-4 sm:px-6 py-4 text-right w-32">Actions</th>
        </tr>
      </thead>

      <tbody>
       {filteredMembers.length === 0 ? (
  <tr>
    <td colSpan="8" className="text-center py-10 text-gray-500">
      No members found
    </td>
  </tr>
) : (
  filteredMembers.map((member, index) => (
  

            <tr
              key={member._id}
              className="border-t border-white/5 hover:bg-white/5 transition"
            >
              <td className="px-4 sm:px-6 py-4 text-gray-400">
                {index + 1}
              </td>

              <td className="px-4 sm:px-6 py-4 font-medium truncate max-w-[180px]">
                {member.name}
              </td>

              {/* Hidden on mobile */}
              <td className=" md:table-cell px-6 py-4 text-gray-400 truncate max-w-[220px]">
                {member.email}
              </td>

              <td className=" lg:table-cell px-6 py-4">
                {member.phone}
              </td>

              <td className=" lg:table-cell px-6 py-4">
                {member.whatsappNumber}
              </td>

              <td className=" md:table-cell px-6 py-4 text-sm">
                {member.latestPlan?.expiresAt ? (
                  <span
                    className={
                      new Date(member.latestPlan.expiresAt) < new Date()
                        ? "text-red-400"
                        : "text-green-400"
                    }
                  >
                    {new Date(
                      member.latestPlan.expiresAt
                    ).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-gray-600">—</span>
                )}
              </td>

              <td className="px-4 sm:px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    member.status === "ACTIVE"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {member.status}
                </span>
              </td>

              <td className="px-4 sm:px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3 whitespace-nowrap">
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
</div>

      {/* VIEW MODAL */}
      {/* VIEW MODAL */}
{/* VIEW MODAL */}
{/* VIEW MODAL */}
{isModalOpen && selectedMember && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur p-4"
    onClick={(e) => e.target === e.currentTarget && closeModal()}
  >
    <div className="bg-[#181818] border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl md:max-w-2xl overflow-hidden">

      {/* Scrollable content area */}
      <div className="p-6 max-h-[90vh] overflow-y-auto">

        {/* Header with Back Arrow */}
        <div className="flex items-center mb-4">
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-200 text-2xl mr-3"
          >
            ←
          </button>
          
        </div>
<h2 className="text-2xl font-bold">{selectedMember.name}</h2>
        {/* Member Info */}
        <div className="space-y-2 text-gray-400 mb-4">
          <p>Email: {selectedMember.email}</p>
          <p>Phone: {selectedMember.phone}</p>
          <p>WhatsApp: {selectedMember.whatsappNumber}</p>
          <p>Status: {selectedMember.status}</p>
        </div>

        {/* Personal Trainer */}
        <div className="mt-4 border-t border-white/10 pt-4">
          <h3 className="font-semibold mb-2">Personal Trainer</h3>
          <p>
            {selectedMember.personalTrainer?.name || "-"} |{" "}
            {selectedMember.personalTrainer?.phone || "-"}
          </p>
        </div>

        {/* Current Plan */}
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

        {/* Access Link */}
        <div className="mt-4 border-t border-white/10 pt-4">
          <h3 className="font-semibold mb-2 text-gray-200">Member Access Link</h3>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <input
              type="text"
              readOnly
              value={buildAccessLink(selectedMember)}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-400 break-all"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(buildAccessLink(selectedMember));
                toast.success("Access link copied to clipboard 📋");
              }}
              className="px-3 py-2 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 mt-2 sm:mt-0"
            >
              Copy
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Expires at:{" "}
            {selectedMember.expiresAt
              ? new Date(selectedMember.expiresAt).toLocaleString()
              : "Not generated"}
          </p>
        </div>

        {/* Action Buttons Row - Two Rows on Mobile */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6">
  <button
    onClick={sendAccessLink}
    className="w-full px-3 py-2.5 rounded-full text-sm font-semibold
      bg-green-500/15 text-green-400
      border border-green-500/30
      hover:bg-green-500/25 transition"
  >
    Send Link
  </button>

  <button
    onClick={regenerateAccessLink}
    className="w-full px-3 py-2.5 rounded-full text-sm font-semibold
      bg-orange-500/15 text-orange-400
      border border-orange-500/30
      hover:bg-orange-500/25 transition"
  >
    Regenerate Link
  </button>

  <button
    onClick={openPlanModal}
    disabled={hasActivePlan(selectedMember)}
    className={`w-full px-3 py-2.5 rounded-full text-sm font-semibold transition
      ${hasActivePlan(selectedMember)
        ? "bg-gray-500/10 text-gray-500 border border-gray-500/20 cursor-not-allowed"
        : "bg-orange-500/15 text-orange-400 border border-orange-500/30 hover:bg-orange-500/25 hover:text-orange-300"
      }`}
  >
    Add Plan
  </button>

  <button
    onClick={() => openPlanHistory(selectedMember._id)}
    className="w-full px-3 py-2.5 rounded-full text-sm font-semibold
      bg-blue-500/15 text-blue-400
      border border-blue-500/30
      hover:bg-blue-500/25 hover:text-blue-300 transition"
  >
    All Plans
  </button>

  <button
    onClick={() =>
      navigate(`/admin/members/${selectedMember._id}/invoices`)
    }
    className="w-full px-3 py-2.5 rounded-full text-sm font-semibold
      bg-blue-500/15 text-blue-400
      border border-blue-500/30
      hover:bg-blue-500/25 hover:text-blue-300 transition"
  >
    Invoices
  </button>
</div>



      </div>
    </div>
  </div>
)}

 {/* <-- Closing the conditional */}


      {/* ⭐ ADD PLAN MODAL */}
     {isPlanModalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur p-4 sm:p-0"
    onClick={(e) => e.target === e.currentTarget && closePlanModal()}
  >
    <div className="bg-[#181818] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl p-4 sm:p-6">

      <h2 className="text-2xl font-bold mb-4 text-gray-100">
        Select Membership Plan
      </h2>

      <div className="space-y-3 max-h-72 sm:max-h-80 overflow-y-auto pr-2">
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

      <div className="flex flex-col sm:flex-row justify-end mt-6 space-y-2 sm:space-y-0 sm:space-x-3">

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
     {/* EDIT MODAL */}
{isEditModalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur p-4"
    onClick={(e) => e.target === e.currentTarget && closeEditModal()}
  >
    <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
      
      {/* Header with Back Arrow */}
      <div className="flex items-center mb-6">
        <button
          onClick={closeEditModal}
          className="mr-3 text-gray-400 hover:text-gray-200 transition text-xl"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold">Edit Member</h2>
      </div>

      <form onSubmit={handleEditSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="col-span-1 sm:col-span-2">
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

        {/* Save Changes Button styled like your Close button */}
        <button
          type="submit"
          className="
            col-span-1 sm:col-span-2
            px-4 py-2 rounded-full text-sm font-semibold
            bg-red-500/15 text-red-400
            border border-red-500/30
            hover:bg-red-500/25 hover:text-red-300
            transition mt-4 w-full
          "
        >
          Save Changes
        </button>
      </form>
    </div>
  </div>
)}




    {isPlanHistoryOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur p-4 sm:p-0"
    onClick={(e) => e.target === e.currentTarget && setIsPlanHistoryOpen(false)}
  >
    <div className="bg-[#181818] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl p-4 sm:p-6">

      <h2 className="text-2xl font-bold mb-4 text-gray-100">
        Plan History
      </h2>

      {planHistory.length === 0 ? (
        <p className="text-gray-400 text-center py-6">No plans assigned</p>
      ) : (
        <div className="space-y-4 max-h-72 sm:max-h-96 overflow-y-auto pr-2">
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

     <div className="mt-4 flex justify-center sm:justify-end">
  <button
    onClick={() => setIsPlanHistoryOpen(false)}
    className="w-full sm:w-auto px-4 py-2 rounded-full bg-red-500/20 border border-red-500/40 text-red-300"
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