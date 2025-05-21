import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import { useEffect, useState } from "react";
import "./dashboard.css"; // Assume que tu as les styles du dashboard ici

function AdminUsers() {
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);

  // Charger les données au chargement
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/users")
      .then((res) => {
        setStats(res.data.stats);
        setUsers(res.data.users);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fonction pour modifier un utilisateur (exemple)
  const handleEdit = (id) => {
    alert("Modifier utilisateur ID: " + id);
    // Ici tu peux ouvrir un modal, ou rediriger vers une page d'édition
  };

  // Fonction pour supprimer un utilisateur (exemple)
  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      // Appeler le backend pour supprimer
      axios
        .delete(`http://localhost:5000/api/admin/users/${id}`)
        .then(() => {
          // Retirer l'utilisateur de la liste locale après suppression
          setUsers(users.filter((user) => user.id !== id));
        })
        .catch((err) => {
          alert("Erreur lors de la suppression");
          console.error(err);
        });
    }
  };

  return (
    <div className="admin-users-container" style={{ padding: "20px" }}>
      {/* Statistiques en haut */}
      <div
        className="stats-container"
        style={{ display: "flex", gap: "20px", marginBottom: "30px" }}
      >
        {stats.map((stat, index) => (
          <div
            className="stat-card"
            key={index}
            style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div
              className="stat-icon"
              style={{
                backgroundColor: stat.color,
                color: "#fff",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "24px",
                marginRight: "15px",
              }}
            >
              <i className={`fa ${stat.icon || "fa-chart-bar"}`}></i>
            </div>
            <div className="stat-info">
              <p style={{ margin: 0, fontWeight: "600", color: "#666" }}>
                {stat.title}
              </p>
              <h3 style={{ margin: "5px 0" }}>{stat.value}</h3>
              {stat.change && (
                <p
                  style={{
                    margin: 0,
                    color: stat.change.startsWith("+") ? "#4caf50" : "#f44336",
                    fontWeight: "bold",
                  }}
                >
                  {stat.change} ce mois
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Table des utilisateurs */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              ID
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Nom
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Email
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{user.id}</td>
              <td style={{ padding: "10px" }}>{user.name}</td>
              <td style={{ padding: "10px" }}>{user.email}</td>
              <td style={{ padding: "10px" }}>
                <button
                  onClick={() => handleEdit(user.id)}
                  style={{
                    marginRight: "10px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{
                    padding: "5px 10px",
                    cursor: "pointer",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                  }}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" style={{ padding: "10px", textAlign: "center" }}>
                Aucun utilisateur trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
