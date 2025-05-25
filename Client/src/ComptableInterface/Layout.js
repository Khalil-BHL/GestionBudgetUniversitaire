import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { MdDashboard, MdNotifications, MdLogout } from 'react-icons/md';
import './Layout.css';

function Layout() {
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
      <div className="sidebar">
        <div className="logo">
          <h1><span className="uni-part">UNI</span><span className="budget-part">BUDGET</span></h1>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/comptable/dashboard" className="nav-item">
                <span className="icon"><MdDashboard /></span>
                <span>Tableau de bord</span>
              </Link>
            </li>
            <li>
              <Link to="/comptable/notifications" className="nav-item">
                <span className="icon"><MdNotifications /></span>
                <span>Envoyer Notification</span>
              </Link>
            </li>
          </ul>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <MdLogout style={{ marginRight: '8px' }} />
          Déconnexion
        </button>
      </div>
      
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;