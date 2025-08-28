import React, { useState, useEffect } from "react";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NEW: State for date filtering
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    let url = "/api/transactions";

    // Check if both dates are provided
    if (startDate && endDate) {
      const startDateTime = `${startDate}T00:00:00`;
      const endDateTime = `${endDate}T23:59:59`;
      // NOTE: This filter is handled on the client-side for now.
      // A more robust solution would be a backend endpoint that accepts dates.
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Client-side filtering
      let filteredData = data;
      if (startDate && endDate) {
        filteredData = data.filter((t) => {
          const transactionDate = new Date(t.transactionDate);
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // Include the whole end day
          return transactionDate >= start && transactionDate <= end;
        });
      }

      setTransactions(filteredData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [startDate, endDate]); // Re-fetch when dates change

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="main-content" style={{ padding: 0 }}>
      <h2>Transaction History</h2>
      <div className="panel" style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
      {transactions.length === 0 ? (
        <p>No transactions found for the selected dates.</p>
      ) : (
        <div className="product-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {transactions.map((transaction) => (
            <div key={transaction.id} className="card">
              <p>
                <strong>Transaction ID:</strong> {transaction.id}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(transaction.transactionDate).toLocaleString()}
              </p>
              <p>
                <strong>Total:</strong> ₹{transaction.grandTotal.toFixed(2)}
              </p>
              <p>
                <strong>Payment Method:</strong> {transaction.paymentMethod}
              </p>
              <h4>Items:</h4>
              <ul style={{ paddingLeft: "20px", margin: 0 }}>
                {transaction.saleItems.map((item) => (
                  <li key={item.id}>
                    {item.productName} (x{item.quantity}) - ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;
