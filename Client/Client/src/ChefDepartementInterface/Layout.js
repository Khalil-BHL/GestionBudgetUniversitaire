import React, { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { MdDashboard, MdList, MdNotifications, MdLogout } from 'react-icons/md';
import './Layout.css';
import { NotificationContext } from './Notifications/NotificationContext';

function Layout() {
  const navigate = useNavigate();
  const { unreadCount } = useContext(NotificationContext);
  
  const handleLogout = () => {
    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h1><span className="uni-part">UNI</span><span className="budget-part">BUDGET</span></h1>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/chef-departement/dashboard" className="nav-item">
                <span className="icon"><MdDashboard /></span>
                <span>Tableau de bord</span>
              </Link>
            </li>
            <li>
              <Link to="/chef-departement/requests" className="nav-item">
                <span className="icon"><MdList /></span>
                <span>Demandes à valider</span>
              </Link>
            </li>
            <li>
              <Link to="/chef-departement/notifications" className="nav-item">
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
          <MdLogout style={{ marginRight: '8px' }} />
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
