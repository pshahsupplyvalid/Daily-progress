import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { healthReportForm } from "./healthReportFormJson";

export default function SectionBuilder({ formData, handleChange }) {
  return (
    <>
      {healthReportForm.map((section, i) => (
        <div key={i} className="mb-4 p-4 border rounded bg-white shadow-sm">
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
                        <option key={k} value={opt}>
                          {opt}
                        </option>
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
    </>
  );
}
