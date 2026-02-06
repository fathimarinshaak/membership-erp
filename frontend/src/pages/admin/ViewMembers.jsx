import { useEffect, useState } from "react";
import axios from "../../services/axios";

export default function ViewMember() {
       console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    personalTrainerName: "",
    personalTrainerPhone: "",
    status: "ACTIVE",
  });

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

  const openModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMember(null);
    setIsModalOpen(false);
  };

  // Close modal if user clicks outside modal content
  const handleBackdropClick = (e) => {
    if (e.target.id === "modalBackdrop") {
      closeModal();
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm('are you sure you want to delete this member?')) return
    try {

      const res = await fetch(`http://localhost:3000/api/admin/deleteMember/${id}`, {
        method: "POST",
      })
      const data = await res.json()
      if (data.success) {
        setMembers(members.filter(member => member._id !== id))
        closeModal()
        alert('member deleted successfully')
      } else {
        alert(data.message || 'member not deleted')
      }
    } catch (error) {
      console.error("Error deleting member:", err);
      alert("Error deleting member");
    }
  }


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

  // Close edit modal
  const closeEditModal = () => setIsEditModalOpen(false);
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/admin/editMember/${selectedMember._id}`, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        whatsappNumber: editForm.whatsappNumber,
        personalTrainer: {
        name: editForm.personalTrainerName,
        phone: editForm.personalTrainerPhone,
        },
        status: editForm.status,
      });
      if (res.data.success) {
        setMembers(
          members.map((m) => (m._id === selectedMember._id ? res.data.member : m))
        );
        closeEditModal();
        alert("Member updated successfully!");
      } else {
        alert(res.data.message || "Failed to update member");
      }
    } catch (err) {
      console.error("Error editing member:", err);
      alert("Error updating member");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Members List</h1>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Phone</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">WhatsApp</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {members.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No members found
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member._id} className="hover:bg-gray-100 transition">
                  <td className="px-4 py-3">{member.name}</td>
                  <td className="px-4 py-3">{member.email}</td>
                  <td className="px-4 py-3">{member.phone}</td>
                  <td className="px-4 py-3">{member.whatsappNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${member.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700" }`} >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold" onClick={() => openModal(member)} > View </button>
                    <button className="text-blue-600 hover:text-blue-800 font-semibold" onClick={() => openEditModal(member)} > Edit </button>
                    <button className="text-blue-600 hover:text-blue-800 font-semibold" onClick={() => deleteMember(member._id)} > Delete </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedMember && (
        <div id="modalBackdrop" onClick={handleBackdropClick} className="fixed inset-0 z-50 flex items-center justify-center " >
          <div className="bg-white rounded-xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={closeModal} > ✕ </button>

            <h2 className="text-2xl font-bold mb-4">{selectedMember.name}</h2>

            <div className="mb-4">
              <p><strong>Email:</strong> {selectedMember.email}</p>
              <p><strong>Phone:</strong> {selectedMember.phone}</p>
              <p><strong>WhatsApp:</strong> {selectedMember.whatsappNumber}</p>
              <p><strong>Status:</strong> {selectedMember.status}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Personal Trainer</h3>
              <p><strong>Name:</strong> {selectedMember.personalTrainer?.name || "-"}</p>
              <p><strong>Phone:</strong> {selectedMember.personalTrainer?.phone || "-"}</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"> Add Plan </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {isEditModalOpen && (
        <div id="modalBackdrop" onClick={(e) => e.target.id === "modalBackdrop" && closeEditModal()} className="fixed inset-0 z-50 flex items-center justify-center " >
          <div className="bg-white rounded-xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={closeEditModal} > ✕ </button>

            <h2 className="text-2xl font-bold mb-4">Edit Member</h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-600 mb-1">Name</label>
                  <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-4 py-2" required />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Email</label>
                  <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-4 py-2" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-600 mb-1">Phone</label>
                  <input type="text" name="phone" value={editForm.phone} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-4 py-2" required />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">WhatsApp</label>
                  <input type="text" name="whatsappNumber" value={editForm.whatsappNumber} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-4 py-2" required />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Personal Trainer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-600 mb-1">Trainer Name</label>
                    <input type="text" name="personalTrainerName" value={editForm.personalTrainerName} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-4 py-2" />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1">Trainer Phone</label>
                    <input type="text" name="personalTrainerPhone" value={editForm.personalTrainerPhone} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-4 py-2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Status</label>
                <select name="status" value={editForm.status} onChange={handleEditChange} className="w-full border border-gray-300 rounded-xl px-4 py-2" >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}