import React, { useState } from 'react';
import { Form, Button, Card, Container, Modal } from 'react-bootstrap';
import './custom.css';

function SupportForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    corporateId: '',
    contactNumber: '',
    issueDetails: ''
  });

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('https://ofj43beg9k.execute-api.us-east-1.amazonaws.com/prod/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const result = await response.json();
    console.log(result);

    // Show confirmation modal
    handleShow();

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      corporateId: '',
      contactNumber: '',
      issueDetails: ''
    });
  } catch (error) {
    console.error('Failed to submit:', error);
    alert('There was an error submitting your request. Please try again.');
  }
};


  return (
    <div className="support-form-wrapper">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="p-4 support-card">
          <Card.Img variant="top" src="/stacklabs.svg" className="logo" />
          <Card.Body>
            <Card.Title className="text-center mb-4">Support Portal</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formFullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Corporate Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCorporateId">
                <Form.Label>Corporate ID</Form.Label>
                <Form.Control
                  type="text"
                  name="corporateId"
                  value={formData.corporateId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formContact">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formIssueDetails">
                <Form.Label>Issue Details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="issueDetails"
                  value={formData.issueDetails}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button variant="customGreen" type="submit" className="w-100">
                Submit Request
              </Button>
            </Form>
          </Card.Body>

          <Modal show={showModal} onHide={handleClose} centered size="sm" dialogClassName="custom-modal-sm">
            <Modal.Header closeButton>
              <Modal.Title>Request Submitted</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Your support request has been submitted. Our team will get back to you shortly.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="customGreen" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Card>
      </Container>
    </div>
  );
}

export default SupportForm;
