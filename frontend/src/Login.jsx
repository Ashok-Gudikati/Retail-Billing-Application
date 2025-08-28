import React, { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (username === "admin" && password === "admin") {
      onLogin(true);
    } else if (username === "user" && password === "user") {
      onLogin(false);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="page-container" style={{ justifyContent: "center", alignItems: "center" }}>
      <div className="form-container" style={{ width: "340px" }}>
        <h2 style={{ textAlign: "center" }}>Welcome back</h2>
        <p style={{ textAlign: "center", marginTop: 0, marginBottom: "16px" }} className="muted">Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="muted">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="muted">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
          {error && (
            <p className="danger" style={{ textAlign: "center", marginTop: "10px" }}>{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
