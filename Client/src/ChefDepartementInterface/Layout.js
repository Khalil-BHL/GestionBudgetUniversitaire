import "@fortawesome/fontawesome-free/css/all.min.css";
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout() {
  const navigate = useNavigate(); // Utilisation de useNavigate pour la redirection

  const handleLogout = () => {
    // Rediriger vers la page de login
    navigate("/"); // Redirection vers la page de login
  };

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
              <Link to="/professor/requests" className="nav-item">
                <i className="fas fa-list icon"></i>
                <span>Demandes des Professeurs</span>
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
        <button className="logout-button" onClick={handleLogout}>
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
