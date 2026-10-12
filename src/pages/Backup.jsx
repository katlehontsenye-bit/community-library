import { useState } from "react";

function Backup() {
  const [message, setMessage] = useState("");

  function backupData() {
    const backup = {
      users: JSON.parse(localStorage.getItem("users") || "[]"),
      books: JSON.parse(localStorage.getItem("books") || "[]"),
      transactions: JSON.parse(
        localStorage.getItem("transactions") || "[]"
      )
    };

    const data = JSON.stringify(backup, null, 2);

    const blob = new Blob([data], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "community-library-backup.json";

    link.click();

    URL.revokeObjectURL(url);

    setMessage("Backup created successfully!");
  }

  function restoreData(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const backup = JSON.parse(e.target.result);

        if (!backup.users || !backup.books || !backup.transactions) {
          alert("Invalid backup file.");
          return;
        }

        localStorage.setItem(
          "users",
          JSON.stringify(backup.users)
        );

        localStorage.setItem(
          "books",
          JSON.stringify(backup.books)
        );

        localStorage.setItem(
          "transactions",
          JSON.stringify(backup.transactions)
        );

        setMessage("Backup restored successfully!");

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        alert("The backup file could not be read.");
      }
    };

    reader.readAsText(file);
  }

  function clearData() {
    const confirmClear = window.confirm(
      "Are you sure you want to delete all library data?"
    );

    if (!confirmClear) {
      return;
    }

    localStorage.removeItem("users");
    localStorage.removeItem("books");
    localStorage.removeItem("transactions");

    setMessage("Library data has been cleared.");

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Backup & Restore</h1>
        <p>Protect your library data</p>
      </div>

      <div className="backup-grid">

        <div className="backup-card">
          <div className="backup-icon">💾</div>

          <h2>Backup Library</h2>

          <p>
            Save your users, books and transaction records
            into a backup file.
          </p>

          <button
            className="primary-button"
            onClick={backupData}
          >
            Create Backup
          </button>
        </div>

        <div className="backup-card">
          <div className="backup-icon">📂</div>

          <h2>Restore Library</h2>

          <p>
            Restore users, books and transactions from
            a previous backup file.
          </p>

          <label className="primary-button backup-upload">
            Restore Backup
            <input
              type="file"
              accept=".json"
              onChange={restoreData}
              hidden
            />
          </label>
        </div>

        <div className="backup-card danger-card">
          <div className="backup-icon">🗑️</div>

          <h2>Clear Data</h2>

          <p>
            Remove all users, books and transaction records
            from this library.
          </p>

          <button
            className="delete-button"
            onClick={clearData}
          >
            Clear All Data
          </button>
        </div>

      </div>

      {message && (
        <div className="backup-message">
          {message}
        </div>
      )}
    </div>
  );
}

export default Backup;