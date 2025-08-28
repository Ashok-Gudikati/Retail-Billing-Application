import React, { useEffect, useState } from "react";
import BillingPage from "./BillingPage";
import Login from "./Login";
import AdminPage from "./AdminPage";
import "./App.css"; // NEW: Import the CSS file

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogin = (isAdminUser) => {
    setIsLoggedIn(true);
    setIsAdmin(isAdminUser);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const ThemeToggle = () => (
    <button
      className="btn"
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      title="Toggle theme"
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );

  if (!isLoggedIn) {
    return (
      <div className="page-container">
        <header className="header">
          <h1>Welcome</h1>
          <ThemeToggle />
        </header>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <AdminPage
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      />
    );
  }

  return (
    <BillingPage
      onLogout={handleLogout}
      theme={theme}
      onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
    />
  );
}

export default App;
