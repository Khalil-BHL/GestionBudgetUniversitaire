import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./requestsList.css";

function RequestsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  // Fetch data once
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/requests/pending")
      .then((res) => {
        setRequests(res.data.requests || []);
        setFilteredRequests(res.data.requests || []);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des données", err);
        // Use sample data for demonstration
        const sampleData = [
          {
            id: "REQ-2024-0042",
            title: "Achat PC",
            description: "Acquisition de 4 ordinateurs portables",
            status: "Soumis",
            created_at: "2024-04-23T14:30:00",
            professor: "Prof. Mohammed Alami"
          },
          {
            id: "REQ-2024-0043",
            title: "Fournitures de bureau",
            description: "Papier, stylos et classeurs",
            status: "Soumis",
            created_at: "2024-04-22T10:15:00",
            professor: "Prof. Fatima Zahra"
          },
          {
            id: "REQ-2024-0044",
            title: "Équipement de laboratoire",
            description: "Microscopes et verrerie",
            status: "Soumis",
            created_at: "2024-04-21T09:45:00",
            professor: "Prof. Ahmed Bennani"
          }
        ];
        setRequests(sampleData);
        setFilteredRequests(sampleData);
      });
  }, []);

  // Debounced search filter
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const filtered = requests.filter((request) =>
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRequests(filtered);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, requests]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Soumis":
        return "status-submitted";
      case "En cours d'examen":
        return "status-review";
      case "Approuvé":
        return "status-approved";
      case "Rejeté":
        return "status-rejected";
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
    <div className="requests-list-content">
      <header className="requests-list-header">
        <h2>Demandes à Valider</h2>
      </header>

      <div className="requests-section">
        <div className="requests-header">
          <h3>Liste des demandes</h3>
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
                <th>Description</th>
                <th>Professeur</th>
                <th>Date de Soumission</th>
                <th>État</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((request, index) => (
                <tr key={index}>
                  <td>{request.id}</td>
                  <td>{request.title}</td>
                  <td>{request.description}</td>
                  <td>{request.professor}</td>
                  <td>
                    {request.created_at
                      ? new Date(request.created_at).toLocaleDateString()
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
                  <td>
                    <Link to={`/chef-departement/request/${request.id}`} className="view-button">
                      Examiner
                    </Link>
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
    </div>
  );
}

export default RequestsList;