import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import "./request.css";

function RequestPage() {
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    quantite: "",
    category: "",
  });

  // ✅ Catégories fixées côté front-end
  const categories = [
    { id: 1, name: "Matériel informatique" },
    { id: 2, name: "Fournitures de bureau" },
    { id: 3, name: "Services de maintenance" },
    { id: 4, name: "Équipement de laboratoire" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        title: newRequest.title,
        description: newRequest.description,
        quantity: parseInt(newRequest.quantite),
        type_marche_id: parseInt(newRequest.category),
      };

      const response = await axios.post(
        "http://localhost:5000/api/purchase-requests",
        requestData
      );

      if (response.data.status === "success") {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Votre demande est bien enregistrée",
          showConfirmButton: false,
          timer: 1500,
        });

        setNewRequest({
          title: "",
          description: "",
          quantite: "",
          category: "",
        });
      }
    } catch (err) {
      console.error(
        "Erreur lors de la soumission :",
        err.response ? err.response.data : err.message
      );
      Swal.fire({
        position: "top-end",
        icon: "error",
        title:
          err.response?.data?.message ||
          "Erreur lors de la soumission de la demande",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="request-container">
      <h1>Demande de Budget</h1>
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
            placeholder="Décrivez la demande"
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
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
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
