import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/method/library_app.api.book.list_books",
          { withCredentials: true }
        );
        console.log(res.data.message)
        setBooks(res.data.message || res.data);
      } catch (err) {
        toast.error("Failed to fetch books");
      }
    };

    const fetchLoans = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/resource/Loan?filters=[[\"returned\",\"=\",0]]",
          { withCredentials: true }
        );
        setActiveLoans(res.data.data);
      } catch (err) {
        console.log("Failed to fetch active loans");
      }
    };

    fetchBooks();
    fetchLoans();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isBookRented = (bookId) =>
    activeLoans.some((loan) => loan.book === bookId);

  const handleRent = async (bookId) => {
  if (!isAuthenticated) {
    toast.error("Please log in to rent a book");
    return;
  }

  try {
    const loanDate = new Date().toISOString().slice(0, 10);
    const returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const payload = new URLSearchParams();
    payload.append("book", bookId);
    payload.append("member", user.email);
    payload.append("loan_date", loanDate);
    payload.append("return_date", returnDate);

    await axios.post(
      "http://localhost:8000/api/method/library_app.api.loan.create_loan",
      payload,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      }
    );

    toast.success("Book rented successfully!");
  } catch (err) {
    const serverMessages = err.response?.data?._server_messages;
    let msg =
      err.response?.data?.message || err.response?.data?.error || "Renting failed";
    if (serverMessages) {
      try {
        const messagesArray = JSON.parse(serverMessages);
        const firstMessageObj = JSON.parse(messagesArray[0]);
        msg = firstMessageObj.message;
      } catch (parseError) {}
    }

    if (msg.includes("Book is already on loan")) {
      if (window.confirm("Book is already on loan. Reserve it instead?")) {
        handleReserve(bookId);
      }
    } else {
      toast.error(msg);
    }
  }
};

  const handleReserve = async (bookId) => {
    if (!isAuthenticated) {
      toast.error("Please log in to reserve a book");
      return;
    }

    try {
      const payload = new URLSearchParams();
      payload.append("book", bookId);
      payload.append("member", user.email);
      payload.append("reservation_date", new Date().toISOString().slice(0, 10));

      await axios.post(
        "http://localhost:8000/api/method/library_app.api.reservation.create_reservation",
        payload,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );

      toast.success("Reservation created successfully!");
    } catch (err) {
      console.log("Reserve error: ", err);
      const msg = err.response?.data?.message || err.response?.data?.error || "Reservation failed";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        📚 Available Books
      </h1>
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            No books available.
          </p>
        )}
        {filteredBooks.map((book) => (
          <div
            key={book.name}
            className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              {book.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">By: {book.author}</p>
            <p className="text-sm text-gray-500">
              Published: {book.publish_date}
            </p>
            <p className="text-sm text-gray-400 italic">ISBN: {book.isbn}</p>

            {isBookRented(book.name) ? (
              <button
                onClick={() => handleReserve(book.name)}
                className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded text-sm font-medium transition"
              >
                Reserve This Book
              </button>
            ) : (
              <button
                onClick={() => handleRent(book.name)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition"
              >
                Rent this Book
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
