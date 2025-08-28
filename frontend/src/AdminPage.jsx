import React, { useState } from "react";
import TransactionHistory from "./TransactionHistory";
import AddProduct from "./AddProduct";
import TotalSales from "./TotalSales";
import UpdateProducts from "./UpdateProducts";
import Customers from "./Customers";

function AdminPage({ onLogout, onToggleTheme, theme }) {
  const [currentView, setCurrentView] = useState("totalSales");

  const renderView = () => {
    switch (currentView) {
      case "totalSales":
        return <TotalSales />;
      case "transactions":
        return <TransactionHistory />;
      case "addProduct":
        return <AddProduct />;
      case "updateProducts":
        return <UpdateProducts />;
      case "customers":
        return <Customers />;
      default:
        return <TotalSales />;
    }
  };

  return (
    <div className="page-container">
      <header className="header">
        <h1>Admin Dashboard</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn" onClick={onToggleTheme}>{theme === "light" ? "🌙 Dark" : "☀️ Light"}</button>
          <button onClick={onLogout} className="btn logout-btn">Logout</button>
        </div>
      </header>
      <div className="admin-page">
        <nav className="sidebar">
          <button
            onClick={() => setCurrentView("totalSales")}
            className={`sidebar-btn ${
              currentView === "totalSales" ? "active" : ""
            }`}
          >
            Total Sales
          </button>
          <button
            onClick={() => setCurrentView("transactions")}
            className={`sidebar-btn ${
              currentView === "transactions" ? "active" : ""
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setCurrentView("addProduct")}
            className={`sidebar-btn ${
              currentView === "addProduct" ? "active" : ""
            }`}
          >
            Add Products
          </button>
          <button
            onClick={() => setCurrentView("updateProducts")}
            className={`sidebar-btn ${
              currentView === "updateProducts" ? "active" : ""
            }`}
          >
            Update Products
          </button>
          <button
            onClick={() => setCurrentView("customers")}
            className={`sidebar-btn ${
              currentView === "customers" ? "active" : ""
            }`}
          >
            Customers
          </button>
        </nav>
        <main className="main-content">{renderView()}</main>
      </div>
    </div>
  );
}

export default AdminPage;
