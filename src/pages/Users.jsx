import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");

    if (savedUsers) {
      return JSON.parse(savedUsers);
    }

    return [];
  });

  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  function addUser(e) {
    e.preventDefault();

    if (!name || !membershipId || !password) {
      alert("Please fill in all fields");
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      membershipId,
      password,
      role
    };

    setUsers([...users, newUser]);
    clearForm();
  }

  function startEdit(user) {
    setEditingId(user.id);
    setName(user.name);
    setMembershipId(user.membershipId);
    setPassword(user.password);
    setRole(user.role);
  }

  function updateUser(e) {
    e.preventDefault();

    if (!name || !membershipId || !password) {
      alert("Please fill in all fields");
      return;
    }

    const updatedUsers = users.map((user) =>
      user.id === editingId
        ? {
            ...user,
            name,
            membershipId,
            password,
            role
          }
        : user
    );

    setUsers(updatedUsers);
    clearForm();
  }

  function deleteUser(id) {
    setUsers(users.filter((user) => user.id !== id));
  }

  function clearForm() {
    setName("");
    setMembershipId("");
    setPassword("");
    setRole("Member");
    setEditingId(null);
  }

  return (
    <div className="library-page">

      <div className="page-heading">
        <div>
          <h1>User Management</h1>
          <p>Manage library members and staff accounts.</p>
        </div>

        <div className="page-icon">👥</div>
      </div>

      <div className="form-card">

        <h2>{editingId ? "Update User" : "Add New User"}</h2>

        <form
          onSubmit={editingId ? updateUser : addUser}
          className="library-form"
        >

          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Membership ID</label>

            <input
              type="text"
              placeholder="Enter membership ID"
              value={membershipId}
              onChange={(e) => setMembershipId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Role</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Member">Member</option>
              <option value="Librarian">Librarian</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="form-buttons">

            <button type="submit" className="primary-btn">
              {editingId ? "Update User" : "Add User"}
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
          <h2>Library Users</h2>

          <span>
            {users.length} user(s)
          </span>
        </div>

        <div className="table-container">

          <table className="library-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Membership ID</th>
                <th>Password</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-books">
                    No users have been added yet.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>

                    <td>
                      <strong>{user.name}</strong>
                    </td>

                    <td>{user.membershipId}</td>

                    <td>••••••</td>

                    <td>
                      <span className="role-badge">
                        {user.role}
                      </span>
                    </td>

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() => startEdit(user)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteUser(user.id)}
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

export default Users;