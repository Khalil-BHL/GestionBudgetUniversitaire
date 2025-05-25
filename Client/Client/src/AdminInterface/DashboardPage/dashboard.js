import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import "./dashboard.css"; // Assume que tu as les styles du dashboard ici

function AdminUsers() {
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
    department: "",
  });

  // Charger les données au chargement
  useEffect(() => {
    fetchData();
    fetchDepartments();
    fetchRoles();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/departments");
      if (response.data && Array.isArray(response.data)) {
        setDepartments(response.data);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/roles");
      if (response.data && Array.isArray(response.data)) {
        setRoles(response.data);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("http://localhost:5000/api/users/list");
      const userData = response.data;
      setUsers(userData);
      
      // Calculate stats from users data
      const stats = [
        {
          title: "Total d'utilisateurs",
          value: userData.length,
          icon: "fa-users",
          color: "#4CAF50"
        },
        {
          title: "Direction",
          value: userData.filter(user => user.role === "Direction").length,
          icon: "fa-building",
          color: "#2196F3"
        },
        {
          title: "Comptable",
          value: userData.filter(user => user.role === "Comptable").length,
          icon: "fa-calculator",
          color: "#FF9800"
        },
        {
          title: "Chefs de Département",
          value: userData.filter(user => user.role_id === 4).length,
          icon: "fa-user-circle",  // Changed to a more basic icon
          color: "#9C27B0"
        },
        {
          title: "Professeurs",
          value: userData.filter(user => user.role_id === 3).length,
          icon: "fa-user",  // Changed to a more basic icon
          color: "#E91E63"
        }
      ];
      setStats(stats);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour modifier un utilisateur
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      password: "",
      role_id: user.role_id,
      department: user.department,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${editingUser.id}`, editForm);
      setUsers(users.map(user => user.id === editingUser.id ? response.data : user));
      setEditingUser(null);
      setEditForm({
        name: "",
        email: "",
        password: "",
        role_id: "",
        department: "",
      });
      // Refresh stats
      fetchData();
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: 'Utilisateur modifié avec succès',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      console.error("Error updating user:", err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: err.response?.data?.message || "Erreur lors de la modification de l'utilisateur"
      });
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({
      name: "",
      email: "",
      password: "",
      role_id: "",
      department: "",
    });
  };

  // Fonction pour supprimer un utilisateur
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        // First, delete related notifications
        await axios.delete(`http://localhost:5000/api/notifications/user/${id}`);
        
        // Then delete the user
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        setUsers(users.filter(user => user.id !== id));
        // Refresh stats
        fetchData();
        
        Swal.fire({
          icon: 'success',
          title: 'Supprimé!',
          text: 'Utilisateur et ses notifications supprimés avec succès',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Error deleting user:", err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur!',
          text: err.response?.data?.message || "Erreur lors de la suppression de l'utilisateur. Veuillez réessayer plus tard."
        });
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

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Modifier l'utilisateur</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <input
                  name="name"
                  placeholder="Nom"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <input
                  name="password"
                  type="password"
                  placeholder="Nouveau mot de passe (optionnel)"
                  value={editForm.password}
                  onChange={handleEditChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <select
                  name="role_id"
                  value={editForm.role_id}
                  onChange={handleEditChange}
                  required
                  className="form-control"
                >
                  <option value="">Sélectionnez un rôle</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <select
                  name="department"
                  value={editForm.department}
                  onChange={handleEditChange}
                  required
                  className="form-control"
                >
                  <option value="">Sélectionnez un département</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="btn-cancel"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-save"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              Département
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
              <td style={{ padding: "10px" }}>{roles.find(r => r.id === user.role_id)?.name || user.role}</td>
              <td style={{ padding: "10px" }}>{user.department}</td>
              <td style={{ padding: "10px" }}>
                <button
                  onClick={() => handleEdit(user)}
                  style={{
                    marginRight: "10px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px"
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
                    borderRadius: "4px"
                  }}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="6" style={{ padding: "10px", textAlign: "center" }}>
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
