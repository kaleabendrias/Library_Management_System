import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  // Check if user is librarian or admin
  const isLibrarianOrAdmin = user?.roles?.some(
    (role) => role === "Librarian" || role === "Admin"
  );

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8000/api/method/library_app.api.loan.list_loans",
        { withCredentials: true }
      );
      setLoans(res.data.message || res.data);
    } catch (err) {
      toast.error("Failed to fetch loans");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleReturn = async (loanId) => {
    try {
      await axios.post(
        "http://localhost:8000/api/method/library_app.api.loan.return_loan",
        new URLSearchParams({ loan_id: loanId }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );
      toast.success("Book returned successfully!");
      fetchLoans(); // Refresh list after return
    } catch (err) {
      toast.error("Failed to return book");
    }
  };

  const filteredLoans = loans
  .filter((loan) => loan.status === "Approved")
  .filter((loan) =>
    loan.book.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        🧾 All Book Loans
      </h1>

      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by book title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading loans...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-left text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3">Book</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Loan Date</th>
                <th className="px-4 py-3">Return Date</th>
                <th className="px-4 py-3">Returned</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center px-4 py-6 text-gray-500"
                  >
                    No loans found.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.name} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{loan.book}</td>
                    <td className="px-4 py-3">{loan.member}</td>
                    <td className="px-4 py-3">{loan.loan_date}</td>
                    <td className="px-4 py-3">{loan.return_date}</td>
                    <td className="px-4 py-3">
                      {loan.returned ? (
                        <span className="text-green-600 font-semibold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{loan.status}</td>
                    {isLibrarianOrAdmin && (
                      <td className="px-4 py-3">
                        {!loan.returned && (
                          <button
                            onClick={() => handleReturn(loan.name)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                          >
                            Return Book
                          </button>
                        )}
                      </td>
                    )}
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
