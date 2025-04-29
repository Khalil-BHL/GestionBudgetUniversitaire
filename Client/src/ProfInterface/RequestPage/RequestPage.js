import React from 'react';
import './request.css';

function RequestPage() {
  return (
    <div className="request-container">
      <h1>Nouvelle Demande</h1>
      <p>Formulaire de demande de budget</p>
      
      {/* Add your form elements here */}
      <form className="request-form">
        <div className="form-group">
          <label htmlFor="title">Titre de la demande</label>
          <input type="text" id="title" name="title" placeholder="Entrez le titre de votre demande" />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows="4" placeholder="Décrivez votre demande en détail"></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Montant (MAD)</label>
          <input type="number" id="amount" name="amount" placeholder="0.00" />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <select id="category" name="category">
            <option value="">Sélectionnez une catégorie</option>
            <option value="equipment">Équipement</option>
            <option value="supplies">Fournitures</option>
            <option value="travel">Déplacement</option>
            <option value="other">Autre</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button">Annuler</button>
          <button type="submit" className="submit-button">Soumettre la demande</button>
        </div>
      </form>
    </div>
  );
}

export default RequestPage;