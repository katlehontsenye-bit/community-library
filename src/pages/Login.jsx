
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Login() {
  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();

    if (!membershipId.trim() || !password) {
      alert("Please enter your membership ID and password.");
      return;
    }

    // Map membership IDs to their Supabase email addresses.
    const accountEmails = {
      ADMIN001: "katlehontsenye@gmail.com"
    };

    const email = accountEmails[membershipId.trim().toUpperCase()];

    if (!email) {
      alert("Membership ID is not registered.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) {
      alert("Login failed: " + error.message);
      return;
    }

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({
        name: "Kat",
        membershipId: membershipId.trim().toUpperCase(),
        role: "Admin",
        userId: data.user.id
      })
    );

    navigate("/");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">🔐</div>

        <h1>Library Login</h1>
        <p className="login-subtitle">
          Sign in to your library account
        </p>

        <form onSubmit={login} className="login-form">
          <div className="form-group">
            <label>Membership ID</label>
            <input
              type="text"
              placeholder="Enter membership ID"
              value={membershipId}
              onChange={(e) => setMembershipId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <span>📚</span>
          <div>
            <strong>Community Library</strong>
            <small>Powered by BluePeak Technologies</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
