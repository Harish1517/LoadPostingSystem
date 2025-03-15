import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShipperDashboard = () => {
  const [loads, setLoads] = useState([]);

  // Fetch Load Data from Backend
  const fetchLoads = async () => {
    const response = await axios.get('http://localhost:5000/api/loads');
    setLoads(response.data);
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Shipper Dashboard 🚚</h1>
      <div className="load-list">
        {loads.map((load, index) => (
          <div key={index} className="load-card">
            <h3>{load.title}</h3>
            <p>Origin: {load.origin}</p>
            <p>Destination: {load.destination}</p>
            <p>Weight: {load.weight} Tons</p>
            <p>Price: ${load.price}</p>
            <button>View Bids</button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 20px;
        }
        h1 {
          text-align: center;
        }
        .load-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .load-card {
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 8px 15px;
          margin-top: 10px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ShipperDashboard;
