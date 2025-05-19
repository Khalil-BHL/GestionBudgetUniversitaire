import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import React, { useEffect, useState } from "react";
import "./dashboard.css";

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [typeMarches, setTypeMarches] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedTypeMarche, setSelectedTypeMarche] = useState("");
  const [editingStatus, setEditingStatus] = useState(null);
  const requestsPerPage = 5;

  // Define available statuses
  const availableStatuses = [
    "Brouillon",
    "Soumis",
    "En cours d'examen",
    "Approuvé",
    "Rejeté",
    "Commandé",
    "Reçu"
  ];

  // Function to update request status (client-side only for now)
  const updateRequestStatus = (requestId, newStatus) => {
    console.log(`Would update request ${requestId} to status: ${newStatus}`);
    
    // Update the UI without making an API call
    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        return { ...req, status: newStatus };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    setFilteredRequests(updatedRequests);
    setEditingStatus(null); // Close the dropdown
    
    // Show a message to the user
    alert(`Statut mis à jour (mode local uniquement): ${newStatus}`);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
      console.error("Utilisateur non connecté");
      window.location.href = "/";
      return;
    }

    if (user.role !== 'Comptable') {
      console.error("Accès non autorisé");
      window.location.href = "/";
      return;
    }
    
    // Fetch departments from API
    axios.get("http://localhost:5000/api/departments")
      .then(res => {
        console.log('Raw departments response:', res);
        console.log('Departments response data:', res.data);
        
        if (Array.isArray(res.data)) {
          // If the response is already an array, use it directly
          setDepartments(res.data);
        } else {
          console.error('Invalid departments data format:', res.data);
        }
      })
      .catch(err => {
        console.error("Error fetching departments:", err);
        console.error("Error details:", err.response || err.message);
      });

    // Fetch type marches
    axios.get("http://localhost:5000/api/type-marches")
      .then(res => {
        console.log('Type marches response:', res.data);
        if (res.data && res.data.data && Array.isArray(res.data.data)) {
          setTypeMarches(res.data.data);
        } else if (Array.isArray(res.data)) {
          setTypeMarches(res.data);
        } else if (res.data && typeof res.data === 'object') {
          const typeMarchesData = Object.values(res.data).filter(item => item && typeof item === 'object');
          setTypeMarches(typeMarchesData);
        }
      })
      .catch(err => {
        console.error("Error fetching type marches:", err);
      });

    // Fetch statuses from API
    axios.get("http://localhost:5000/api/status")
      .then(res => {
        console.log('Statuses response:', res.data);
        if (Array.isArray(res.data)) {
          setStatuses(res.data);
        }
      })
      .catch(err => {
        console.error("Error fetching statuses:", err);
      });

    // Fetch dashboard data
    axios.get("http://localhost:5000/api/dashboard", {
      params: {
        userId: user.id,
        userRole: user.role
      }
    })
    .then((res) => {
      console.log('Dashboard Data:', res.data);
      // Filter out requests with status IDs 1 and 5 before setting stats
      const filteredRequests = res.data.requests.filter(request => request.status_id !== 1 && request.status_id !== 5);
      
      // Update stats with the filtered request count
      const updatedStats = res.data.stats.map(stat => {
        if (stat.title === "Total Requests") {
          return {
            ...stat,
            value: filteredRequests.length.toString()
          };
        }
        return stat;
      });
      
      setStats(updatedStats);
      setRequests(res.data.requests);
      setFilteredRequests(filteredRequests);
      
      // Add this debugging code
      if (res.data.requests && res.data.requests.length > 0) {
        console.log('Example request object:', res.data.requests[0]);
        console.log('Request type_marche_id field:', res.data.requests[0].type_marche_id);
        console.log('Request marche_type field:', res.data.requests[0].marche_type);
      }
    })
    .catch((err) => {
      console.error("Erreur lors de la récupération des données", err);
    });
  }, []);

  useEffect(() => {
    let filtered = [...requests];
    console.log('Original requests:', filtered);
    console.log('Selected department:', selectedDepartment);
    console.log('Selected type marche:', selectedTypeMarche);
    console.log('Available departments:', departments);
    console.log('Available type marches:', typeMarches);

    // Filter out requests with status IDs 1 and 5
    filtered = filtered.filter(request => request.status_id !== 1 && request.status_id !== 5);

    // Apply department filter
    if (selectedDepartment) {
      console.log('Filtering by department ID:', selectedDepartment);
      filtered = filtered.filter(request => {
        console.log(`Request ${request.id} department:`, request.department_id);
        return request.department_id === parseInt(selectedDepartment);
      });
    }

    // Apply type marche filter
    if (selectedTypeMarche) {
      console.log('Filtering by type marche:', selectedTypeMarche);
      console.log('Type of selectedTypeMarche:', typeof selectedTypeMarche);
      
      // Check if any requests have the marche_type field
      const hasTypeMarche = requests.some(req => req.marche_type !== undefined);
      console.log('Any requests have marche_type?', hasTypeMarche);
      
      // Check what field names might contain the type marche info
      if (requests.length > 0) {
        console.log('Request fields:', Object.keys(requests[0]));
      }
      
      filtered = filtered.filter(request => {
        console.log(`Request ${request.id} marche_type:`, request.marche_type);
        
        // Try to match by name or ID depending on how marche_type is stored
        if (typeof request.marche_type === 'string') {
          // If marche_type is a string, try to match with the name from typeMarches
          const selectedTypeName = typeMarches.find(t => t.id === parseInt(selectedTypeMarche))?.name;
          return request.marche_type === selectedTypeName;
        } else if (typeof request.marche_type === 'number') {
          // If marche_type is a number, compare directly
          return request.marche_type === parseInt(selectedTypeMarche);
        } else {
          // If marche_type is something else or undefined, no match
          return false;
        }
      });
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(request =>
        (request.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (request.title?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );
    }

    console.log('Filtered results:', filtered);
    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [searchQuery, requests, selectedDepartment, selectedTypeMarche]);

  // ADD THE useEffect HERE, OUTSIDE OF THE OTHER useEffect
  useEffect(() => {
    console.log('Departments state updated:', departments);
  }, [departments]);

  // Add this useEffect for debugging type marches
  useEffect(() => {
    console.log('Type marches state updated:', typeMarches);
  }, [typeMarches]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Brouillon": return "status-draft";
      case "Soumis": return "status-submitted";
      case "En cours d'examen": return "status-review";
      case "Approuvé": return "status-approved";
      case "Rejeté": return "status-rejected";
      case "Commandé": return "status-ordered";
      case "Reçu": return "status-received";
      default: return "";
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
                <p className={`stat-change ${stat.change.startsWith("+") ? "positive" : "negative"}`}>
                  {stat.change} ce mois
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="requests-section">
        <div className="requests-header">
          <h3>Les demandes</h3>
          <div className="requests-actions">
            <div className="filter-container">
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  console.log('Selected department changed to:', e.target.value);
                  setSelectedDepartment(e.target.value);
                }}
                className="filter-select"
              >
                <option value="">Tous les départements</option>
                {departments && departments.length > 0 ? (
                  departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name || dept.department_name || `Département ${dept.id}`}
                    </option>
                  ))
                ) : (
                  <option disabled>Chargement des départements...</option>
                )}
              </select>

              <select
                value={selectedTypeMarche}
                onChange={(e) => {
                  const value = e.target.value;
                  console.log('Selected type marché changed to:', value);
                  console.log('Type of selected value:', typeof value);
                  console.log('Select element options:', e.target.options);
                  console.log('Selected option text:', e.target.options[e.target.selectedIndex].text);
                  setSelectedTypeMarche(value);
                  
                  // Force a check of the requests that should match this type
                  const matchingRequests = requests.filter(req => 
                    req.type_marche_id === parseInt(value) || 
                    String(req.type_marche_id) === value
                  );
                  console.log('Matching requests for this type:', matchingRequests);
                }}
                className="filter-select"
              >
                <option value="">Tous les types de marché</option>
                {typeMarches && typeMarches.length > 0 ? (
                  typeMarches.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name || `Type ${type.id}`}
                    </option>
                  ))
                ) : (
                  <option disabled>Chargement des types de marché...</option>
                )}
              </select>
            </div>

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
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
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
            <colgroup>
              <col style={{ width: "8%" }} /> {/* ID Demande */}
              <col style={{ width: "15%" }} /> {/* Titre */}
              <col style={{ width: "25%" }} /> {/* Description */}
              <col style={{ width: "15%" }} /> {/* Type de Marché */}
              <col style={{ width: "15%" }} /> {/* Département */}
              <col style={{ width: "12%" }} /> {/* Date de Soumission */}
              <col style={{ width: "10%" }} /> {/* État */}
            </colgroup>
            <thead>
              <tr>
                <th>ID Demande</th>
                <th>Titre</th>
                <th>Description</th>
                <th>Type de Marché</th>
                <th>Département</th>
                <th>Date de Soumission</th>
                <th>État</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((request, index) => (
                <tr 
                  key={index} 
                  className="clickable-row"
                  onClick={(e) => {
                    // Only set selected request if we're not clicking on the status badge
                    if (!e.target.closest('.status-badge')) {
                      setSelectedRequest(request);
                    }
                  }}
                >
                  <td title={request.id}>{request.id}</td>
                  <td title={request.title}>{request.title}</td>
                  <td title={request.description}>{request.description}</td>
                  <td title={request.marche_type || "—"}>{request.marche_type || "—"}</td>
                  <td title={request.department_name || "—"}>{request.department_name || "—"}</td>
                  <td title={request.created_at ? new Date(request.created_at).toLocaleDateString() : "—"}>
                    {request.created_at
                      ? new Date(request.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {editingStatus === request.id ? (
                      <div className="status-dropdown-container">
                        <select 
                          className="status-dropdown"
                          value={request.status}
                          onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                          onBlur={() => setEditingStatus(null)}
                        >
                          {statuses
                            .filter(status => status.id > 3 && status.id !== 5)
                            .map(status => (
                              <option key={status.id} value={status.name}>
                                {status.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    ) : (
                      <span 
                        className={`status-badge ${getStatusBadgeClass(request.status)}`}
                        onClick={() => setEditingStatus(request.id)}
                      >
                        {request.status}
                      </span>
                    )}
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
              className={`pagination-number ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="pagination-arrow"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <i className="fa fa-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* Modal for displaying request details */}
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
              <strong>Département :</strong>{" "}
              {selectedRequest.department_name || "—"}
            </p>
            <p>
              <strong>Date de Soumission :</strong>{" "}
              {new Date(selectedRequest.created_at).toLocaleDateString()}
            </p>
            <p>
              <strong>État :</strong> {selectedRequest.status}
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