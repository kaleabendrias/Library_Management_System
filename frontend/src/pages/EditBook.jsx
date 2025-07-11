import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function EditBook() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publish_date: "",
    isbn: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/method/library_app.api.book.get_book?book_id=${bookId}`,
          { withCredentials: true }
        );
        console.log("res: ", res.data);
        setFormData({
          title: res.data.message.title,
          author: res.data.message.author,
          publish_date: res.data.message.publish_date,
          isbn: res.data.message.isbn,
        });
      } catch (err) {
        console.log(err)
        toast.error("Failed to fetch book details");
      }
    };

    if (isAuthenticated) {
      fetchBook();
    }
  }, [bookId, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = new URLSearchParams(formData);
      payload.append("book_id", bookId);
      await axios.post(
        "http://localhost:8000/api/method/library_app.api.book.update_book",
        payload,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );
      toast.success("Book updated successfully!");
      navigate("/books");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update book");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        ✏️ Edit Book
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
          {isLoading ? "Updating..." : "Update Book"}
        </button>
      </form>
    </div>
  );
}
