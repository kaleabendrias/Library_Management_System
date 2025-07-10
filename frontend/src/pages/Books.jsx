import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, user } = useAuthStore();
  

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/method/library_app.api.book.list_books",
          { withCredentials: true }
        );
        setBooks(res.data.message || res.data);
      } catch (err) {
        toast.error("Failed to fetch books");
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      payload.append("member", user.email); // or user.name if that's the actual ID
      payload.append("loan_date", loanDate);
      payload.append("return_date", returnDate);

      await axios.post(
        "http://localhost:8000/api/method/library_app.api.loan.create_loan",
        payload,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: true,
        }
      );

      toast.success("Book rented successfully!");
    } catch (err) {
      console.log("err: ", err);
      const serverMessages = err.response?.data?._server_messages;
      const msg =
        err.response?.data?.message ||
        err.response?.data?._server_messages ||
        "Renting failed";
      const messagesArray = JSON.parse(serverMessages);
      const firstMessageObj = JSON.parse(messagesArray[0]);
      toast.error(firstMessageObj.message || msg);
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

            <button
              onClick={() => handleRent(book.name)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition"
            >
              Rent this Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
