import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);

  // Fetch All Shippers & Truckers from Backend
  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5000/api/users');
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle User Deletion
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/${userId}`);
      fetchUsers(); // Refresh User List
      alert('User Deleted Successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to Delete User');
    }
  };

  return (
    <div className="admin-container">
      <h1>SuperAdmin Dashboard 👑</h1>
      <div className="user-list">
        {users.map((user, index) => (
          <div key={index} className="user-card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <button onClick={() => handleDeleteUser(user.id)}>Remove User</button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .admin-container {
          padding: 20px;
        }
        h1 {
          text-align: center;
        }
        .user-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .user-card {
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        button {
          background-color: red;
          color: white;
          border: none;
          padding: 8px 15px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default SuperAdminDashboard;
