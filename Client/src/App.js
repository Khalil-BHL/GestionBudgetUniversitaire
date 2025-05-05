import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Login from "./LoginPage/login";

// Professor components
import ProfDashboard from "./ProfInterface/DashboardPage/dashboard";
import ProfLayout from "./ProfInterface/Layout";
import RequestPage from "./ProfInterface/RequestPage/RequestPage";

// Placeholder components for other roles (to be implemented later)
const ComptableDashboard = () => (
  <div>Comptable Dashboard (To be implemented)</div>
);
const ComptableLayout = ({ children }) => (
  <div className="dashboard-container">{children}</div>
);

const DirectionDashboard = () => (
  <div>Direction Dashboard (To be implemented)</div>
);
const DirectionLayout = ({ children }) => (
  <div className="dashboard-container">{children}</div>
);

const ChefDepartementDashboard = () => (
  <div>Chef Departement Dashboard (To be implemented)</div>
);
const ChefDepartementLayout = ({ children }) => (
  <div className="dashboard-container">{children}</div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Professor routes */}
        <Route path="/professor" element={<ProfLayout />}>
          <Route path="dashboard" element={<ProfDashboard />} />
          <Route path="request" element={<RequestPage />} />
        </Route>

        {/* Comptable routes */}
        <Route path="/comptable" element={<ComptableLayout />}>
          <Route path="dashboard" element={<ComptableDashboard />} />
        </Route>

        {/* Direction routes */}
        <Route path="/direction" element={<DirectionLayout />}>
          <Route path="dashboard" element={<DirectionDashboard />} />
        </Route>

        {/* Chef Departement routes */}
        <Route path="/chef-departement" element={<ChefDepartementLayout />}>
          <Route path="dashboard" element={<ChefDepartementDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
