import React, { useContext } from "react";
import {
  MdAddCircleOutline,
  MdDashboard,
  MdLogout,
  MdNotifications,
} from "react-icons/md";
import { Link, Outlet } from "react-router-dom";
import "./Layout.css";
import { NotificationContext } from "./Notifications/NotificationContext";

function Layout() {
  const { unreadCount } = useContext(NotificationContext);

  // Fonction simulant la déconnexion
  const handleLogout = () => {
    // Clear all session data
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    
    // Clear browser history and redirect to login
    window.history.pushState(null, '', '/');
    window.history.pushState(null, '', '/');
    window.history.pushState(null, '', '/');
    window.history.replaceState(null, '', '/');
    
    // Force reload to clear any cached data
    window.location.href = '/';
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
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </span>
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="notification-indicator"></span>
                )}
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
