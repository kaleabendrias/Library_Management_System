import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const isLibrarian = user?.roles?.includes("Librarian") || user?.roles?.includes("Admin");

  const linkClass = (path) =>
    `text-sm ${
      location.pathname === path ? "text-blue-600 underline font-bold" : "text-gray-700"
    } hover:text-blue-600`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-blue-700">
            📚 Library
          </Link>

          <div className="flex space-x-6 items-center">
            <Link to="/books" className={linkClass("/books")}>
              Books
            </Link>
            <Link to="/loans" className={linkClass("/loans")}>
              Loans
            </Link>
            <Link to="/reservations" className={linkClass("/reservations")}>
              Reservations
            </Link>

            {isLibrarian && (
              <>
                <Link to="/add-book" className={linkClass("/add-book")}>
                  + Add Book
                </Link>
                <Link to="/loan-approval" className={linkClass("/loan-approval")}>
                  Loan Approval
                </Link>
                <Link to="/members" className={linkClass("/members")}>
                  View Members
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="relative group">
                <button className="text-sm text-gray-800 font-medium">
                  {user.full_name}
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className={linkClass("/login")}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
