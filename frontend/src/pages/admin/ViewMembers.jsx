import { useEffect, useState } from "react";

export default function ViewMember() {
  const [members, setMembers] = useState([]);

  // Fetch all members
  // useEffect(() => {
  //   const fetchMembers = async () => {
  //     try {
  //       const res = await fetch("http://localhost:5000/api/admin/members");
  //       const data = await res.json();
  //       setMembers(data);
  //     } catch (err) {
  //       console.error("Error fetching members:", err);
  //     }
  //   };

  //   fetchMembers();
  // }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Members List</h1>

        <div className="overflow-x-auto">

          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold border-b">Name</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold border-b">Email</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold border-b">Phone</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold border-b">WhatsApp</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold border-b">Status</th>
                <th className="px-4 py-3 border-b"></th>
              </tr>
            </thead>

            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{member.name}</td>
                    <td className="px-4 py-3">{member.email}</td>
                    <td className="px-4 py-3">{member.phone}</td>
                    <td className="px-4 py-3">{member.whatsappNumber}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold 
                        ${
                          member.status === "ACTIVE"
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
                        onClick={() => console.log("View:", member)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
