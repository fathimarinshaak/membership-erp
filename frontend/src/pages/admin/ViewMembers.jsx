import { useEffect, useState } from "react";

export default function ViewMember() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/viewMembers");
        const data = await res.json();
        setMembers(data);
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
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${member.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                      onClick={() => openModal(member)}
                    >
                      View
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 font-semibold"

                    >
                      Edit
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                      onClick={() => deleteMember(member._id)}
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
      {isModalOpen && selectedMember && (
        <div
          id="modalBackdrop"
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center "
        >
          <div className="bg-white rounded-xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              ✕
            </button>

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
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Add Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
