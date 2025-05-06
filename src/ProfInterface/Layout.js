import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./Layout.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Layout() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h1>
            <span className="uni-part">UNI</span>
            <span className="budget-part">BUDGET</span>
          </h1>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/professor/dashboard" className="nav-item">
                <i className="fas fa-chart-line icon"></i>
                <span>Tableau de bord</span>
              </Link>
            </li>
            <li>
              <Link to="/professor/request" className="nav-item">
                <i className="fas fa-plus-circle icon"></i>
                <span>Nouvelle demande</span>
              </Link>
            </li>
            <li>
              <div className="nav-item">
                <i className="fas fa-bell icon"></i>
                <span>Notifications</span>
              </div>
            </li>
          </ul>
        </nav>
        <button className="logout-button">
          <i className="fas fa-sign-out-alt icon"></i> Déconnexion
        </button>
      </div>

      {/* Main content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
