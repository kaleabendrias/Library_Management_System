import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function AddBook() {
  const { isAuthenticated, user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publish_date: "",
    isbn: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in as Librarian or Admin to add a book.");
      return;
    }
    setIsLoading(true);

    try {
      const payload = new URLSearchParams(formData);
      await axios.post(
        "http://localhost:8000/api/method/library_app.api.book.create_book",
        payload,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );
      toast.success("Book added successfully!");
      navigate("/books");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to add book";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        ➕ Add a New Book
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-6"
      >
        {[
          { label: "Title", name: "title", type: "text" },
          { label: "Author", name: "author", type: "text" },
          { label: "Publish Date", name: "publish_date", type: "date" },
          { label: "ISBN", name: "isbn", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              name={name}
              type={type}
              required
              value={formData[name]}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded text-white bg-blue-600 hover:bg-blue-700 font-medium transition ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}
