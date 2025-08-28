import React, { useState, useEffect } from "react";

function BillingPage({ onLogout, onToggleTheme, theme }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionItems, setTransactionItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Removed: State for customer details

  const [transactionComplete, setTransactionComplete] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory]);

  const handleAddToCart = (product) => {
    const existingItem = transactionItems.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      setTransactionItems(
        transactionItems.map((item) =>
          item.id === product.id
            ? { ...existingItem, quantity: existingItem.quantity + 1 }
            : item
        )
      );
    } else {
      setTransactionItems([
        ...transactionItems,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const handleRemoveItem = (id) => {
    setTransactionItems(transactionItems.filter((item) => item.id !== id));
  };

  const handleIncrement = (id) => {
    setTransactionItems(
      transactionItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setTransactionItems(
      transactionItems
        .map((item) => {
          if (item.id === id) {
            if (item.quantity === 1) {
              handleRemoveItem(id);
              return null;
            } else {
              return { ...item, quantity: item.quantity - 1 };
            }
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleCompleteTransaction = async () => {
    const saleRequests = transactionItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const checkoutRequest = {
      saleRequests: saleRequests,
    };

    try {
      const response = await fetch("/api/sales/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}. Message: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Transaction completed successfully:", result);

      setTransactionComplete(true);
      setTransactionItems([]);
      // Removed: Logic to clear customer details state
    } catch (error) {
      console.error("Error completing transaction:", error);
      alert("Error completing transaction: " + error.message);
    }
  };

  const handleNewTransaction = () => {
    setTransactionComplete(false);
    setIsCartVisible(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const grandTotal = transactionItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
  const totalItemsInCart = transactionItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  return (
    <div className="main-content">
      <header className="header">
        <h1>Retail Billing Application</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button className="btn" onClick={onToggleTheme}>{theme === "light" ? "🌙 Dark" : "☀️ Light"}</button>
          <button onClick={onLogout} className="btn logout-btn">Logout</button>
          <button
            onClick={() => setIsCartVisible(true)}
            className="btn"
            style={{ position: "relative", fontSize: "20px", padding: "10px 12px" }}
          >
            🛒
            {totalItemsInCart > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  background: "#ef4444",
                  color: "white",
                  borderRadius: "999px",
                  padding: "2px 6px",
                  fontSize: "12px",
                }}
              >
                {totalItemsInCart}
              </span>
            )}
          </button>
        </div>
      </header>

      {transactionComplete ? (
        <div className="card" style={{ textAlign: "center", marginTop: "40px" }}>
          <h2 style={{ color: "green", fontSize: "3rem" }}>✅</h2>
          <h2>Transaction Completed Successfully!</h2>
          <p>
            Thank you for your business. The new transaction can be started now.
          </p>
          <button onClick={handleNewTransaction} className="btn btn-primary" style={{ marginTop: "10px" }}>Start New Transaction</button>
        </div>
      ) : (
        <>
          <nav className="panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <label>🔍</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <label>Filter by Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </nav>

          <div className="main-content" style={{ padding: 0 }}>
            <div className="product-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name || "No Name"}
                        className="product-image"
                      />
                    )}
                    <div style={{ textAlign: "center" }}>
                      <h4 style={{ margin: 0 }}>{product.name || "No Name"}</h4>
                      <p style={{ margin: "5px 0" }}>₹{product.price}</p>
                      {product.description && (
                        <p style={{ fontSize: "12px", margin: "5px 0" }}>{product.description}</p>
                      )}
                    </div>
                    <button onClick={() => handleAddToCart(product)} className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }}>Add to Cart</button>
                  </div>
                ))
              ) : (
                <p>No products found matching your criteria.</p>
              )}
            </div>
          </div>

          {isCartVisible && (
            <>
            <div className="overlay" onClick={() => setIsCartVisible(false)} />
            <div className="cart-modal">
              <div className="cart-header">
                <h2>Current Transaction</h2>
                <button onClick={() => setIsCartVisible(false)} className="btn" style={{ fontSize: "18px", padding: "6px 10px" }}>&times;</button>
              </div>
              {transactionItems.length === 0 ? (
                <p>No items in transaction.</p>
              ) : (
                <div>
                  {/* Removed: Customer input fields */}
                  <ul className="cart-items">
                    {transactionItems.map((item) => (
                      <li key={item.id} className="cart-item">
                        <span>
                          {item.name || "No Name"} x {item.quantity}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button onClick={() => handleDecrement(item.id)} className="btn" style={{ padding: "4px 10px" }}>-</button>
                          <button onClick={() => handleIncrement(item.id)} className="btn" style={{ padding: "4px 10px" }}>+</button>
                          <button onClick={() => handleRemoveItem(item.id)} className="btn btn-danger" style={{ padding: "6px 10px", marginLeft: "6px" }}>Remove</button>
                        </div>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <hr />
                  <h3>Grand Total: ₹{grandTotal.toFixed(2)}</h3>
                  <button
                    onClick={handleCompleteTransaction}
                    disabled={transactionItems.length === 0}
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "10px", opacity: transactionItems.length === 0 ? 0.5 : 1 }}
                  >
                    Complete Transaction
                  </button>
                </div>
              )}
            </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default BillingPage;
