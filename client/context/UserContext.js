import { createContext, useState, useEffect } from "react";

// Create Context
const UserContext = createContext();

// User Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check localStorage for saved user session on page load
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // Login Function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Save session
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear session
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
