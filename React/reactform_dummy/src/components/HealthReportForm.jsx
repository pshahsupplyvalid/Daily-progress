import React, { useState, useEffect } from "react";
import HealthReportTable from "./HealthReportTable";

export default function HealthReportForm() {
  const [reportType, setReportType] = useState("");
  const [dispatchType, setDispatchType] = useState("");
  const [data, setData] = useState([]);

  // Mock data (simulating API)
  const allData = [
    { id: 1, branchName: "Mumbai Branch", systemHealth: "Good", lastSyncTime: "2025-11-06 10:00", remarks: "All OK", reportType: "Dispatch", dispatchType: "Normal" },
    { id: 2, branchName: "Pune Branch", systemHealth: "Warning", lastSyncTime: "2025-11-06 12:30", remarks: "Minor Delay", reportType: "Receive", dispatchType: "CA" },
    { id: 3, branchName: "Delhi Branch", systemHealth: "Critical", lastSyncTime: "2025-11-05 09:45", remarks: "Sync Failed", reportType: "Move", dispatchType: "Normal" },
  ];

  useEffect(() => {
    if (!reportType && !dispatchType) {
      setData(allData);
    } else {
      let filtered = allData;
      if (reportType) filtered = filtered.filter(d => d.reportType === reportType);
      if (dispatchType) filtered = filtered.filter(d => d.dispatchType === dispatchType);
      setData(filtered);
    }
  }, [reportType, dispatchType]);

  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <h3>Health Report Form</h3>

      {/* Filters */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <label><b>Select Report Type:</b></label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            <option value="">-- Select --</option>
            <option value="Dispatch">Dispatch</option>
            <option value="Receive">Receive</option>
            <option value="Move">Move</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label><b>Select Dispatch Type:</b></label>
          <select
            value={dispatchType}
            onChange={(e) => setDispatchType(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            <option value="">-- Select --</option>
            <option value="Normal">Normal</option>
            <option value="CA">CA</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <HealthReportTable data={data} />
    </div>
  );
}
