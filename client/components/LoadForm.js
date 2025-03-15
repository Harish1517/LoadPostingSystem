import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const LoadForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    payment: "",
    loadLength: "",
    loadWeight: "",
    equipment: "Flatbed",
    pickupFrom: null, 
    pickupTo: null, 
    distance: "",
    commodity: "",
    additionalInfo: "",
    contact: {
      name: "",
      phone: "",
      email: "",
    },
    status: "pending",
  });

  // ✅ Populate form when `initialData` is received (for editing)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        origin: initialData.origin || "",
        destination: initialData.destination || "",
        payment: initialData.payment || "",
        loadLength: initialData.loadLength || "",
        loadWeight: initialData.loadWeight || "",
        equipment: initialData.equipment || "Flatbed",
        pickupFrom: initialData.pickupFrom ? new Date(initialData.pickupFrom) : null,
        pickupTo: initialData.pickupTo ? new Date(initialData.pickupTo) : null,
        distance: initialData.distance || "",
        commodity: initialData.commodity || "",
        additionalInfo: initialData.additionalInfo || "",
        contact: {
          name: initialData.contact?.name || "",
          phone: initialData.contact?.phone || "",
          email: initialData.contact?.email || "",
        },
        status: initialData.status || "pending",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    if (["name", "phone", "email"].includes(e.target.name)) {
      setFormData({
        ...formData,
        contact: { ...formData.contact, [e.target.name]: e.target.value },
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFormData({ ...formData, pickupFrom: start, pickupTo: end });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">🚛 Load Details Form</h2>
      <Form onSubmit={handleSubmit} className="p-4 shadow-lg bg-white rounded">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>📍 Origin</Form.Label>
              <Form.Control type="text" name="origin" value={formData.origin} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>📍 Destination</Form.Label>
              <Form.Control type="text" name="destination" value={formData.destination} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>💰 Payment ($)</Form.Label>
              <Form.Control type="number" name="payment" value={formData.payment} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>📏 Load Length (Feet)</Form.Label>
              <Form.Control type="number" name="loadLength" value={formData.loadLength} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>⚖ Load Weight (lbs)</Form.Label>
              <Form.Control type="number" name="loadWeight" value={formData.loadWeight} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>🚚 Truck Equipment</Form.Label>
              <Form.Select name="equipment" value={formData.equipment} onChange={handleChange}>
                <option value="Flatbed">Flatbed</option>
                <option value="Reefer">Reefer</option>
                <option value="Dry Van">Dry Van</option>
                <option value="Step Deck">Step Deck</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>📅 Pickup Date Range</Form.Label>
              <DatePicker
                selectsRange
                startDate={formData.pickupFrom}
                endDate={formData.pickupTo}
                onChange={handleDateChange}
                className="form-control"
                placeholderText="Select pickup date range"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>📍 Distance (Miles)</Form.Label>
              <Form.Control type="number" name="distance" value={formData.distance} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>📦 Commodity</Form.Label>
              <Form.Control type="text" name="commodity" value={formData.commodity} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>ℹ Additional Info</Form.Label>
              <Form.Control type="text" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <h4 className="mt-3">📞 Contact Information</h4>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.contact.name} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="tel" name="phone" value={formData.contact.phone} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.contact.email} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center">
          <Button variant="primary" type="submit" className="mt-3">
            Save Changes
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default LoadForm;
