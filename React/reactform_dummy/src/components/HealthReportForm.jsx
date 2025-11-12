import React, { useState, useRef } from "react";
import { Form, Button, Container, Table, Row, Col } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";



export default function HealthReportForm() {
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleViewFile = () => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, "_blank");
    } else {
      alert("No file selected to view!");
    }
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData, "File:", file);
    alert("Form Submitted Successfully!");
  };

  const handleReset = () => {
    setFormData({});
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGoBack = () => {
    window.history.back();
  };
  
const section = [
  {
    title: "Basic Details",
    name: "basicDetails",
    children: [
      {
        name: "reportType",
        label: "Report Type",
        type: "select",
        required: true,
        options: ["Receive", "Dispatch"],
      },
      {
        name: "trainTruck",
        label: "Train / Truck",
        type: "select",
        required: true,
        options: ["Train", "Truck"],
      },
      {
        name: "client",
        label: "Client",
        type: "select",
        required: true,
        options: ["NAFED", "NCCF"],
      },
      {
        name: "company",
        label: "Company",
        type: "select",
        required: true,
        options: ["Company 1", "Company 2"],
      },
    ],
  },
  {
    title: "Weight Details",
    name: "weightDetails",
    children: [
      { name: "truckNumber", label: "Truck Number", type: "text", required: true },
      { name: "grossWeight", label: "Gross Weight", type: "number", required: true },
      { name: "netWeight", label: "Net Weight", type: "number", required: true },
      { name: "tareWeight", label: "Tare Weight", type: "number", required: true },
    ],
  },
  {
    title: "Onion Quality Parameters",
    name: "onionQuality",
    children: [
      { name: "stainingColour", label: "Staining Colour", type: "select", options: ["Yes", "No"] },
      { name: "stainingColourPercent", label: "Staining Colour Percent", type: "number" },
      { name: "bagCount", label: "Bag Count", type: "number" },
      { name: "blackSmutOnion", label: "Black Smut Onion", type: "select", options: ["Yes", "No"] },
      { name: "blackSmutPercent", label: "Black Smut Percent", type: "number" },
      { name: "sproutedOnion", label: "Sprouted Onion", type: "select", options: ["Yes", "No"] },
      { name: "onionSkin", label: "Onion Skin", type: "select", options: ["Single", "Double"] },
      { name: "onionSkinPercent", label: "Onion Skin Percent", type: "number" },
      { name: "moisture", label: "Moisture", type: "select", options: ["Dry", "Wet"] },
      { name: "moisturePercent", label: "Moisture Percent", type: "number" },
      { name: "spoiledOnion", label: "Spoiled Onion", type: "select", options: ["Yes", "No"] },
      { name: "spoiledPercent", label: "Spoiled Percent", type: "number" },
      { name: "representativeName", label: "Representative Name", type: "text" },
      { name: "assayerName", label: "Assayer Name", type: "select", options: ["Assayer 1", "Assayer 2"] },
      { name: "comment", label: "Comment", type: "text" },
    ],
  },
];

  return (
    <Container
      fluid
      className="p-5"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <div className="bg-white p-4 rounded shadow w-100">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold m-0">CREATE HEALTH REPORT</h4>
          <Button
            variant="outline-primary"
            onClick={handleGoBack}
            className="d-flex align-items-center"
          >
            <ArrowLeft className="me-2" />
            Go Back
          </Button>
        </div>

        {/* Dynamic Form */}
        <Form onSubmit={handleSubmit}>
          {section.map((section, i) => (
            <div key={i} className="mb-4 p-3 border rounded">
              <h5 className="fw-bold mb-3">{section.title}</h5>
              <Row>
                {section.children.map((field, j) => (
                  <Col md={6} key={j} className="mb-3">
                    <Form.Group>
                      <Form.Label>
                        {field.label} {field.required && <span className="text-danger">*</span>}
                      </Form.Label>
                      {field.type === "select" ? (
                        <Form.Select
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleChange}
                        >
                          <option value="">-- Select {field.label} --</option>
                          {field.options?.map((opt, k) => (
                            <option key={k} value={opt}>{opt}</option>
                          ))}
                        </Form.Select>
                      ) : (
                        <Form.Control
                          type={field.type}
                          name={field.name}
                          placeholder={field.label}
                          value={formData[field.name] || ""}
                          onChange={handleChange}
                        />
                      )}
                    </Form.Group>
                  </Col>
                ))}
              </Row>
            </div>
          ))}

          {/* File Upload Section */}
          <div className="mt-4">
            <h6 className="fw-bold mb-3">Files</h6>
            <Table bordered responsive>
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>S.No</th>
                  <th>File</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="success"
                        size="sm"
                        className="ms-2"
                        onClick={handleViewFile}
                        disabled={!file}
                      >
                        View
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="ms-2"
                        onClick={handleClearFile}
                        disabled={!file}
                      >
                        Clear
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

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
    </Container>
  );
}
