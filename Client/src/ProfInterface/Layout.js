import React from "react";
import {
  MdAddCircleOutline,
  MdDashboard,
  MdLogout,
  MdNotifications,
  MdBarChart ,
} from "react-icons/md";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout() {
  const navigate = useNavigate();

  // Fonction simulant la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
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
                <span className="icon">
                  <MdDashboard />
                </span>
                <span>Tableau de bord</span>
              </Link>
            </li>
            <li>
              <Link to="/professor/request" className="nav-item">
                <span className="icon">
                  <MdAddCircleOutline />
                </span>
                <span>Nouvelle demande</span>
              </Link>
            </li>
            <li>
              <Link to="/professor/notifications" className="nav-item">
                <span className="icon">
                  <MdNotifications />
                </span>
                <span>Notifications</span>
              </Link>
            </li>
            <li>
              <Link to="/professor/statistics" className="nav-item">
                <span className="icon">
                  <MdBarChart/>
                </span>
                <span>Statistiques</span>
              </Link>
            </li>
          </ul>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <MdLogout style={{ marginRight: "8px" }} />
          Déconnexion
        </button>
      </div>

      {/* Main content - will be replaced by the current route */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
