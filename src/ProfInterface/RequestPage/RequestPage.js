import React, { useState } from "react";
import "./request.css";

function RequestPage() {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    quantite: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  const handleAddRequest = () => {
    if (
      newRequest.title.trim() &&
      newRequest.description.trim() &&
      newRequest.quantite.trim() &&
      newRequest.category
    ) {
      setRequests([newRequest, ...requests]); // Ajouter la nouvelle demande à la liste
      setNewRequest({ title: "", description: "", quantite: "", category: "" });
    } else {
      alert("Veuillez remplir tous les champs de la demande.");
    }
  };

  const handleDeleteRequest = (index) => {
    const newRequests = requests.filter((_, i) => i !== index); // Supprimer la demande
    setRequests(newRequests);
  };

  const handleEditRequest = (index) => {
    const requestToEdit = requests[index];
    setNewRequest(requestToEdit); // Remplir les champs avec la demande à modifier
    handleDeleteRequest(index); // Supprimer la demande de la liste
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Toutes les demandes soumises:", requests);
    // Envoyer vers le backend ici
  };

  return (
    <div className="request-container">
      <h1>Nouvelle Demande</h1>
      <p>Formulaire de demande de budget</p>

      <form className="request-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre de la demande</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newRequest.title}
            onChange={handleChange}
            placeholder="Titre de la demande"
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
          >
            <option value="">Sélectionnez une catégorie</option>
            <option value="equipment">Équipement</option>
            <option value="supplies">Fournitures</option>
            <option value="travel">Déplacement</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleAddRequest}
            className="add-button"
          >
            + Ajouter une nouvelle demande
          </button>
          <button type="submit" className="submit-button">
            Soumettre toutes les demandes
          </button>
        </div>
      </form>

      {/* Liste des demandes*/}
      <div className="requests-list">
        {requests.length > 0 && (
          <div className="added-requests">
            {requests.map((req, index) => (
              <div key={index} className="request-card">
                <h3>{req.title || "Titre de la demande"}</h3>
                <p>{req.description || "Description de la demande"}</p>
                <p>Quantité: {req.quantite || "0"}</p>
                <p>Catégorie: {req.category || "Non spécifiée"}</p>

                <div className="request-actions">
                  <button
                    type="button"
                    onClick={() => handleEditRequest(index)}
                    className="edit-button"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteRequest(index)}
                    className="delete-button"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestPage;
