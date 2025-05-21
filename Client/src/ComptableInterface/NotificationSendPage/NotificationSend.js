import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPaperPlane, FaUsers, FaBuilding, FaUser } from "react-icons/fa";
import Swal from 'sweetalert2';
import "./notificationSend.css";

function NotificationSend() {
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    recipientType: "all", // 'all', 'department', or 'user'
    departmentId: "",
    userId: ""
  });
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Check if user is logged in
    if (!user) {
      console.error("Utilisateur non connecté");
      window.location.href = "/";
      return;
    }

    // Verify user role
    if (user.role !== 'Comptable') {
      console.error("Accès non autorisé");
      window.location.href = "/";
      return;
    }
    
    // Fetch departments
    fetchDepartments();
    
    // Fetch users
    fetchUsers();
  }, []);

  const fetchDepartments = async () => {
    try {
      // Using static departments for now, can be replaced with API call
      const staticDepartments = [
        { id: 1, name: "Informatique" },
        { id: 2, name: "GUE" },
        { id: 3, name: "TM" },
        { id: 4, name: "3M" },
        { id: 5, name: "MI" }
      ];
      setDepartments(staticDepartments);
      
      // Uncomment to use API when available
      /*
      const response = await axios.get("http://localhost:5000/api/departments");
      if (response.data && Array.isArray(response.data)) {
        setDepartments(response.data);
      } else if (response.data && response.data.departments) {
        setDepartments(response.data.departments);
      }
      */
    } catch (err) {
      console.error("Erreur lors de la récupération des départements", err);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      const response = await axios.get("http://localhost:5000/api/user/list", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      console.log("API Response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Filter out users with role_id == 1
        const filteredUsers = response.data.filter(user => user.role_id !== 1);
        console.log("Filtered users:", filteredUsers);
        setUsers(filteredUsers);
      } else if (response.data && response.data.users) {
        // Filter out users with role_id == 1
        const filteredUsers = response.data.users.filter(user => user.role_id !== 1);
        console.log("Filtered users:", filteredUsers);
        setUsers(filteredUsers);
      } else {
        console.error("Unexpected API response format:", response.data);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Format de réponse inattendu",
          text: "La réponse du serveur n'est pas dans le format attendu",
          showConfirmButton: false,
          timer: 3000
        });
      }
    } catch (err) {
      console.error("Detailed error:", err);
      console.error("Error response:", err.response);
      
      let errorMessage = "Erreur lors de la récupération des utilisateurs";
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error status:", err.response.status);
        console.error("Error data:", err.response.data);
        
        if (err.response.status === 401) {
          errorMessage = "Session expirée. Veuillez vous reconnecter.";
          // Redirect to login page
          window.location.href = "/";
          return;
        } else if (err.response.status === 403) {
          errorMessage = "Accès non autorisé";
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        errorMessage = "Le serveur ne répond pas. Veuillez vérifier votre connexion.";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", err.message);
      }

      Swal.fire({
        position: "top-end",
        icon: "error",
        title: errorMessage,
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotificationData({ ...notificationData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data based on recipient type
      const notificationPayload = {
        title: notificationData.title,
        message: notificationData.message,
        recipientType: notificationData.recipientType
      };

      // Add specific recipient data if needed
      if (notificationData.recipientType === "department") {
        notificationPayload.departmentId = notificationData.departmentId;
      } else if (notificationData.recipientType === "user") {
        notificationPayload.userId = notificationData.userId;
      }

      // For now, we'll just log the payload and show a success message
      // This would be replaced with an actual API call
      console.log("Sending notification:", notificationPayload);
      
      // Simulate API call
      // const response = await axios.post("http://localhost:5000/api/notifications/send", notificationPayload);
      
      // Show success message
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Notification envoyée avec succès",
        showConfirmButton: false,
        timer: 1500
      });

      // Reset form
      setNotificationData({
        title: "",
        message: "",
        recipientType: "all",
        departmentId: "",
        userId: ""
      });
    } catch (err) {
      console.error("Erreur lors de l'envoi de la notification:", err);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Erreur lors de l'envoi de la notification",
        showConfirmButton: false,
        timer: 1500
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notifications-bg">
      <div className="notifications-container">
        <h2 className="notifications-title">ENVOYER DES NOTIFICATIONS</h2>
        <div className="notifications-card">
          <div className="notification-options">
            <div className="recipient-types">
              <div 
                className={`recipient-option ${notificationData.recipientType === "all" ? "active" : ""}`}
                onClick={() => setNotificationData({...notificationData, recipientType: "all"})}
              >
                <div className="recipient-icon">
                  <FaUsers />
                </div>
                <span>Tous les utilisateurs</span>
              </div>
              
              <div 
                className={`recipient-option ${notificationData.recipientType === "department" ? "active" : ""}`}
                onClick={() => setNotificationData({...notificationData, recipientType: "department"})}
              >
                <div className="recipient-icon">
                  <FaBuilding />
                </div>
                <span>Département spécifique</span>
              </div>
              
              <div 
                className={`recipient-option ${notificationData.recipientType === "user" ? "active" : ""}`}
                onClick={() => setNotificationData({...notificationData, recipientType: "user"})}
              >
                <div className="recipient-icon">
                  <FaUser />
                </div>
                <span>Utilisateur spécifique</span>
              </div>
            </div>
          </div>

          <form className="notification-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Titre de la notification</label>
              <input
                type="text"
                id="title"
                name="title"
                value={notificationData.title}
                onChange={handleChange}
                placeholder="Entrez le titre de la notification"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={notificationData.message}
                onChange={handleChange}
                placeholder="Entrez le contenu de votre notification"
                required
              ></textarea>
            </div>

            {notificationData.recipientType === "department" && (
              <div className="form-group">
                <label htmlFor="departmentId">Sélectionnez un département</label>
                <select
                  id="departmentId"
                  name="departmentId"
                  value={notificationData.departmentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choisir un département</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {notificationData.recipientType === "user" && (
              <div className="form-group">
                <label htmlFor="userId">Sélectionnez un utilisateur</label>
                <select
                  id="userId"
                  name="userId"
                  value={notificationData.userId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner un utilisateur</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="send-button" disabled={loading}>
                <FaPaperPlane /> {loading ? "Envoi en cours..." : "Envoyer la notification"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NotificationSend;