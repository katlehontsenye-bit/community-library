
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Books() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadBooks() {
    setLoading(true);

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setMessage("Could not load books: " + error.message);
    } else {
      setBooks(data || []);
      setMessage("");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadBooks();
  }, []);

  function clearForm() {
    setTitle("");
    setAuthor("");
    setGenre("");
    setIsbn("");
    setQuantity("");
    setEditingId(null);
  }

  async function saveBook(e) {
    e.preventDefault();

    if (
      !title.trim() ||
      !author.trim() ||
      !genre.trim() ||
      !isbn.trim() ||
      quantity === "" ||
      Number(quantity) < 0 ||
      !Number.isInteger(Number(quantity))
    ) {
      alert("Please complete all fields and enter a valid quantity.");
      return;
    }

    setSaving(true);
    setMessage("");

    const bookData = {
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      isbn: isbn.trim(),
      quantity: Number(quantity)
    };

    const result = editingId
      ? await supabase
          .from("books")
          .update(bookData)
          .eq("id", editingId)
          .select()
      : await supabase
          .from("books")
          .insert([bookData])
          .select();

    if (result.error) {
      setMessage("Could not save book: " + result.error.message);
    } else {
      clearForm();
      await loadBooks();
      setMessage(editingId ? "Book updated successfully." : "Book added successfully.");
    }

    setSaving(false);
  }

  function startEdit(book) {
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre || "");
    setIsbn(book.isbn || "");
    setQuantity(String(book.quantity));
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteBook(id) {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    setMessage("");

    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage("Could not delete book: " + error.message);
      return;
    }

    if (editingId === id) clearForm();
    await loadBooks();
    setMessage("Book deleted successfully.");
  }

  return (
    <div className="library-page">
      <div className="page-heading">
        <div>
          <h1>Book Management</h1>
          <p>Manage the books in your library.</p>
        </div>
        <div className="page-icon">📚</div>
      </div>

      <div className="form-card">
        <h2>{editingId ? "Update Book" : "Add New Book"}</h2>

        <form onSubmit={saveBook} className="library-form">
          <div className="form-group">
            <label>Book Title</label>
            <input
              type="text"
              placeholder="Enter book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              placeholder="Enter author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Genre</label>
            <input
              type="text"
              placeholder="Enter genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>ISBN</label>
            <input
              type="text"
              placeholder="Enter ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Book"
                : "Add Book"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {message && (
        <p role="status" style={{ overflowWrap: "anywhere" }}>
          {message}
        </p>
      )}

      <div className="books-list-card">
        <div className="section-heading">
          <h2>Library Books</h2>
          <span>{books.length} book(s)</span>
        </div>

        <div className="table-container">
          <table className="library-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="no-books">
                    Loading books...
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-books">
                    No books have been added yet.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id}>
                    <td><strong>{book.title}</strong></td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>
                    <td><strong>{book.quantity}</strong></td>
                    <td>
                      {book.quantity < 2 ? (
                        <span className="status low-status">
                          ● Low Stock
                        </span>
                      ) : (
                        <span className="status available-status">
                          ● Available
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => startEdit(book)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => deleteBook(book.id)}
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
      </div>
    </div>
  );
}

export default Books;
