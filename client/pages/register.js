import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Register = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "shipper",
    accidents: "",
    theftComplaints: "",  // ✅ Now Yes/No instead of a number
    truckManufactureDate: "",
    licenseIssueYear: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    let newErrors = {};

    // Name validation
    if (!userData.name.trim()) newErrors.name = "Name is required";

    // Email validation (simple regex)
    if (!/^\S+@\S+\.\S+$/.test(userData.email)) newErrors.email = "Invalid email format";

    // Phone validation (must be 10 digits)
    if (!/^\d{10}$/.test(userData.phone)) newErrors.phone = "Phone number must be 10 digits";

    // Password validation (min 6 characters)
    if (userData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    // Date validations
    if (userData.truckManufactureDate && new Date(userData.truckManufactureDate) > new Date()) {
      newErrors.truckManufactureDate = "Date cannot be in the future";
    }

    if (userData.licenseIssueYear && new Date(userData.licenseIssueYear) > new Date()) {
      newErrors.licenseIssueYear = "Date cannot be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/register", userData);

      // Show server response message
      alert(response.data.message);

      // Redirect to login page on success
      if (response.status === 201) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);

      // Show error message from the server
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={userData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={userData.phone}
          onChange={handleChange}
          required
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label>Role:</label>
        <select name="role" value={userData.role} onChange={handleChange}>
          <option value="shipper">Shipper</option>
          <option value="trucker">Trucker</option>
        </select>

        {/* Show trucker fields if "trucker" is selected */}
        {userData.role === "trucker" && (
          <div className="trucker-fields">
            <label>Any Accidents?</label>
            <select name="accidents" value={userData.accidents} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>

            {/* ✅ Changed Theft Complaints to Yes/No */}
            <label>Any Theft Complaints?</label>
            <select name="theftComplaints" value={userData.theftComplaints} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>

            <label>Truck Manufacture Year:</label>
            <input
              type="date"
              name="truckManufactureDate"
              max={`${currentYear}-12-31`}
              value={userData.truckManufactureDate}
              onChange={handleChange}
            />
            {errors.truckManufactureDate && <p className="error">{errors.truckManufactureDate}</p>}

            <label>Driver's License Issue Year:</label>
            <input
              type="date"
              name="licenseIssueYear"
              max={`${currentYear}-12-31`}
              value={userData.licenseIssueYear}
              onChange={handleChange}
            />
            {errors.licenseIssueYear && <p className="error">{errors.licenseIssueYear}</p>}
          </div>
        )}

        <button type="submit">Register</button>
      </form>

      <style jsx>{`
        .register-container {
          max-width: 400px;
          margin: 3rem auto;
          padding: 2rem;
          border: 1px solid #eaeaea;
          border-radius: 8px;
        }

        input, select {
          width: 100%;
          margin-bottom: 1rem;
          padding: 0.8rem;
        }

        .error {
          color: red;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }

        button {
          width: 100%;
          padding: 0.8rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
        }

        button:hover {
          background-color: #005bb5;
        }

        .trucker-fields {
          margin-top: 1rem;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f9f9f9;
        }
      `}</style>
    </div>
  );
};

export default Register;
    