import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const isLibrarian = user?.roles?.includes("Librarian") || user?.roles?.includes("Admin");

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-blue-700">📚 Library</Link>

          <div className="flex space-x-6 items-center">
            <Link to="/books" className="text-sm text-gray-700 hover:text-blue-600">Books</Link>
            <Link to="/loans" className="text-sm text-gray-700 hover:text-blue-600">Loans</Link>
            <Link to="/reservations" className="text-sm text-gray-700 hover:text-blue-600">Reservations</Link>

            {isLibrarian && (
              <Link to="/add-book" className="text-sm text-gray-700 hover:text-blue-600">
                + Add Book
              </Link>
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
              <Link to="/login" className="text-sm text-blue-600 hover:underline">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
