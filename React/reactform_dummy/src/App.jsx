import React, { useState } from "react";
import { Form, Row, Col, Button, Table } from "react-bootstrap";
import "./App.css";

export default function App() {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form Submitted Successfully!");
    console.log("Form Data:", formData);
  };

  const handleReset = () => {
    setFormData({});
  };

  return (
    <div className="page-container">
      <div className="form-wrapper shadow-sm bg-white">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold">CREATE HEALTH REPORT</h5>
          <Button variant="outline-primary" size="sm">
            ← Go Back
          </Button>
        </div>

        <Form onSubmit={handleSubmit}>
          {/* Top Section */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Report Type *</Form.Label>
                <Form.Select name="reportType" value={formData.reportType || ""} onChange={handleChange}>
                  <option value="">-- Select Report Type --</option>
                  <option value="Receive">Receive</option>
                  <option value="Dispatch">Dispatch</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Train / Truck *</Form.Label>
                <Form.Select name="trainTruck" value={formData.trainTruck || ""} onChange={handleChange}>
                  <option value="">-- Select Train / Truck --</option>
                  <option value="Train">Train</option>
                  <option value="Truck">Truck</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Client *</Form.Label>
                <Form.Select name="client" value={formData.client || ""} onChange={handleChange}>
                  <option value="">-- Select Client --</option>
                  <option value="Client 1">Client 1</option>
                  <option value="Client 2">Client 2</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Company *</Form.Label>
                <Form.Select name="company" value={formData.company || ""} onChange={handleChange}>
                  <option value="">-- Select Company --</option>
                  <option value="Company 1">Company 1</option>
                  <option value="Company 2">Company 2</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Weight Section */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Truck Number *</Form.Label>
                <Form.Control
                  type="text"
                  name="truckNumber"
                  placeholder="Truck Number"
                  value={formData.truckNumber || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Gross Weight *</Form.Label>
                <Form.Control
                  type="text"
                  name="grossWeight"
                  placeholder="Gross Weight"
                  value={formData.grossWeight || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Net Weight *</Form.Label>
                <Form.Control
                  type="text"
                  name="netWeight"
                  placeholder="Net Weight"
                  value={formData.netWeight || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tare Weight *</Form.Label>
                <Form.Control
                  type="text"
                  name="tareWeight"
                  placeholder="Tare Weight"
                  value={formData.tareWeight || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Additional Details */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date *</Form.Label>
                <Form.Control type="datetime-local" name="date" value={formData.date || ""} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Staining Colour *</Form.Label>
                <Form.Select name="stainingColour" value={formData.stainingColour || ""} onChange={handleChange}>
                  <option value="">-- Select Staining Colour --</option>
                  <option value="Red">Red</option>
                  <option value="Yellow">Yellow</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Staining Colour Percent, Bag Count, Size */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Staining Colour Percent *</Form.Label>
                <Form.Control
                  type="text"
                  name="stainingColourPercent"
                  placeholder="Staining Colour Percent"
                  value={formData.stainingColourPercent || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Bag Count *</Form.Label>
                <Form.Control
                  type="text"
                  name="bagCount"
                  placeholder="Bag Count"
                  value={formData.bagCount || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Size, Black Smut Fields */}
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Size *</Form.Label>
                <Form.Select name="size" value={formData.size || ""} onChange={handleChange}>
                  <option value="">-- Select Size --</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Black Smut Onion *</Form.Label>
                <Form.Select name="blackSmutOnion" value={formData.blackSmutOnion || ""} onChange={handleChange}>
                  <option value="">-- Select Black Smut Onion --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Black Smut Percent, Sprouted Onion */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Black Smut Percent *</Form.Label>
                <Form.Control
                  type="text"
                  name="blackSmutPercent"
                  placeholder="Black Smut Percent"
                  value={formData.blackSmutPercent || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Sprouted Onion *</Form.Label>
                <Form.Select name="sproutedOnion" value={formData.sproutedOnion || ""} onChange={handleChange}>
                  <option value="">-- Select Sprouted Onion --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Onion Skin, Moisture */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Onion Skin *</Form.Label>
                <Form.Select name="onionSkin" value={formData.onionSkin || ""} onChange={handleChange}>
                  <option value="">-- Select Onion Skin --</option>
                  <option value="Thick">Double</option>
                  <option value="Thin">Single</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Moisture *</Form.Label>
                <Form.Select name="moisture" value={formData.moisture || ""} onChange={handleChange}>
                  <option value="">-- Select Moisture --</option>
                  <option value="Low">Dry</option>
                  <option value="Medium">Wet</option>
                
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Spoiled Onion, Representative Name */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Spoiled Onion *</Form.Label>
                <Form.Select name="spoiledOnion" value={formData.spoiledOnion || ""} onChange={handleChange}>
                  <option value="">-- Select Spoiled Onion --</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Representative Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="representativeName"
                  placeholder="Representative Name"
                  value={formData.representativeName || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Assayer Name & Comment */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Assayer Name *</Form.Label>
                <Form.Select name="assayerName" value={formData.assayerName || ""} onChange={handleChange}>
                  <option value="">-- Select Assayer Name --</option>
                  <option value="Assayer 1">Assayer 1</option>
                  <option value="Assayer 2">Assayer 2</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  type="text"
                  name="comment"
                  placeholder="Comment"
                  value={formData.comment || ""}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* File Upload Section */}
          <h6 className="fw-bold mt-4 mb-3">Files</h6>
          <Table bordered>
            <thead>
              <tr>
                <th style={{ width: "10%" }}>S.No</th>
                <th>Files</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <div className="d-flex align-items-center">
                    <Form.Control type="file" />
                    <Button variant="danger" size="sm" className="ms-2">
                      Clear
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>

          {/* Buttons */}
          <div className="text-center mt-4">
            <Button variant="secondary" className="me-3" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
