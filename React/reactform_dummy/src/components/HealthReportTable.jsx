import React, { useState } from "react";

export default function CreateHealthReport() {
  const [form, setForm] = useState({
    reportType: "",
    trainTruck: "",
    client: "",
    company: "",
    truckNumber: "",
    grossWeight: "",
    tareWeight: "",
    netWeight: "",
    date: "",
    stainingColour: "",
    stainingColourPercent: "",
    bagCount: "",
    size: "",
    blackSmut: "",
    sproutedOnion: "",
    onionSkin: "",
    moisture: "",
    spoiledOnion: "",
    blackSmutPercent: "",
    sproutedPercent: "",
    onionSkinPercent: "",
    moisturePercent: "",
    spoiledPercent: "",
    representativeName: "",
    assayerName: "",
    comment: "",
    files: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e, index) => {
    const files = [...form.files];
    files[index] = e.target.files[0];
    setForm({ ...form, files });
  };

  const addRow = () => {
    setForm({ ...form, files: [...form.files, null] });
  };

  const handleReset = () => {
    setForm({
      reportType: "",
      trainTruck: "",
      client: "",
      company: "",
      truckNumber: "",
      grossWeight: "",
      tareWeight: "",
      netWeight: "",
      date: "",
      stainingColour: "",
      stainingColourPercent: "",
      bagCount: "",
      size: "",
      blackSmut: "",
      sproutedOnion: "",
      onionSkin: "",
      moisture: "",
      spoiledOnion: "",
      blackSmutPercent: "",
      sproutedPercent: "",
      onionSkinPercent: "",
      moisturePercent: "",
      spoiledPercent: "",
      representativeName: "",
      assayerName: "",
      comment: "",
      files: [],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", form);
    alert("Form submitted successfully!");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      <h3 style={{ marginBottom: "20px" }}>CREATE HEALTH REPORT</h3>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* Row 1 */}
          <div>
            <label>Report Type *</label>
            <select name="reportType" value={form.reportType} onChange={handleChange}>
              <option value="">-- Select Report Type --</option>
              <option value="Dispatch">Dispatch</option>
              <option value="Receive">Receive</option>
              <option value="Move">Move</option>
            </select>
          </div>
          <div>
            <label>Train / Truck *</label>
            <select name="trainTruck" value={form.trainTruck} onChange={handleChange}>
              <option value="">-- Select Train / Truck --</option>
              <option value="Train">Train</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          {/* Row 2 */}
          <div>
            <label>Client *</label>
            <input type="text" name="client" value={form.client} onChange={handleChange} placeholder="Client" />
          </div>
          <div>
            <label>Company *</label>
            <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Company" />
          </div>

          {/* Row 3 */}
          <div>
            <label>Truck Number *</label>
            <input type="text" name="truckNumber" value={form.truckNumber} onChange={handleChange} placeholder="Truck Number" />
          </div>
          <div>
            <label>Gross Weight *</label>
            <input type="number" name="grossWeight" value={form.grossWeight} onChange={handleChange} placeholder="Gross Weight" />
          </div>

          {/* Row 4 */}
          <div>
            <label>Tare Weight *</label>
            <input type="number" name="tareWeight" value={form.tareWeight} onChange={handleChange} placeholder="Tare Weight" />
          </div>
          <div>
            <label>Net Weight *</label>
            <input type="number" name="netWeight" value={form.netWeight} onChange={handleChange} placeholder="Net Weight" />
          </div>

          {/* Row 5 */}
          <div>
            <label>Date *</label>
            <input type="datetime-local" name="date" value={form.date} onChange={handleChange} />
          </div>
          <div>
            <label>Bag Count *</label>
            <input type="number" name="bagCount" value={form.bagCount} onChange={handleChange} placeholder="Bag Count" />
          </div>

          {/* Row 6 */}
          <div>
            <label>Staining Colour *</label>
            <select name="stainingColour" value={form.stainingColour} onChange={handleChange}>
              <option value="">-- Select Staining Colour --</option>
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </div>
          <div>
            <label>Staining Colour Percent *</label>
            <input type="number" name="stainingColourPercent" value={form.stainingColourPercent} onChange={handleChange} placeholder="%" />
          </div>

          {/* Row 7 */}
          <div>
            <label>Size *</label>
            <select name="size" value={form.size} onChange={handleChange}>
              <option value="">-- Select Size --</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>
          <div>
            <label>Black Smut *</label>
            <input type="text" name="blackSmut" value={form.blackSmut} onChange={handleChange} placeholder="Black Smut" />
          </div>

          {/* Continue as needed for other fields */}
          <div>
            <label>Assayer Name *</label>
            <input type="text" name="assayerName" value={form.assayerName} onChange={handleChange} placeholder="Assayer Name" />
          </div>
          <div>
            <label>Comment *</label>
            <input type="text" name="comment" value={form.comment} onChange={handleChange} placeholder="Comment" />
          </div>
        </div>

        {/* File Upload Section */}
        <div style={{ marginTop: "30px" }}>
          <h4>Files Upload</h4>
          {form.files.map((file, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <input type="file" onChange={(e) => handleFileChange(e, index)} />
              <button type="button" onClick={() => handleFileChange({ target: { files: [null] } }, index)} style={{ background: "red", color: "white", padding: "5px 10px" }}>Clear</button>
            </div>
          ))}
          <button type="button" onClick={addRow} style={{ marginTop: "10px" }}>Add Row</button>
        </div>

        {/* Buttons */}
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <button type="button" onClick={handleReset} style={{ marginRight: "20px", padding: "10px 20px" }}>Reset</button>
          <button type="submit" style={{ backgroundColor: "blue", color: "white", padding: "10px 20px" }}>Submit</button>
        </div>
      </form>
    </div>
  );
}
