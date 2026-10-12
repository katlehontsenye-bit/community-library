import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Backup from "./pages/Backup";

import "./App.css";


function ProtectedRoute({ children, allowedRoles }) {
  const savedUser = localStorage.getItem("loggedInUser");

  if (!savedUser) {
    return <Navigate to="/login" />;
  }

  const user = JSON.parse(savedUser);

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}


function Navigation() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("loggedInUser");
  const user = savedUser ? JSON.parse(savedUser) : null;


  function logout() {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  }


  return (
    <nav className="sidebar">

      <div className="library-logo">
        <div className="logo-icon">📚</div>

        <div>
          <h2>Community</h2>
          <span>Library</span>
        </div>
      </div>


      {user && (
        <div className="logged-user">
          <strong>{user.name}</strong>
          <span>{user.role}</span>
        </div>
      )}


      <div className="nav-links">

        {user && (
          <>

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <span>🏠</span>
              <span>Dashboard</span>
            </NavLink>


            {(user.role === "Librarian" ||
              user.role === "Admin") && (

              <NavLink
                to="/books"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <span>📚</span>
                <span>Books</span>
              </NavLink>

            )}


            {(user.role === "Librarian" ||
              user.role === "Admin") && (

              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <span>🔄</span>
                <span>Transactions</span>
              </NavLink>

            )}


            {user.role === "Admin" && (

              <NavLink
                to="/users"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <span>👥</span>
                <span>Users</span>
              </NavLink>

            )}


            {user.role === "Admin" && (

              <NavLink
                to="/backup"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <span>💾</span>
                <span>Backup</span>
              </NavLink>

            )}


            <button
              className="logout-button"
              onClick={logout}
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>

          </>
        )}

      </div>


      <div className="sidebar-footer">
        <p>Community Library</p>
        <span>Management System</span>
        <small>Powered by BluePeak Technologies</small>
      </div>

    </nav>
  );
}


function App() {
  return (
    <BrowserRouter>

      <div className="app-layout">

        <Navigation />

        <main className="main-content">

          <Routes>

            <Route
              path="/login"
              element={<Login />}
            />


            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />


            <Route
              path="/books"
              element={
                <ProtectedRoute
                  allowedRoles={["Librarian", "Admin"]}
                >
                  <Books />
                </ProtectedRoute>
              }
            />


            <Route
              path="/transactions"
              element={
                <ProtectedRoute
                  allowedRoles={["Librarian", "Admin"]}
                >
                  <Transactions />
                </ProtectedRoute>
              }
            />


            <Route
              path="/users"
              element={
                <ProtectedRoute
                  allowedRoles={["Admin"]}
                >
                  <Users />
                </ProtectedRoute>
              }
            />


            <Route
              path="/backup"
              element={
                <ProtectedRoute
                  allowedRoles={["Admin"]}
                >
                  <Backup />
                </ProtectedRoute>
              }
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;
