import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoanApprovalPanel() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8000/api/method/library_app.api.loan.list_pending_loans",
        { withCredentials: true }
      );
      setLoans(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch pending loans");
    } finally {
      setLoading(false);
    }
  };

  const handleLoanAction = async (loanId, status) => {
    try {
      await axios.post(
        "http://localhost:8000/api/method/library_app.api.loan.update_loan_status",
        { loan_id: loanId, status },
        { withCredentials: true }
      );
      toast.success(`Loan ${status.toLowerCase()} successfully`);
      fetchLoans();
    } catch (error) {
      toast.error("Failed to update loan status");
    }
  };

  const filteredLoans = loans.filter(
    (loan) =>
      loan.book?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.member?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        📚 Pending Loan Approvals
      </h1>

      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by book ID or member..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : filteredLoans.length === 0 ? (
        <p className="text-center text-gray-500">No matching loan requests.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoans.map((loan) => (
            <div
              key={loan.name}
              className="bg-white rounded-lg shadow p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Book ID: {loan.book}
                </h2>
                <p className="text-sm text-gray-600">Member: {loan.member}</p>
                <p className="text-sm text-blue-500 font-medium mt-2">
                  Status: {loan.status}
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleLoanAction(loan.name, "Approved")}
                  className="flex-1 bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleLoanAction(loan.name, "Rejected")}
                  className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
