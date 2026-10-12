import { useEffect, useState } from "react";

function Transactions() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books");

    if (savedBooks) {
      return JSON.parse(savedBooks);
    }

    return [];
  });

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");

    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }

    return [];
  });

  const [bookId, setBookId] = useState("");
  const [member, setMember] = useState("");
  const [type, setType] = useState("Borrow");

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  function addTransaction(e) {
    e.preventDefault();

    if (!bookId || !member) {
      alert("Please fill in all fields");
      return;
    }

    const selectedBook = books.find(
      (book) => book.id === Number(bookId)
    );

    if (!selectedBook) {
      alert("Please select a book");
      return;
    }

    if (type === "Borrow") {
      if (selectedBook.quantity <= 0) {
        alert("This book is out of stock");
        return;
      }

      const updatedBooks = books.map((book) =>
        book.id === selectedBook.id
          ? {
              ...book,
              quantity: book.quantity - 1
            }
          : book
      );

      setBooks(updatedBooks);
    }

    if (type === "Return") {
      const updatedBooks = books.map((book) =>
        book.id === selectedBook.id
          ? {
              ...book,
              quantity: book.quantity + 1
            }
          : book
      );

      setBooks(updatedBooks);
    }

    const newTransaction = {
      id: Date.now(),
      book: selectedBook.title,
      member: member,
      type: type,
      date: new Date().toLocaleDateString()
    };

    setTransactions([...transactions, newTransaction]);

    setBookId("");
    setMember("");
    setType("Borrow");
  }

  return (
    <div className="library-page">

      <div className="page-heading">
        <div>
          <h1>Library Transactions</h1>
          <p>Record book borrowing and returns.</p>
        </div>

        <div className="page-icon">🔄</div>
      </div>

      <div className="form-card">

        <h2>Record Transaction</h2>

        <form
          onSubmit={addTransaction}
          className="library-form"
        >

          <div className="form-group">
            <label>Select Book</label>

            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
            >
              <option value="">Select a book</option>

              {books.map((book) => (
                <option
                  key={book.id}
                  value={book.id}
                >
                  {book.title} - {book.quantity} available
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Member ID</label>

            <input
              type="text"
              placeholder="Enter member ID"
              value={member}
              onChange={(e) => setMember(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Transaction Type</label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Borrow">Borrow</option>
              <option value="Return">Return</option>
            </select>
          </div>

          <div className="form-buttons">

            <button
              type="submit"
              className="primary-btn"
            >
              Record Transaction
            </button>

          </div>

        </form>
      </div>

      <div className="books-list-card">

        <div className="section-heading">

          <h2>Transaction History</h2>

          <span>
            {transactions.length} transaction(s)
          </span>

        </div>

        <div className="table-container">

          <table className="library-table">

            <thead>
              <tr>
                <th>Book</th>
                <th>Member ID</th>
                <th>Type</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {transactions.length === 0 ? (

                <tr>
                  <td
                    colSpan="4"
                    className="no-books"
                  >
                    No transactions have been recorded yet.
                  </td>
                </tr>

              ) : (

                transactions.map((transaction) => (

                  <tr key={transaction.id}>

                    <td>
                      <strong>
                        {transaction.book}
                      </strong>
                    </td>

                    <td>
                      {transaction.member}
                    </td>

                    <td>

                      {transaction.type === "Borrow" ? (

                        <span className="transaction-badge borrow-badge">
                          Borrow
                        </span>

                      ) : (

                        <span className="transaction-badge return-badge">
                          Return
                        </span>

                      )}

                    </td>

                    <td>
                      {transaction.date}
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

export default Transactions;