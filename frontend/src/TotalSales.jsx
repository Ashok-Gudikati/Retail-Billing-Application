import React, { useState } from "react";

function TotalSales() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalSales, setTotalSales] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTotalSales = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError(null);
    setTotalSales(null);

    const startDateTime = `${startDate}T00:00:00`;
    const endDateTime = `${endDate}T23:59:59`;

    try {
      const response = await fetch(
        `/api/transactions/total-sales?startDate=${startDateTime}&endDate=${endDateTime}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTotalSales(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Total Sales</h2>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
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
        <button onClick={fetchTotalSales} className="btn btn-primary">Get Total Sales</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="danger">Error: {error}</p>}

      {totalSales !== null && <h3>Total Sales: ₹{totalSales.toFixed(2)}</h3>}
    </div>
  );
}

export default TotalSales;
