import LoadForm from "../components/LoadForm";
import axios from "axios";
import { useState, useContext } from "react";
import { useRouter } from "next/router"; // Import Next.js router
import UserContext from "../context/UserContext"; 

export default function AddLoadPage() {
  const { user } = useContext(UserContext); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter(); // Initialize Next.js router

  const handleFormSubmit = async (data) => {
    if (!user || !user._id) {
      setMessage("You must be logged in as a shipper to add a load.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/addload", {
        ...data,
        shipperId: user._id, 
      });

      setMessage(response.data.message);

      // ✅ Redirect to "My Loads" after successful submission
      setTimeout(() => {
        router.push("/my-loads"); // Adjust URL if needed
      }, 1500); // Short delay for user feedback
    } catch (error) {
      console.error("Error submitting load:", error);
      setMessage(error.response?.data?.message || "Failed to add load. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Load</h2>
      {message && <div className="alert alert-info text-center">{message}</div>}
      <LoadForm onSubmit={handleFormSubmit} />
      {loading && <p className="text-center mt-3">Submitting load, please wait...</p>}
    </div>
  );
}
