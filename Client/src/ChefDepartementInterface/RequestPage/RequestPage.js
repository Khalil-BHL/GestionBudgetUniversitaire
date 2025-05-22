import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RequestPage.css';
import { MdPerson, MdCategory, MdDescription, MdAttachMoney, MdThumbUp, MdThumbDown } from 'react-icons/md';

function RequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [decision, setDecision] = useState('');
  const [comment, setComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
      navigate('/');
      return;
    }

    // Fetch specific request
    axios.get(`http://localhost:5000/api/dashboard/request/${id}`, {
      params: {
        userId: user.id,
        userRole: user.role
      }
    })
    .then(res => {
      if (res.data.request) {
        setRequest(res.data.request);
      } else {
        setError("Demande non trouvée");
      }
    })
    .catch(err => {
      console.error("Erreur lors de la récupération des données", err);
      setError("Une erreur est survenue lors du chargement de la demande");
    });
  }, [id, navigate]);

  const handleApprove = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post("http://localhost:5000/api/dashboard/validate-request", {
        requestId: request.id,
        decision: 'approved',
        comment: comment,
        validatorId: user.id
      });

      if (response.data.status === 'success') {
        setDecision('approved');
        setShowRejectionInput(false);
      }
    } catch (err) {
      console.error("Erreur lors de l'approbation de la demande:", err);
      alert("Une erreur est survenue lors de l'approbation de la demande");
    }
  };

  const handleReject = async () => {
    if (showRejectionInput && rejectionReason.trim() !== '') {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.post("http://localhost:5000/api/dashboard/validate-request", {
          requestId: request.id,
          decision: 'rejected',
          rejectionReason: rejectionReason,
          comment: comment,
          validatorId: user.id
        });

        if (response.data.status === 'success') {
          setDecision('rejected');
        }
      } catch (err) {
        console.error("Erreur lors du rejet de la demande:", err);
        alert("Une erreur est survenue lors du rejet de la demande");
      }
    } else {
      setShowRejectionInput(true);
    }
  };

  if (error) {
    return (
      <div className="request-preview-container">
        <div className="error-message">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/chef-departement/requests')}>
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="request-preview-container">
        <div className="loading-message">
          <h2>Chargement...</h2>
          <p>Veuillez patienter pendant le chargement de la demande.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="request-preview-container">
      <div className="request-preview-header">
        <h1>Validation de Demande</h1>
        <div className="request-status">
          <span className={`status-badge status-${request.status.toLowerCase()}`}>
            {request.status}
          </span>
        </div>
      </div>

      <div className="request-preview-card">
        <div className="request-id-section">
          <h2>Demande #{request.id}</h2>
          <p className="submission-date">
            Soumis le {new Date(request.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="request-details-grid">
          <div className="detail-item">
            <div className="detail-icon">
              <MdPerson />
            </div>
            <div className="detail-content">
              <h3>Demandeur</h3>
              <p>{request.user_name}</p>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <MdCategory />
            </div>
            <div className="detail-content">
              <h3>Type de Marché</h3>
              <p>{request.marche_type || "—"}</p>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <MdAttachMoney />
            </div>
            <div className="detail-content">
              <h3>Date de Mise à Jour</h3>
              <p>{request.updated_at ? new Date(request.updated_at).toLocaleDateString() : "—"}</p>
            </div>
          </div>
        </div>

        <div className="request-description-section">
          <div className="section-header">
            <MdDescription className="section-icon" />
            <h3>Description de la demande</h3>
          </div>
          <div className="description-content">
            <p>{request.description}</p>
          </div>
        </div>

        {/* Chef Département Decision Section */}
        <div className="decision-section">
          <h3>Votre Décision</h3>
          
          {decision ? (
            <div className={`decision-result ${decision}`}>
              <div className="decision-icon">
                {decision === 'approved' ? <MdThumbUp /> : <MdThumbDown />}
              </div>
              <div className="decision-text">
                <h4>{decision === 'approved' ? 'Demande Approuvée' : 'Demande Rejetée'}</h4>
                <p>Votre décision a été enregistrée.</p>
                {decision === 'rejected' && rejectionReason && (
                  <p className="rejection-reason">
                    <strong>Motif de rejet:</strong> {rejectionReason}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              {!showRejectionInput && (
                <div className="comment-field">
                  <label htmlFor="comment">Commentaire (optionnel)</label>
                  <textarea 
                    id="comment" 
                    rows="3" 
                    placeholder="Ajoutez un commentaire concernant votre décision..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
              )}
              
              {showRejectionInput ? (
                <div className="rejection-reason-container">
                  <label htmlFor="rejectionReason">Motif de rejet <span className="required">*</span></label>
                  <textarea 
                    id="rejectionReason" 
                    rows="3" 
                    placeholder="Veuillez indiquer le motif du rejet..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    required
                  ></textarea>
                  
                  <div className="rejection-buttons">
                    <button className="cancel-button" onClick={() => setShowRejectionInput(false)}>
                      Annuler
                    </button>
                    <button 
                      className="confirm-reject-button" 
                      onClick={handleReject}
                      disabled={rejectionReason.trim() === ''}
                    >
                      Confirmer le rejet
                    </button>
                  </div>
                </div>
              ) : (
                <div className="decision-buttons">
                  <button className="reject-button" onClick={handleReject}>
                    <MdThumbDown /> Rejeter
                  </button>
                  <button className="approve-button" onClick={handleApprove}>
                    <MdThumbUp /> Approuver
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestPage;