import axios from "axios";
import React, { useEffect, useState } from "react";

function RequestPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/professor/dashboard")
      .then((res) => {
        setRequests(res.data);
        console.log("Données récupérées:", res.data);
      })
      .catch((err) => {
        console.error(
          "Erreur lors de la récupération des demandes des professeurs",
          err.response || err
        );
      });
  }, []);

  return (
    <div className="request-page">
      <h2>Demandes des Professeurs</h2>
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
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.description}</td>
                <td>{request.marche_type || "—"}</td>
                <td>
                  {request.created_at
                    ? new Date(request.created_at).toLocaleDateString()
                    : "—"}
                </td>
                <td>
                  {request.status_id === 4 && request.updated_at
                    ? new Date(request.updated_at).toLocaleDateString()
                    : "—"}
                </td>
                <td>{request.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Aucune demande trouvée.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RequestPage;
