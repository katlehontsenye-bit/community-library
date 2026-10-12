import { useEffect, useState } from "react";

function Books() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books");

    if (savedBooks) {
      return JSON.parse(savedBooks);
    }

    return [];
  });

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  function addBook(e) {
    e.preventDefault();

    if (!title || !author || !genre || !isbn || !quantity) {
      alert("Please fill in all fields");
      return;
    }

    const newBook = {
      id: Date.now(),
      title,
      author,
      genre,
      isbn,
      quantity: Number(quantity)
    };

    setBooks([...books, newBook]);
    clearForm();
  }

  function startEdit(book) {
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setIsbn(book.isbn);
    setQuantity(book.quantity);
  }

  function updateBook(e) {
    e.preventDefault();

    if (!title || !author || !genre || !isbn || !quantity) {
      alert("Please fill in all fields");
      return;
    }

    const updatedBooks = books.map((book) =>
      book.id === editingId
        ? {
            ...book,
            title,
            author,
            genre,
            isbn,
            quantity: Number(quantity)
          }
        : book
    );

    setBooks(updatedBooks);
    clearForm();
  }

  function deleteBook(id) {
    setBooks(books.filter((book) => book.id !== id));
  }

  function clearForm() {
    setTitle("");
    setAuthor("");
    setGenre("");
    setIsbn("");
    setQuantity("");
    setEditingId(null);
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

        <form
          onSubmit={editingId ? updateBook : addBook}
          className="library-form"
        >

          <div className="form-group">
            <label>Book Title</label>
            <input
              type="text"
              placeholder="Enter book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              placeholder="Enter author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Genre</label>
            <input
              type="text"
              placeholder="Enter genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>ISBN</label>
            <input
              type="text"
              placeholder="Enter ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              min="0"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="primary-btn">
              {editingId ? "Update Book" : "Add Book"}
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

              {books.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-books">
                    No books have been added yet.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id}>

                    <td>
                      <strong>{book.title}</strong>
                    </td>

                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>

                    <td>
                      <strong>{book.quantity}</strong>
                    </td>

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
                        className="edit-btn"
                        onClick={() => startEdit(book)}
                      >
                        Edit
                      </button>

                      <button
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