import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8000/api/method/library_app.api.reservation.list_reservations',
          { withCredentials: true }
        );
        setReservations(res.data.message);
        console.log("Reservations fetched:", res.data.message);
      } catch (err) {
        toast.error("Failed to fetch reservations");
      }
    };

    if (isAuthenticated) {
      fetchReservations();
    }
  }, [isAuthenticated]);

  const filteredReservations = reservations.filter((reservation) =>
    reservation.book?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        🎟️ Your Reservations
      </h1>
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by book ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredReservations.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            No reservations found.
          </p>
        )}
        {filteredReservations.map((reservation) => (
          <div
            key={reservation.name}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              Book: {reservation.book}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Member: {reservation.member}
            </p>
            <p className="text-sm text-gray-500">
              Date: {reservation.reservation_date}
            </p>
            <p className="text-sm text-gray-400 italic">
              Notified: {reservation.notified ? "Yes" : "No"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
