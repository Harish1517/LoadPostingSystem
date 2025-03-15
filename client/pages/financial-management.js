import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FinancialManagement = () => {
  const [transactions, setTransactions] = useState([]);

  // Fetch Transaction Data from Backend
  const fetchTransactions = async () => {
    const response = await axios.get('http://localhost:5000/api/transactions');
    setTransactions(response.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="financial-container">
      <h1>Financial Management 💰</h1>
      <div className="transaction-list">
        {transactions.map((transaction, index) => (
          <div key={index} className="transaction-card">
            <p>Load ID: {transaction.loadId}</p>
            <p>Shipper: {transaction.shipper}</p>
            <p>Trucker: {transaction.trucker}</p>
            <p>Amount: ${transaction.amount}</p>
            <p>Status: {transaction.status}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .financial-container {
          padding: 20px;
        }
        h1 {
          text-align: center;
        }
        .transaction-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .transaction-card {
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default FinancialManagement;
