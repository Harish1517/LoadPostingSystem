"use client";

import { useEffect, useState, useContext } from "react";
import { Accordion, Button, Container, Table, Badge, Form, Modal } from "react-bootstrap";
import axios from "axios";
import LoadForm from "../components/LoadForm";
import UserContext from "../context/UserContext"; // Import UserContext to get shipperId

export default function MyLoads() {
  const { user } = useContext(UserContext);
  const [loads, setLoads] = useState([]);
  const [filteredLoads, setFilteredLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    if (!user || !user._id) return;

    const fetchLoads = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/myloads/${user._id}`);
        setLoads(response.data);
        setFilteredLoads(response.data);
      } catch (err) {
        setError("Failed to fetch loads.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoads();
  }, [user]);

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setFilter(selectedStatus);
    setFilteredLoads(
      selectedStatus === "all" ? loads : loads.filter(load => load.status === selectedStatus)
    );
  };

  const handleEdit = (load) => {
    setSelectedLoad(load);
    setShowModal(true);
  };

  const handleUpdate = async (updatedLoad) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/myloads/${user._id}/editload/${selectedLoad._id}`,
        updatedLoad
      );
      const updatedLoads = loads.map(load => (load._id === selectedLoad._id ? response.data : load));
      setLoads(updatedLoads);
      setFilteredLoads(updatedLoads.filter(load => filter === "all" || load.status === filter));
      setShowModal(false);
    } catch (err) {
      alert("Failed to update load.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this load?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/myloads/${user._id}/deleteload/${id}`);

      const updatedLoads = loads.filter(load => load._id !== id);
      setLoads(updatedLoads);
      setFilteredLoads(updatedLoads.filter(load => filter === "all" || load.status === filter));

      alert("Load deleted successfully!");
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete load.");
    }
  };

  const handleViewBids = async (load) => {
    setSelectedLoad(load);
    try {
      const response = await axios.get(`http://localhost:5000/api/offers/${load._id}`);
      setBids(response.data);
    } catch (err) {
      setBids([]);
    }
    setShowBidsModal(true);
  };

  // ✅ Automatically Select the Lowest Bid
  const handleSelectLowestBid = async () => {
    if (bids.length === 0) {
      alert("No bids available.");
      return;
    }

    const lowestBid = bids[0]; // First bid (sorted lowest)
    if (!window.confirm(`Confirm deal with ${lowestBid.truckerId.name} for $${lowestBid.offerPrice}?`)) return;

    try {
      const response = await axios.put(`http://localhost:5000/api/offer/select`, {
        loadId: selectedLoad._id,
        truckerId: lowestBid.truckerId._id,
      });

      alert(response.data.message);
      setShowBidsModal(false);
    } catch (err) {
      alert("Failed to select trucker.");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading loads...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">🚛 My Loads</h2>

      <Form.Group className="mb-3 text-center">
        <Form.Label><strong>Filter Loads by Status:</strong></Form.Label>
        <Form.Select value={filter} onChange={handleFilterChange} className="w-50 mx-auto">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="booked">Booked</option>
          <option value="completed">Completed</option>
        </Form.Select>
      </Form.Group>

      <Accordion>
        {filteredLoads.map((load, index) => (
          <Accordion.Item eventKey={index} key={load._id}>
            <Accordion.Header>
              <div className="d-flex justify-content-between w-100 align-items-center">
                <div className="text-start">
                  <strong>{load.origin}</strong> → <strong>{load.destination}</strong>
                </div>

                {/* Show Bids button only for pending loads */}
                {load.status === "pending" && (
                  <Button variant="info" size="sm" className="ms-auto" onClick={() => handleViewBids(load)}>
                    💰 Bids
                  </Button>
                )}

                <Badge
                  bg={load.status === "pending" ? "danger" : load.status === "booked" ? "warning" : "success"}
                  className="ms-3"
                >
                  {load.status.toUpperCase()}
                </Badge>
              </div>
            </Accordion.Header>

            <Accordion.Body>
              <Table bordered hover responsive>
                <tbody>
                  <tr><td><strong>Pickup:</strong></td><td>{new Date(load.pickupFrom).toLocaleDateString()} - {new Date(load.pickupTo).toLocaleDateString()}</td></tr>
                  <tr><td><strong>Weight:</strong></td><td>{load.loadWeight} lbs</td></tr>
                  <tr><td><strong>Equipment:</strong></td><td>{load.equipment}</td></tr>
                  <tr><td><strong>Payment:</strong></td><td>${load.payment}</td></tr>
                  <tr><td><strong>Contact Name:</strong></td><td>{load.contact.name}</td></tr>
                  <tr><td><strong>Contact Phone:</strong></td><td>{load.contact.phone}</td></tr>
                  <tr><td><strong>Contact Email:</strong></td><td>{load.contact.email}</td></tr>
                </tbody>
              </Table>

              {/* Hide edit and delete buttons for booked and completed loads */}
              {load.status === "pending" && (
                <div className="text-center">
                  <Button variant="primary" className="me-2" onClick={() => handleEdit(load)}>✏ Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(load._id)}>🗑 Delete</Button>
                </div>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}
