import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import React, { useEffect, useState } from "react";
import "./dashboard.css";

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState([]);
  const [requests, setRequests] = useState([]);

  // Fetch data from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dashboard")
      .then((res) => {
        setStats(res.data.stats);
        setRequests(res.data.requests);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des données", err);
      });
  }, []);

  // Function to get status badge class based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Brouillon":
        return "status-draft";
      case "Soumis":
        return "status-submitted";
      case "En cours d'examen":
        return "status-review";
      case "Approuvé":
        return "status-approved";
      case "Rejeté":
        return "status-rejected";
      case "Commandé":
        return "status-ordered";
      case "Reçu":
        return "status-received";
      default:
        return "";
    }
  };

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h2>Bonjour 👋</h2>
      </header>

      {/* Stats cards */}
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <i className={`fa ${stat.icon || "fa-chart-bar"}`}></i>{" "}
            </div>
            <div className="stat-info">
              <p className="stat-title">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
              {stat.change && (
                <p
                  className={`stat-change ${
                    stat.change.startsWith("+") ? "positive" : "negative"
                  }`}
                >
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
              <i className="fa fa-search search-icon"></i>
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
                  Plus récent <span>▼</span>
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

                  {/* Type de marché */}
                  <td>{request.marche_type || "—"}</td>

                  {/* Date de soumission */}
                  <td>
                    {request.created_at
                      ? new Date(request.created_at).toLocaleDateString()
                      : "—"}
                  </td>

                  {/* Validation chef département : seulement si status_id === 4 */}
                  <td>
                    {request.status_id === 4 && request.updated_at
                      ? new Date(request.updated_at).toLocaleDateString()
                      : "—"}
                  </td>

                  {/* Statut */}
                  <td>
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        request.status
                      )}`}
                    >
                      <i
                        className={`fa fa-circle ${getStatusBadgeClass(
                          request.status
                        )}`}
                      ></i>{" "}
                      {/* Icône de statut */}
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
          <button className="pagination-arrow">
            <i className="fa fa-arrow-left"></i>{" "}
          </button>
          <button className="pagination-number active">1</button>
          <button className="pagination-number">2</button>
          <button className="pagination-number">3</button>
          <button className="pagination-number">4</button>
          <span className="pagination-dots">...</span>
          <button className="pagination-number">40</button>
          <button className="pagination-arrow">
            <i className="fa fa-arrow-right"></i>{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
