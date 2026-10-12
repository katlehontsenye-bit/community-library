import { useState } from "react";

function Dashboard() {
  const [books] = useState(() => {
    const savedBooks = localStorage.getItem("books");

    if (savedBooks) {
      return JSON.parse(savedBooks);
    }

    return [];
  });

  const totalBooks = books.length;

  const totalCopies = books.reduce(
    (total, book) => total + book.quantity,
    0
  );

  const lowStock = books.filter(
    (book) => book.quantity < 2
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
            <p>{totalBooks}</p>
            <span>Different book titles</span>
          </div>
        </div>

        <div className="dashboard-card copies-card">
          <div className="card-icon">📦</div>

          <div>
            <h3>Total Copies</h3>
            <p>{totalCopies}</p>
            <span>Total available copies</span>
          </div>
        </div>

        <div className="dashboard-card low-card">
          <div className="card-icon">⚠️</div>

          <div>
            <h3>Low Stock</h3>
            <p>{lowStock}</p>
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

              {books.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-books">
                    No books have been added yet.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr
                    key={book.id}
                    className={
                      book.quantity < 2
                        ? "low-stock-row"
                        : ""
                    }
                  >
                    <td>{book.title}</td>
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
                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="stock-alert">

        <div className="alert-icon">
          ℹ
        </div>

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