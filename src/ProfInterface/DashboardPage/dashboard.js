import React, { useState } from 'react';
import './dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser, faDesktop, faSearch, faChevronDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Plus récent');
  
  // Sample data for the dashboard
  const stats = [
    { title: 'Total Customers', value: '5,423', change: '+16%', icon: faUsers, color: '#e6f7ef' },
    { title: 'Members', value: '1,893', change: '-1%', icon: faUser, color: '#e6f7ef' },
    { title: 'Active Now', value: '189', icon: faDesktop, color: '#e6f7ef' }
  ];
  
  // Sample data for the table
  const requests = [
    { id: '#000004', description: 'PCx4', type: 'Electronique', submissionDate: '23/04/2024', validationDate: '23/04/2024', status: 'Validée' },
    { id: '#000004', description: 'PC', type: 'Electronique', submissionDate: '23/04/2024', validationDate: '23/04/2024', status: 'Approuvée' },
    { id: '#000004', description: 'PC', type: 'Electronique', submissionDate: '23/04/2024', validationDate: '23/04/2024', status: 'En traitement' },
    { id: '#000004', description: 'PC', type: 'Electronique', submissionDate: '23/04/2024', validationDate: '23/04/2024', status: 'En livraison' },
    { id: '#000004', description: 'PC', type: 'Electronique', submissionDate: '23/04/2024', validationDate: '23/04/2024', status: 'Livrée' },
    { id: '#000004', description: 'PC', type: 'Electronique', submissionDate: '23/04/2024', validationDate: '23/04/2024', status: 'Rejetée' },
    { id: '#000004', description: 'PC', type: 'Electronique', submissionDate: '23/04/2024', validationDate: '23/04/2024', status: 'Active' },
    { id: '#000004', description: 'PC', type: 'Electronique', submissionDate: '23/04/2024', validationDate: '23/04/2024', status: 'Inactive' }
  ];
  
  // Function to get status badge class based on status
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Validée': return 'status-validated';
      case 'Approuvée': return 'status-approved';
      case 'En traitement': return 'status-processing';
      case 'En livraison': return 'status-delivery';
      case 'Livrée': return 'status-delivered';
      case 'Rejetée': return 'status-rejected';
      case 'Active': return 'status-active';
      case 'Inactive': return 'status-inactive';
      default: return '';
    }
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
            <li className="active">
              <div className="nav-item">
                <span className="icon">📊</span>
                <span>Tableau de bord</span>
              </div>
            </li>
            <li>
              <div className="nav-item">
                <span className="icon">➕</span>
                <span>Nouvelle demande</span>
              </div>
            </li>
            <li>
              <div className="nav-item">
                <span className="icon">🔔</span>
                <span>Notifications</span>
              </div>
            </li>
          </ul>
        </nav>
        <button className="logout-button">Déconnexion</button>
      </div>
      
      {/* Main content */}
      <div className="main-content">
        <header className="dashboard-header">
          <h2>Bonjour 👋</h2>
        </header>
        
        {/* Stats cards */}
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                <FontAwesomeIcon icon={stat.icon} />
              </div>
              <div className="stat-info">
                <p className="stat-title">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
                {stat.change && (
                  <p className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {stat.change} this month
                  </p>
                )}
              </div>
              {index === 2 && (
                <div className="active-users">
                  <div className="user-avatars">
                    <span className="avatar">👤</span>
                    <span className="avatar">👤</span>
                    <span className="avatar">👤</span>
                    <span className="avatar">👤</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Requests section */}
        <div className="requests-section">
          <div className="requests-header">
            <h3>Les demandes</h3>
            <div className="requests-actions">
              <div className="search-container">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Rechercher" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="sort-container">
                <span>Trier par: </span>
                <div className="sort-dropdown">
                  <button className="sort-button">
                    {sortBy} <FontAwesomeIcon icon={faChevronDown} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Requests table */}
          <div className="requests-table">
            <table>
              <thead>
                <tr>
                  <th>ID Demande</th>
                  <th>Description</th>
                  <th>Type de Marché</th>
                  <th>Date de Soumission</th>
                  <th>Validation Chef Département</th>
                  <th>État</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request, index) => (
                  <tr key={index}>
                    <td>{request.id}</td>
                    <td>{request.description}</td>
                    <td>{request.type}</td>
                    <td>{request.submissionDate}</td>
                    <td>{request.validationDate}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="pagination">
            <button className="pagination-arrow"><FontAwesomeIcon icon={faChevronLeft} /></button>
            <button className="pagination-number active">1</button>
            <button className="pagination-number">2</button>
            <button className="pagination-number">3</button>
            <button className="pagination-number">4</button>
            <span className="pagination-dots">...</span>
            <button className="pagination-number">40</button>
            <button className="pagination-arrow"><FontAwesomeIcon icon={faChevronRight} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;