import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import UserContext from "../context/UserContext"; // Import UserContext

const Login = () => {
  const { login } = useContext(UserContext); // Access login function from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post("http://localhost:5000/api/login", { email, password });

      if (data.success) {
        login(data.user); // Save user data in context
        alert(data.message); // Show success message
        router.push("/"); // Redirect to dashboard
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred during login.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
      </form>

      <style jsx>{`
        .login-container {
          max-width: 400px;
          margin: 3rem auto;
          padding: 2rem;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h1 {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.2rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        input {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .error {
          color: #e00;
          margin-bottom: 1rem;
          text-align: center;
        }

        button {
          width: 100%;
          padding: 0.75rem;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default Login;
