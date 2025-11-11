import React from "react";
import Sidebar from "./Sidebar";
import "./DashboardLayout.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <h4 className="topbar-title">Admin Panel</h4>
        </div>
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
