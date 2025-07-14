import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8000/api/method/library_app.api.member.list_members",
        { withCredentials: true }
      );
      setMembers(res.data.message || []);
      console.log("members: ", res.data.message)
    } catch (err) {
      toast.error("Failed to fetch members.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await axios.post(
        "http://localhost:8000/api/method/library_app.api.member.delete_member",
        new URLSearchParams({ member_id: memberId }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );
      toast.success("Member deleted successfully.");
      fetchMembers();
    } catch (err) {
      toast.error("Failed to delete member.");
    }
  };

  const filteredMembers = members.filter((member) =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        👥 Library Members
      </h1>

      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by member name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading members...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-left text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center px-4 py-6 text-gray-500">
                    No members found.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.name} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{member.full_name}</td>
                    <td className="px-4 py-3">{member.email || "-"}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(member.name)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
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
      )}
    </div>
  );
}
