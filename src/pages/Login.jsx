import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  useEffect(() => {
    const savedUsers = localStorage.getItem("users");

    if (!savedUsers) {
      const defaultAdmin = [
        {
          name: "Kat",
          membershipId: "ADMIN001",
          password: "1234",
          role: "Admin"
        }
      ];

      localStorage.setItem(
        "users",
        JSON.stringify(defaultAdmin)
      );
    }
  }, []);


  function login(e) {
    e.preventDefault();


    if (!membershipId || !password) {
      alert("Please enter your membership ID and password");
      return;
    }


    const savedUsers = localStorage.getItem("users");


    if (!savedUsers) {
      alert("No users found.");
      return;
    }


    const users = JSON.parse(savedUsers);


    const user = users.find(
      (user) =>
        user.membershipId === membershipId &&
        user.password === password
    );


    if (user) {
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
      );

      alert(
        "Login successful! Welcome " + user.name
      );

      navigate("/");
    } else {
      alert("Incorrect membership ID or password.");
    }
  }


  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-icon">
          🔐
        </div>

        <h1>Library Login</h1>

        <p className="login-subtitle">
          Sign in to your library account
        </p>


        <form
          onSubmit={login}
          className="login-form"
        >

          <div className="form-group">

            <label>
              Membership ID
            </label>

            <input
              type="text"
              placeholder="Enter membership ID"
              value={membershipId}
              onChange={(e) =>
                setMembershipId(e.target.value)
              }
            />

          </div>


          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>


          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>


        <div className="login-footer">

          <span>📚</span>

          <div>
            <strong>
              Community Library
            </strong>

            <small>
              Powered by BluePeak Technologies
            </small>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;