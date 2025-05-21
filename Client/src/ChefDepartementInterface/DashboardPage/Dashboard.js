import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import React, { useEffect, useState } from "react";
import "./dashboard.css";

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const requestsPerPage = 5;

  // Fetch data once
  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Check if user is logged in
    if (!user) {
      console.error("Utilisateur non connecté");
      // Optionally redirect to login page
      window.location.href = "/";
      return;
    }

    // Verify user role
    if (user.role !== 'Chef Departement') {
      console.error("Accès non autorisé");
      window.location.href = "/";
      return;
    }
    
    axios
      .get("http://localhost:5000/api/dashboard", {
        params: {
          userId: user.id,
          userRole: user.role
        }
      })
      .then((res) => {
        // Les demandes sont déjà filtrées par département côté serveur
        setStats(res.data.stats);
        setRequests(res.data.requests);
        setFilteredRequests(res.data.requests);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des données", err);
      });
  }, []);

  // Debounced search filter
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const filtered = requests.filter((request) =>
        request.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRequests(filtered);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, requests]);

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

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sortedRequests.length / requestsPerPage);

  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  );

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h2>Bonjour {JSON.parse(localStorage.getItem("user"))?.name || ""} 👋</h2>
      </header>

      <div className="stats-container">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <i className={`fa ${stat.icon || "fa-chart-bar"}`}></i>
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
                  {stat.change} ce mois
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
                <button
                  className="sort-button"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? "Plus ancien" : "Plus récent"}{" "}
                  <span>▼</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="requests-table">
          <table>
            <thead>
              <tr>
                <th>ID Demande</th>
                <th>Titre</th>
                <th>Type de Marché</th>
                <th>Date de Soumission</th>
                <th>Date de Validation</th>
                <th>État</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((request, index) => (
                <tr 
                  key={index}
                  className="clickable-row"
                  onClick={() => setSelectedRequest(request)}
                >
                  <td>{request.id}</td>
                  <td>{request.title}</td>
                  <td>{request.marche_type || "—"}</td>
                  <td>
                    {request.created_at
                      ? new Date(request.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    {request.status_id > 1 && request.updated_at
                      ? new Date(request.updated_at).toLocaleDateString()
                      : "—"}
                  </td>
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
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            className="pagination-arrow"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <i className="fa fa-arrow-left"></i>
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`pagination-number ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="pagination-arrow"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <i className="fa fa-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* Modal pour afficher la description de la demande */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Détails de la demande</h4>
            <p>
              <strong>ID :</strong> {selectedRequest.id}
            </p>
            <p>
              <strong>Titre :</strong> {selectedRequest.title}
            </p>
            <p>
              <strong>Description :</strong> {selectedRequest.description}
            </p>
            <p>
              <strong>Type de Marché :</strong>{" "}
              {selectedRequest.marche_type || "—"}
            </p>
            <p>
              <strong>Date de Soumission :</strong>{" "}
              {new Date(selectedRequest.created_at).toLocaleDateString()}
            </p>
            <p>
              <strong>État :</strong> {selectedRequest.status}
            </p>
            <p>
              <strong>Département :</strong> {selectedRequest.department_name || "—"}
            </p>
            {selectedRequest.motif && (
              <p>
                <strong>Motif :</strong> {selectedRequest.motif}
              </p>
            )}
            <button
              className="close-button"
              onClick={() => setSelectedRequest(null)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
