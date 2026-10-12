
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBooks() {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        setError("Could not load books: " + error.message);
      } else {
        setBooks(data || []);
        setError("");
      }

      setLoading(false);
    }

    loadBooks();
  }, []);

  const totalBooks = books.length;

  const totalCopies = books.reduce(
    (total, book) => total + Number(book.quantity || 0),
    0
  );

  const lowStock = books.filter(
    (book) => Number(book.quantity || 0) < 2
  ).length;

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>📚 Library Dashboard</h1>
          <p>
            Welcome to Hlotse Community Library Management System.
          </p>
        </div>

        <div className="today-box">
          <span>📅</span>
          <div>
            <strong>Today</strong>
            <br />
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card books-card">
          <div className="card-icon">📚</div>
          <div>
            <h3>Total Books</h3>
            <p>{loading ? "..." : totalBooks}</p>
            <span>Different book titles</span>
          </div>
        </div>

        <div className="dashboard-card copies-card">
          <div className="card-icon">📦</div>
          <div>
            <h3>Total Copies</h3>
            <p>{loading ? "..." : totalCopies}</p>
            <span>Total copies in stock</span>
          </div>
        </div>

        <div className="dashboard-card low-card">
          <div className="card-icon">⚠️</div>
          <div>
            <h3>Low Stock</h3>
            <p>{loading ? "..." : lowStock}</p>
            <span>Books below 2 copies</span>
          </div>
        </div>
      </div>

      {/* Book Availability */}
      <div className="availability-section">
        <div className="availability-header">
          <div>
            <h2>📖 Book Availability</h2>
            <p>Current stock levels in the library</p>
          </div>

          <div className="status-key">
            <span>
              <i className="available-dot"></i>
              Available
            </span>
            <span>
              <i className="low-dot"></i>
              Low Stock
            </span>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="no-books">
                    Loading books...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="no-books">
                    Unable to load books. Please check the error above.
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-books">
                    No books have been added yet.
                  </td>
                </tr>
              ) : (
                books.map((book) => {
                  const quantity = Number(book.quantity || 0);
                  const isLowStock = quantity < 2;

                  return (
                    <tr
                      key={book.id}
                      className={isLowStock ? "low-stock-row" : ""}
                    >
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>{book.isbn}</td>
                      <td>
                        <strong>{quantity}</strong>
                      </td>
                      <td>
                        {isLowStock ? (
                          <span className="status low-status">
                            ● Low Stock
                          </span>
                        ) : (
                          <span className="status available-status">
                            ● Available
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="stock-alert">
        <div className="alert-icon">ℹ</div>
        <div>
          <h3>Low Stock Alert</h3>
          <p>
            Books with fewer than 2 copies are highlighted.
            Consider adding more copies to keep them available
            for your readers.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <strong>Community Library Management System</strong>
        <p>Better Readers • Stronger Communities</p>
      </div>
    </div>
  );
}

export default Dashboard;
