import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import { useEffect, useState } from "react";
import "./dashboard.css"; // Assume que tu as les styles du dashboard ici

function AdminUsers() {
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les données au chargement
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/users/list");
        setUsers(response.data);
        
        // Calculate stats from users data
        const stats = [
          {
            title: "Total Users",
            value: response.data.length,
            icon: "fa-users",
            color: "#4CAF50"
          },
          {
            title: "Professors",
            value: response.data.filter(user => user.role_id === 3).length,
            icon: "fa-user-graduate",
            color: "#2196F3"
          },
          {
            title: "Chefs de Département",
            value: response.data.filter(user => user.role_id === 4).length,
            icon: "fa-user-tie",
            color: "#FF9800"
          }
        ];
        setStats(stats);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour modifier un utilisateur
  const handleEdit = (id) => {
    alert("Modifier utilisateur ID: " + id);
    // Ici tu peux ouvrir un modal, ou rediriger vers une page d'édition
  };

  // Fonction pour supprimer un utilisateur
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        // Retirer l'utilisateur de la liste locale après suppression
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression");
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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
              <i className={`fa ${stat.icon}`}></i>
            </div>
            <div className="stat-info">
              <p style={{ margin: 0, fontWeight: "600", color: "#666" }}>
                {stat.title}
              </p>
              <h3 style={{ margin: "5px 0" }}>{stat.value}</h3>
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
              Rôle
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
                {user.role_id === 3 ? "Professeur" : "Chef de Département"}
              </td>
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
              <td colSpan="5" style={{ padding: "10px", textAlign: "center" }}>
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
