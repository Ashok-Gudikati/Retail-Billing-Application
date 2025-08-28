import React, { useState, useEffect } from "react";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div>Loading customers...</div>;
  }

  if (error) {
    return <div className="danger">Error: {error}</div>;
  }

  return (
    <div className="main-content" style={{ padding: 0 }}>
      <h2>Customer List</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="card">
              <p>
                <strong>Username:</strong> {customer.username}
              </p>
              <p>
                <strong>Role:</strong> {customer.role}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Customers;
