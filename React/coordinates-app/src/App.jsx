import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import * as XLSX from "xlsx";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Red Leaflet marker icon
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to auto-fit map to markers
const FitBounds = ({ markers }) => {
  const map = useMap();
  if (markers.length > 0) {
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lon]));
    map.fitBounds(bounds);
  }
  return null;
};

function App() {
  const [file, setFile] = useState(null);
  const [markers, setMarkers] = useState([]);

  // File selected
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMarkers([]); // Clear previous markers
  };

  // Process file on submit
  const handleSubmit = () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet);

      const markerData = rows
        .filter(
          (row) =>
            !isNaN(parseFloat(row["Latitude (Decimal)"])) &&
            !isNaN(parseFloat(row["Longitude (Decimal)"]))
        )
        .map((row) => ({
          lat: parseFloat(row["Latitude (Decimal)"]),
          lon: parseFloat(row["Longitude (Decimal)"]),
          name: row["State / UT Name"] || "Unknown",
        }));

      setMarkers(markerData);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">📍 Upload Excel File to Show Coordinates</h2>
        <p className="text-muted">Select an Excel file and click Submit to view coordinates on the map.</p>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-md-5 text-center">
          <input
            type="file"
            className="form-control form-control-lg mb-3"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
          />
          <button
            className="btn btn-gradient w-50 fw-bold"
            onClick={handleSubmit}
          >
            <i className="bi bi-upload me-2"></i> Submit
          </button>
        </div>
      </div>

      <div className="map-container shadow rounded">
        <MapContainer
          center={[20, 78]}
          zoom={5}
          style={{ height: "600px", width: "100%" }}
          keyboard={true}
          scrollWheelZoom={true}
          dragging={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {markers.map((m, idx) => (
            <Marker key={idx} position={[m.lat, m.lon]} icon={redIcon}>
              <Popup>
                <b>{m.name}</b>
                <br />
                Lat: {m.lat}
                <br />
                Lon: {m.lon}
              </Popup>
            </Marker>
          ))}

          <FitBounds markers={markers} />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
