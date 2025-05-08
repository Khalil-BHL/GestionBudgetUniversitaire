import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import "./request.css";

function RequestPage() {
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    quantite: "",
    category: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/type-marches");
        setStatus(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des types de marchés");
        setLoading(false);
        console.error("Error fetching type marches:", err);
      }
    };

    fetchStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get user info from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        throw new Error("User not authenticated");
      }

      console.log('Submitting request with data:', {
        title: newRequest.title,
        description: newRequest.description,
        quantity: parseInt(newRequest.quantite),
        type_marche_id: parseInt(newRequest.category),
        user_id: user.id
      });

      const response = await axios.post("http://localhost:5000/api/purchase-requests", {
        title: newRequest.title,
        description: newRequest.description,
        quantity: parseInt(newRequest.quantite),
        type_marche_id: parseInt(newRequest.category),
        user_id: user.id
      });

      if (response.data.status === 'success') {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Votre demande est bien enregistré",
          showConfirmButton: false,
          timer: 1500
        });
        setNewRequest({ title: "", description: "", quantite: "", category: "" });
      }
    } catch (err) {
      console.error('Error submitting request:', err.response ? err.response.data : err.message);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: err.response?.data?.message || "Erreur lors de la soumission de la demande",
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div className="request-container">
      <h1>Nouvelle Demande</h1>
      <p>Remplissez les champs pour soumettre votre demande</p>

      <form className="request-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre de la demande</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newRequest.title}
            onChange={handleChange}
            placeholder="Ex: Achat PC"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={newRequest.description}
            onChange={handleChange}
            placeholder="Décrivez l'objet de la demande"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="quantite">Quantité</label>
          <input
            type="number"
            id="quantite"
            name="quantite"
            value={newRequest.quantite}
            onChange={handleChange}
            placeholder="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <select
            id="category"
            name="category"
            value={newRequest.category}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Sélectionnez une catégorie</option>
            {status && status.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {loading && <p>Chargement des catégories...</p>}
          {error && <p className="error">{error}</p>}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Soumettre la demande
          </button>
        </div>
      </form>
    </div>
  );
}

export default RequestPage;
