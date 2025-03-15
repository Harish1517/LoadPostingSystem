import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Container, Row, Col, Form, Button, Accordion, Table, Badge, Modal } from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UserContext from "../context/UserContext"; // Import UserContext

export default function TruckersPage() {
  const router = useRouter();
  const { user } = useContext(UserContext); // Get logged-in trucker
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState({
    origin: "",
    destination: "",
    pickupRange: [null, null],
    equipment: "",
  });

  // State for modal offer submission
  const [showModal, setShowModal] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [offerAmount, setOfferAmount] = useState("");

  // ✅ Read URL Params on Page Load
  useEffect(() => {
    if (!router.isReady) return;
    const params = new URLSearchParams(router.asPath.split("?")[1]);

    setSearch({
      origin: params.get("origin") || "",
      destination: params.get("destination") || "",
      pickupRange: params.get("pickupFrom") && params.get("pickupTo") ? 
        [new Date(params.get("pickupFrom")), new Date(params.get("pickupTo"))] : 
        [null, null],
      equipment: params.get("equipment") || "",
    });

    fetchLoads(params);
  }, [router.isReady]);

  // ✅ Fetch Loads Based on Search Criteria
  const fetchLoads = async (params) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/pendingloads?${params.toString()}`);
      setLoads(response.data);
    } catch (err) {
      setError("Failed to fetch loads.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Search & Update URL Params
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (search.origin) params.set("origin", search.origin);
    if (search.destination) params.set("destination", search.destination);
    if (search.pickupRange[0] && search.pickupRange[1]) {
      params.set("pickupFrom", search.pickupRange[0].toISOString());
      params.set("pickupTo", search.pickupRange[1].toISOString());
    }
    if (search.equipment) params.set("equipment", search.equipment);

    router.push(`/truckers?${params.toString()}`, undefined, { shallow: true });
    fetchLoads(params);
  };

  // ✅ Open Make Offer Modal
  const handleMakeOffer = (load) => {
    setSelectedLoad(load);
    setOfferAmount("");
    setShowModal(true);
  };

  // ✅ Submit Offer
  const handleOfferSubmit = async () => {
    if (!offerAmount || offerAmount <= 0 || offerAmount > selectedLoad.payment) {
      alert("❌ Offer must be a positive number and less than or equal to the payment amount.");
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:5000/api/makeoffer/${user._id}/${selectedLoad._id}`, {
        offerPrice: offerAmount,
      });
  
      alert(`✅ Success: ${response.data.message}`);
      setShowModal(false);
    } catch (err) {
      console.error("Error submitting offer:", err);
  
      if (err.response) {
        // Server responded with an error (4xx, 5xx)
        alert(`❌ Error: ${err.response.data.message || "Something went wrong."}`);
      } else if (err.request) {
        // No response received from server
        alert("⚠ Network error: Server is unreachable.");
      } else {
        // Other errors (like Axios config issues)
        alert("⚠ Unexpected error occurred.");
      }
    }
  };
  

  if (loading) return <p className="text-center mt-5">Loading loads...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">🚛 Find Loads</h2>

      {/* ✅ Search Form */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Origin</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter origin"
              value={search.origin}
              onChange={(e) => setSearch({ ...search, origin: e.target.value })}
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Destination</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter destination"
              value={search.destination}
              onChange={(e) => setSearch({ ...search, destination: e.target.value })}
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Pickup Date Range</Form.Label>
            <DatePicker
              selectsRange
              startDate={search.pickupRange[0]}
              endDate={search.pickupRange[1]}
              onChange={(dates) => setSearch({ ...search, pickupRange: dates })}
              className="form-control"
              placeholderText="Select pickup date range"
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Equipment Type</Form.Label>
            <Form.Select value={search.equipment} onChange={(e) => setSearch({ ...search, equipment: e.target.value })}>
              <option value="">All</option>
              <option value="Flatbed">Flatbed</option>
              <option value="Reefer">Reefer</option>
              <option value="Dry Van">Dry Van</option>
              <option value="Step Deck">Step Deck</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <div className="text-center mb-3">
        <Button variant="danger" onClick={handleSearch}>Search</Button>
      </div>

      {/* ✅ Loads Accordion */}
      <Accordion>
        {loads.map((load, index) => (
          <Accordion.Item eventKey={index} key={load._id}>
            <Accordion.Header>
              <div className="d-flex justify-content-between w-100 align-items-center">
                {/* Left: Origin → Destination & Pickup Date */}
                <div>
                  <strong>{load.origin}</strong> → <strong>{load.destination}</strong> <br />
                  <small>📅 {new Date(load.pickupFrom).toLocaleDateString()} - {new Date(load.pickupTo).toLocaleDateString()}</small>
                </div>

                {/* Right: Make Offer Button */}
                <div>
                  <Button variant="outline-primary" className="me-2" onClick={() => handleMakeOffer(load)}>
                    Make Offer
                  </Button>
                </div>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <Table bordered hover responsive>
                <tbody>
                  <tr><td><strong>Weight:</strong></td><td>{load.loadWeight} lbs</td></tr>
                  <tr><td><strong>Equipment:</strong></td><td>{load.equipment}</td></tr>
                  <tr><td><strong>Payment:</strong></td><td>${load.payment}</td></tr>
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* ✅ Offer Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Make an Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter Offer Price</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max={selectedLoad?.payment}
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleOfferSubmit}>Submit Offer</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
